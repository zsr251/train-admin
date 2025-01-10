<template>
	<el-form :inline="true" :model="state.queryForm">
		<el-form-item>
			<train-course-input v-model="state.queryForm.courseCode" clearable placeholder="课程"></train-course-input>
		</el-form-item>
		<el-form-item>
			<train-dict-select v-model="state.queryForm.scheduleStatus" dict-type="course_schedule_status" clearable placeholder="排课状态"></train-dict-select>
		</el-form-item>
		<el-form-item>
			<el-button icon="Search" type="primary" @click="getDataList()">查询</el-button>
		</el-form-item>
		<el-form-item>
			<el-button icon="Plus" type="primary" @click="addHandle()">添加课程</el-button>
		</el-form-item>
	</el-form>
	<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @sort-change="sortChangeHandle">
		<train-dict-column prop="courseCode" label="课程" dict-type="course_code"></train-dict-column>
		<train-dict-column prop="teacherCode" label="老师" dict-type="teacher_code"></train-dict-column>
		<el-table-column prop="planHours" label="计划课时数" header-align="center" align="center"></el-table-column>
		<el-table-column prop="scheduleHours" label="已排课时" header-align="center" align="center"></el-table-column>
		<el-table-column prop="completedHours" label="已授课时" header-align="center" align="center"></el-table-column>
		<train-dict-column prop="scheduleStatus" label="排课状态" dict-type="course_schedule_status"></train-dict-column>
		<el-table-column label="操作" fixed="right" header-align="center" align="center" width="200">
			<template #default="scope">
				<el-button type="primary" v-if="scope.row.scheduleHours < scope.row.planHours" link @click="scheduleHandle(scope.row.id)">排课</el-button>
				<el-button type="primary" v-if="scope.row.scheduleStatus != 'wait'" link @click="resetStatusHandle(scope.row.id)">重置</el-button>
				<el-button
					type="primary"
					v-if="scope.row.scheduleStatus == 'wait' && scope.row.completedHours == 0"
					link
					@click="deleteBatchHandle(scope.row.id)"
					>删除</el-button
				>
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
	<class-course-add
		:class-code="props.classCode"
		:class-name="props.className"
		ref="addOrUpdateRef"
		@refreshDataList="getDataList"
	></class-course-add>
	<!-- 弹窗, 排课 -->
	<class-course-schedule ref="scheduleRef" @refreshDataList="getDataList"></class-course-schedule>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { ElMessage, ElMessageBox } from 'element-plus'
import TrainCourseInput from '@/components/train-course-input/index.vue'
import { resetScheduleApi } from '@/api/train/class_course'
import ClassCourseAdd from './class-course-add.vue'
import ClassCourseSchedule from './class-course-schedule.vue'

const props = defineProps({
	classCode: {
		type: String,
		required: true
	},
	className: {
		type: String,
		required: false
	}
})

const dataForm = reactive({
	classCode: '',
	id: -1,
	enrollStatus: ''
})

const enrollVisible = ref(false)
const addOrUpdateRef = ref()
const scheduleRef = ref()

const state: IHooksOptions = reactive({
	dataListUrl: '/train/class_course/page',
	deleteUrl: '/train/class_course',
	queryForm: {
		classCode: props.classCode,
		courseCode: '',
		scheduleStatus: ''
	}
})
/**
 * 新增课程
 */
const addHandle = () => {
	addOrUpdateRef.value.init(null)
}
/**
 * 排课
 */
const scheduleHandle = (id: number) => {
	scheduleRef.value.init(id)
}
/**
 * 重置排课状态
 */
const resetStatusHandle = (id: number) => {
	ElMessageBox.confirm('确定要删除所有已排但未授课的课程吗？', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	}).then(() => {
		resetScheduleApi(id).then(() => {
			ElMessage.success({
					message: '重置已排课程成功',
					duration: 500,
					onClose: () => {
						getDataList()
					}
				})
		})
	})
}

const { getDataList, sizeChangeHandle, selectionChangeHandle, sortChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
