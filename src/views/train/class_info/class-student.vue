<template>
	<el-form :inline="true" :model="state.queryForm">
		<el-form-item>
			<train-student-input v-model="state.queryForm.studentId" clearable placeholder="学员姓名"></train-student-input>
		</el-form-item>
		<el-form-item>
			<train-dict-select v-model="state.queryForm.status" dict-type="class_student_status" clearable placeholder="加入状态"></train-dict-select>
		</el-form-item>
		<el-form-item>
			<el-button icon="Search" type="primary" @click="getDataList()">查询</el-button>
		</el-form-item>
		<el-form-item>
			<el-button icon="Plus" type="primary" @click="joinHandle()">加入班级</el-button>
		</el-form-item>
	</el-form>
	<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @sort-change="sortChangeHandle">
		<el-table-column prop="studentName" label="学员姓名" header-align="center" align="center"></el-table-column>
		<el-table-column prop="phone" label="手机号" header-align="center" align="center"></el-table-column>
		<train-dict-column prop="status" label="状态" dict-type="class_student_status"></train-dict-column>
		<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
			<template #default="scope">
				<el-button type="primary" link @click="quitClassHandle(scope.row.id)">退班</el-button>
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
	<class-student-add
		:class-code="props.classCode"
		:class-name="props.className"
		ref="addOrUpdateRef"
		@refreshDataList="getDataList"
	></class-student-add>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { ElMessage, ElMessageBox } from 'element-plus'
import TrainStudentInput from '@/components/train-student-input/index.vue'
import { useClass_studentSubmitApi } from '@/api/train/class_student'
import ClassStudentAdd from './class-student-add.vue'


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
	courseCode: '',
	id: -1,
	enrollStatus: ''
})

const enrollVisible = ref(false)
const addOrUpdateRef = ref()

const state: IHooksOptions = reactive({
	dataListUrl: '/train/class_student/page',
	deleteUrl: '/train/class_student',
	queryForm: {
		classCode: props.classCode,
		studentId: ''
	}
})

const joinHandle = () => {
	addOrUpdateRef.value.init(null)
}
const quitClassHandle = (id: number) => {
	ElMessageBox.confirm('确定要退班吗？', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	}).then(() => {
		useClass_studentSubmitApi({
			id: id,
			status: 'quit'
		}).then(() => {
			ElMessage.success({
				message: '退出班级成功',
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
