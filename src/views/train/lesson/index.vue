<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item prop="lessonDate">
				<el-date-picker v-model="state.queryForm.lessonDate" type="date" value-format="YYYY-MM-DD" placeholder="上课日期" />
			</el-form-item>
			<el-form-item prop="classCode">
				<train-class-input v-model="state.queryForm.classCode" :multiple="false" :clearable="true" placeholder="班级"></train-class-input>
			</el-form-item>
			<el-form-item prop="courseCode">
				<train-course-input v-model="state.queryForm.courseCode" :multiple="false" :clearable="true" placeholder="课程"></train-course-input>
			</el-form-item>
			<el-form-item prop="teacherCode">
				<train-teacher-input
					v-model="state.queryForm.teacherCode"
					:multiple="false"
					:clearable="true"
					placeholder="任课老师"
				></train-teacher-input>
			</el-form-item>
			<el-form-item prop="classroomCode">
				<train-classroom-input v-model="state.queryForm.classroomCode" :multiple="false" :clearable="true" placeholder="教室"></train-classroom-input>
			</el-form-item>
			<el-form-item prop="lessonStatus">
				<train-dict-select v-model="state.queryForm.lessonStatus" dict-type="lesson_status" clearable placeholder="上课状态"></train-dict-select>
			</el-form-item>
			<el-form-item>
				<el-button icon="Search" type="primary" @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button icon="RefreshRight" @click="reset(queryRef)">重置</el-button>
			</el-form-item>
			<el-space>
				<el-popconfirm title="确定要导出吗?" @confirm="downloadExcel('/train/lesson_timetable/export', state.queryForm)">
					<template #reference>
						<el-button icon="Download" >导出</el-button>
					</template>
				</el-popconfirm>
			</el-space>
		</el-form>
	</el-card>

	<el-card>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table" @selection-change="selectionChangeHandle">
			<el-table-column prop="className" label="班级" header-align="center" align="center"></el-table-column>
			<el-table-column prop="courseName" label="课程" header-align="center" align="center"></el-table-column>
			<el-table-column prop="classroomName" label="教室" header-align="center" align="center"></el-table-column>
			<el-table-column prop="teacherName" label="任课老师" header-align="center" align="center"></el-table-column>
			<el-table-column prop="lessonDate" label="上课日期" header-align="center" align="center"></el-table-column>
			<el-table-column label="上课时间段" header-align="center" align="center">
				<template #default="scope"> {{ scope.row.lessonBeginTime }} ～ {{ scope.row.lessonEndTime }} </template>
			</el-table-column>
			<el-table-column prop="courseHour" label="扣课时数" header-align="center" align="center"></el-table-column>
			<train-dict-column prop="lessonStatus" label="课程状态" dict-type="lesson_status"></train-dict-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="200">
				<template #default="scope">
					<el-button v-auth="'train:lesson_timetable:update'" type="primary" link @click="handleNamed(scope.row)">点名</el-button>
					<el-button v-auth="'train:lesson_timetable:update'" type="primary" link @click="handleAudition(scope.row)">试听</el-button>
					<el-button v-auth="'train:lesson_timetable:update'" type="primary" link @click="handleLessonStudent(scope.row)">学员</el-button>
					<el-dropdown v-auth="'sys:role:update'" @command="(command: string) => handleCommand(command, scope.row)">
						<el-button type="primary" class="el-dropdown-link" link>更多</el-button>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item command="reassign">调课</el-dropdown-item>
								<el-dropdown-item command="cancel">撤销</el-dropdown-item>
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
		<!-- 添加试听 -->
		<course-audition-add ref="courseAuditionAddRef" v-bind="selectedLesson"></course-audition-add>
		<!-- 点名 -->
		<lesson-named ref="lessonNamedRef" @refreshDataList="getDataList" v-bind="selectedLesson"></lesson-named>
		<!-- 学员 -->
		<el-drawer v-if="studentVisible" v-model="studentVisible" title="课程学员" :size="600" :close-on-press-escape="false" @opened="handleStudentOpen">
			<lesson-student ref="lessonStudentRef"></lesson-student> 
		</el-drawer>
		
	</el-card>
</template>

<script setup lang="ts" name="TrainLesson_timetableIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import AddOrUpdate from './add-or-update.vue'
import TrainCourseInput from '@/components/train-course-input/index.vue'
import TrainClassInput from '@/components/train-class-input/index.vue'
import TrainTeacherInput from '@/components/train-teacher-input/index.vue'
import TrainClassroomInput from '@/components/train-classroom-input/index.vue'
import CourseAuditionAdd from '@/views/train/course/course-audition-add.vue'
import LessonNamed from '@/views/train/lesson/lesson-named.vue'
import LessonStudent from '@/views/train/lesson/lesson-student.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { downloadExcel } from '@/api/common'
import { cancelApi} from '@/api/train/lesson_timetable'

const state: IHooksOptions = reactive({
	dataListUrl: '/train/lesson_timetable/page',
	deleteUrl: '/train/lesson_timetable',
	queryForm: {
		lessonDate: '',
		classCode: '',
		courseCode: '',
		teacherCode: '',
		classroomCode: '',
		lessonStatus: 'wait'
	}
})

const queryRef = ref()
const addOrUpdateRef = ref()
const courseAuditionAddRef = ref()
const selectedLesson = ref()
const lessonNamedRef = ref()
const studentVisible = ref(false)
const lessonStudentRef = ref()

const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}
const handleCommand = (command: string, row: any) => {
	if (command === 'delete') {
		deleteBatchHandle(row.id)
	}
	 else if (command === 'cancel') {
		ElMessageBox.confirm('确定要撤销这节课吗?', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		})
			.then(() => {
				if (state.deleteUrl) {
					cancelApi({
						id: row.id
					}).then(() => {
						ElMessage.success('撤销成功')
						getDataList()
					})
				}
			})
			.catch(() => {})
	 } else if (command === 'reassign'){
		addOrUpdateHandle(row.id)
	 }
}
const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud(state)
// 试听
const handleAudition = (item: any) => {
	selectedLesson.value = item
	courseAuditionAddRef.value.init()
}
// 点名
const handleNamed = (item: any) => {
	selectedLesson.value = item
	lessonNamedRef.value.init(item.id)
}
// 课程学员
const handleLessonStudent = (item:any) => {
	selectedLesson.value = item
	studentVisible.value = true
}
const handleStudentOpen = () => {
	lessonStudentRef.value.init(selectedLesson.value.id)
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
