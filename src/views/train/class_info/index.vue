<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item prop="classCode">
				<el-input v-model="state.queryForm.classCode" placeholder="班级编码"></el-input>
			</el-form-item>
			<el-form-item prop="className">
				<el-input v-model="state.queryForm.className" placeholder="班级名称"></el-input>
			</el-form-item>
			<el-form-item prop="courseCode">
				<train-course-input v-model="state.queryForm.courseCode" :multiple="false" :clearable="true" placeholder="关联课程"></train-course-input>
			</el-form-item>
			<el-form-item prop="managerTeacher">
				<train-teacher-input v-model="state.queryForm.managerTeacher" :multiple="false" :clearable="true" placeholder="管理老师"></train-teacher-input>
			</el-form-item>
			<el-form-item prop="classStatus">
				<train-dict-select v-model="state.queryForm.classStatus" dict-type="class_status" clearable placeholder="班级状态"></train-dict-select>
			</el-form-item>
			<el-form-item>
				<el-button icon="Search" type="primary" @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button icon="RefreshRight" @click="reset(queryRef)">重置</el-button>
			</el-form-item>
			<el-space>
				<el-popconfirm title="确定要导出吗?" @confirm="downloadExcel('/train/class_info/export', state.queryForm)">
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
				<el-button v-auth="'train:class_info:save'" icon="Plus" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-space>
		</el-space>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="classCode" label="班级编码" header-align="center" align="center"></el-table-column>
			<el-table-column prop="className" label="班级名称" header-align="center" align="center"></el-table-column>
			<train-dict-column prop="classType" label="班级类型" dict-type="class_type"></train-dict-column>
			<el-table-column prop="capacity" label="班级容量" header-align="center" align="center"></el-table-column>
			<train-dict-column prop="courseCode" label="关联课程" dict-type="course_code"></train-dict-column>
			<train-dict-column prop="managerTeacher" label="管理老师" dict-type="teacher_code"></train-dict-column>
			<train-dict-column prop="classStatus" label="班级状态" dict-type="class_status"></train-dict-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="200">
				<template #default="scope">
					<el-button v-auth="'train:class_info:update'" type="primary" link @click="classStudentHandle(scope.row)">学员</el-button>
					<el-button v-auth="'train:class_info:update'" type="primary" link @click="classCourseHandle(scope.row)">课程</el-button>
					<el-button v-auth="'train:class_info:update'" type="primary" link @click="openTimetable(scope.row.classCode)">课表</el-button>
					<el-dropdown @command="(command: string) => handleCommand(command, scope.row)">
						<el-button type="primary" class="el-dropdown-link" link>更多</el-button>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item command="edit">修改</el-dropdown-item>
								<el-dropdown-item command="delete">删除</el-dropdown-item>
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
		<!-- 班级学员 -->
		<el-drawer v-if="studentVisible" v-model="studentVisible" :title="studentTitle" :size="1000" :close-on-press-escape="false">
			<class-student :class-code=classCode :class-name="className" ></class-student>
		</el-drawer>
		<!-- 班级课程 -->
		<el-drawer v-if="courseVisible" v-model="courseVisible" :title="courseTitle" :size="1000" :close-on-press-escape="false">
			<class-course :class-code=classCode :class-name="className" ></class-course>
		</el-drawer>
		<!-- 课表 -->
		<appoint-timetable ref="appointTimetableRef" :named-visible="true" :audition-visible="true" :reassign-visible="true" :cancel-visible="true"></appoint-timetable>
	</el-card>
</template>

<script setup lang="ts" name="TrainClass_infoIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import AddOrUpdate from './add-or-update.vue'
import TrainCourseInput from '@/components/train-course-input/index.vue'
import TrainTeacherInput from '@/components/train-teacher-input/index.vue'
import ClassStudent from './class-student.vue'
import ClassCourse from './class-course.vue'
import AppointTimetable from '@/views/train/timetable/appoint-timetable.vue'
import { downloadExcel } from '@/api/common'

const state: IHooksOptions = reactive({
	dataListUrl: '/train/class_info/page',
	deleteUrl: '/train/class_info',
	queryForm: {
		classCode: '',
		className: '',
		classType: '',
		courseCode: '',
		managerTeacher: '',
		classStatus: ''
	}
})

const queryRef = ref()
const addOrUpdateRef = ref()
const classCode = ref()
const className = ref()
const studentVisible = ref(false)
const studentTitle = ref()
const courseVisible = ref(false)
const courseTitle = ref()
const appointTimetableRef = ref()


const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud(state)

const handleCommand = (command: string, row: any) => {
	if (command === 'delete'){
		deleteBatchHandle(row.id)
	} else if (command === 'edit'){
		addOrUpdateHandle(row.id)
	}
	// if (command === 'dataScope') {
	// 	dataScopeRef.value.init(row.id)
	// } else if (command === 'user') {
	// 	roleId.value = row.id
	// 	userTitle.value = '分配用户 - ' + row.name
	// 	userVisible.value = true
	// }
}
const classStudentHandle = (row: any) => {
	classCode.value = row.classCode
	className.value = row.className
	studentTitle.value = '班级学员 - ' + row.className
	studentVisible.value = true
}
const classCourseHandle = (row: any) => {
	classCode.value = row.classCode
	className.value = row.className
	courseTitle.value = '班级课程 - ' + row.className
	courseVisible.value = true
}
// 打开课程表
const openTimetable = (code: string) => {
	appointTimetableRef.value.init({
		classCode: code
	})
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
