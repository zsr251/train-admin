<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item prop="courseName">
				<el-input v-model="state.queryForm.courseName" placeholder="课程名称"></el-input>
			</el-form-item>
			<el-form-item prop="courseCode">
				<el-input v-model="state.queryForm.courseCode" placeholder="课程编码"></el-input>
			</el-form-item>
			<el-form-item prop="teacherCode">
				<train-dict-select v-model="state.queryForm.teacherCode" dict-type="teacher_code" clearable placeholder="任课老师"></train-dict-select>
			</el-form-item>
			<el-form-item prop="courseStatus">
				<train-dict-select v-model="state.queryForm.courseStatus" dict-type="course_status" clearable placeholder="课程状态"></train-dict-select>
			</el-form-item>
			<el-form-item>
				<el-button icon="Search" type="primary" @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button icon="RefreshRight" @click="reset(queryRef)">重置</el-button>
			</el-form-item>
			<el-space>
				<el-popconfirm title="确定要导出吗?" @confirm="downloadExcel('/train/course/export', state.queryForm)">
					<template #reference>
						<el-button icon="Download" >导出</el-button>
					</template>
				</el-popconfirm>
			</el-space>
		</el-form>
	</el-card>

	<el-card>
		<el-space>
			<el-space>
				<el-button v-auth="'train:course:save'" icon="Plus" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-space>
			<el-space>
				<el-button v-auth="'train:course:delete'" icon="Delete" plain type="danger" @click="deleteBatchHandle()">批量删除</el-button>
			</el-space>
		</el-space>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="courseCode" label="课程编码" header-align="center" align="center"></el-table-column>
			<el-table-column prop="courseName" label="课程名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="teacherName" label="任课老师" header-align="center" align="center"></el-table-column>
			<el-table-column prop="courseHourTotal" label="总课时数" header-align="center" align="center"></el-table-column>
			<el-table-column prop="courseHourOnce" label="每次课课时" header-align="center" align="center"></el-table-column>
			<el-table-column prop="amountOneHour" label="每课时收费" header-align="center" align="center"></el-table-column>
			<train-dict-column prop="courseStatus" label="课程状态" dict-type="course_status"></train-dict-column>
			<train-dict-column prop="classType" label="关联班级类型" dict-type="class_type"></train-dict-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="200">
				<template #default="scope">
					<el-button v-auth="'train:course:update'" type="primary" link @click="enrollCourse(scope.row)">报名</el-button>
					<el-button v-auth="'train:course:delete'" type="primary" link @click="openTimetable(scope.row.courseCode)">试听</el-button>
					<el-button v-auth="'train:course:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-dropdown v-auth="'sys:role:update'" @command="(command: string) => handleCommand(command, scope.row)">
						<el-button type="primary" class="el-dropdown-link" link>更多</el-button>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item command="user">删除</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			:current-page="state.page"
			:page-sizes="state.pageSizes"
			:page-size="state.limit"
			:total="state.total"
			layout="total, sizes, prev, pager, next, jumper"
			@size-change="sizeChangeHandle"
			@current-change="currentChangeHandle"
		>
		</el-pagination>

		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update ref="addOrUpdateRef" @refreshDataList="getDataList"></add-or-update>

		<!-- 分配用户 -->
		<el-drawer v-if="enrollVisible" v-model="enrollVisible" :title="enrollTitle" :size="1000" :close-on-press-escape="false">
			<course-enroll :course-code=enrollCourseCode></course-enroll>
		</el-drawer>
		<!-- 课程表 -->
		<appoint-timetable ref="appointTimetableRef" @select="handleLessonSelect"></appoint-timetable>
		<!-- 添加试听 -->
		 <course-audition-add ref="courseAuditionAddRef" v-bind="selectedLesson"></course-audition-add>
	</el-card>
</template>

<script setup lang="ts" name="TrainCourseIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import AddOrUpdate from './add-or-update.vue'
import CourseEnroll from './course-enroll.vue'
import CourseAuditionAdd from './course-audition-add.vue'
import AppointTimetable from '@/views/train/timetable/appoint-timetable.vue'
import { downloadExcel } from '@/api/common'

const state: IHooksOptions = reactive({
	dataListUrl: '/train/course/page',
	deleteUrl: '/train/course',
	queryForm: {
		courseCode: '',
		courseName: '',
		teacherCode: '',
		courseStatus: ''
	}
})

const queryRef = ref()
const addOrUpdateRef = ref()
const enrollVisible = ref(false)
const enrollTitle = ref()
const enrollCourseCode = ref()
const appointTimetableRef = ref()
const courseAuditionAddRef = ref()
const selectedLesson = ref()

const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}
const enrollCourse = (row: any) => {
	enrollVisible.value = true
	enrollTitle.value = '报名 - ' + row.courseName
	enrollCourseCode.value = row.courseCode
}
const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud(state)

const handleCommand = (command: string, row: any) => {
	if (command === 'delete'){
		deleteBatchHandle(row.id)
	}else if (command === 'class') {

	}
}

const openTimetable = (code: string) => {
	appointTimetableRef.value.init({
		courseCode: code
	})
}
const handleLessonSelect = (item:any) => {
	selectedLesson.value=item
	courseAuditionAddRef.value.init()
}

</script>
<style scoped>
.el-dropdown-link {
	display: flex;
	align-items: center;
	line-height: normal;
	margin-left: 10px;
}
</style>
