<template>
	<el-form :inline="true" :model="state.queryForm">
		<el-form-item>
			<train-dict-select v-model="state.queryForm.enrollStatus" dict-type="course_enroll_status" clearable placeholder="报名状态"></train-dict-select>
		</el-form-item>
		<el-form-item>
			<train-student-input v-model="state.queryForm.studentId" clearable placeholder="学员姓名"></train-student-input>
		</el-form-item>
		<el-form-item>
			<el-button icon="Search" type="primary" @click="getDataList()">查询</el-button>
		</el-form-item>
		<el-form-item>
			<el-button icon="Plus" type="primary" @click="enrollHandle()">报名</el-button>
		</el-form-item>
	</el-form>
	<el-table
		v-loading="state.dataListLoading"
		:data="state.dataList"
		border
		style="width: 100%"
		@selection-change="selectionChangeHandle"
		@sort-change="sortChangeHandle"
	>
		<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
		<el-table-column prop="studentName" label="学员姓名" header-align="center" align="center"></el-table-column>
		<el-table-column prop="phone" label="手机号" header-align="center" align="center"></el-table-column>
		<train-dict-column prop="enrollStatus" label="状态" dict-type="course_enroll_status"></train-dict-column>
		<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
			<template #default="scope">
				<el-button type="primary" link @click="cancelEnroll(scope.row.id)">取消报名</el-button>
				<el-button type="primary" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
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
	<course-enroll-add :course-code="props.courseCode" ref="addOrUpdateRef" @refreshDataList="getDataList"></course-enroll-add>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { ElMessage, ElMessageBox } from 'element-plus'
import TrainStudentInput from '@/components/train-student-input/index.vue'
import CourseEnrollAdd from './course-enroll-add.vue'
import { useCourse_enrollSubmitApi } from '@/api/train/course_enroll'
import { number } from 'echarts'

const props = defineProps({
	courseCode: {
		type: String,
		required: true
	}
})

const dataForm = reactive({
	courseCode: '',
	id: -1,
	enrollStatus: ''
})

const enrollVisible = ref(false)
const addOrUpdateRef = ref()

const state: IHooksOptions = reactive({
	dataListUrl: '/train/course_enroll/page',
	deleteUrl: '/train/course_enroll',
	queryForm: {
		courseCode: props.courseCode,
		studentId: '',
		enrollStatus: ''
	}
})

const enrollHandle = () => {
	addOrUpdateRef.value.init(null)
}

const cancelEnroll = (id: number) => {
	ElMessageBox.confirm('确定取消报名?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	}).then(() => {
			dataForm.id = id
			dataForm.courseCode = props.courseCode
			dataForm.enrollStatus = 'cancel'
			useCourse_enrollSubmitApi(dataForm).then(() => {
				ElMessage.success({
					message: '取消报名成功',
					duration: 500,
					onClose: () => {
						getDataList()
					}
				})
			})
		})
		.catch(() => {})
}

const { getDataList, sizeChangeHandle, selectionChangeHandle, sortChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
