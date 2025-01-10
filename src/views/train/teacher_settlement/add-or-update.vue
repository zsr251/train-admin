<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
	    				<el-form-item label="id" prop="id">
					<el-input v-model="dataForm.id" placeholder="id"></el-input>
				</el-form-item>
				<el-form-item label="结算名称" prop="settlementName">
					<el-input v-model="dataForm.settlementName" placeholder="结算名称"></el-input>
				</el-form-item>
				<el-form-item label="结算金额" prop="settlementAmount">
					<el-input v-model="dataForm.settlementAmount" placeholder="结算金额"></el-input>
				</el-form-item>
				<el-form-item label="结算日期" prop="settlementDate">
					<el-input v-model="dataForm.settlementDate" placeholder="结算日期"></el-input>
				</el-form-item>
				<el-form-item label="结算对象" prop="teacher">
					<el-input v-model="dataForm.teacher" placeholder="结算对象"></el-input>
				</el-form-item>
				<el-form-item label="结算开始日期包含" prop="settlementBeginDate">
					<el-input v-model="dataForm.settlementBeginDate" placeholder="结算开始日期包含"></el-input>
				</el-form-item>
				<el-form-item label="结算结束日期包含" prop="settlementEndDate">
					<el-input v-model="dataForm.settlementEndDate" placeholder="结算结束日期包含"></el-input>
				</el-form-item>
				<el-form-item label="发薪日" prop="payDate">
					<el-input v-model="dataForm.payDate" placeholder="发薪日"></el-input>
				</el-form-item>
				<el-form-item label="经办人" prop="processor">
					<el-input v-model="dataForm.processor" placeholder="经办人"></el-input>
				</el-form-item>
				<el-form-item label="结算详情" prop="settlementDetail">
					<el-input v-model="dataForm.settlementDetail" placeholder="结算详情"></el-input>
				</el-form-item>
				<el-form-item label="结算状态" prop="settlementStatus">
					<el-input v-model="dataForm.settlementStatus" placeholder="结算状态"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="dataForm.remark" placeholder="备注"></el-input>
				</el-form-item>
				<el-form-item label="更新时间" prop="updateTime">
					<el-input v-model="dataForm.updateTime" placeholder="更新时间"></el-input>
				</el-form-item>
				<el-form-item label="租户ID" prop="tenantId">
					<el-input v-model="dataForm.tenantId" placeholder="租户ID"></el-input>
				</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useTeacher_settlementApi, useTeacher_settlementSubmitApi } from '@/api/train/teacher_settlement'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	settlementName: '',
	settlementAmount: '',
	settlementDate: '',
	teacher: '',
	settlementBeginDate: '',
	settlementEndDate: '',
	payDate: '',
	processor: '',
	settlementDetail: '',
	settlementStatus: '',
	remark: '',
	version: '',
	deleted: '',
	creator: '',
	createTime: '',
	updater: '',
	updateTime: '',
	tenantId: ''})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getTeacher_settlement(id)
	}
}

const getTeacher_settlement = (id: number) => {
	useTeacher_settlementApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	settlementName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	settlementAmount: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	settlementDate: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	teacher: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	payDate: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useTeacher_settlementSubmitApi(dataForm).then(() => {
			ElMessage.success({
				message: '操作成功',
				duration: 500,
				onClose: () => {
					visible.value = false
					emit('refreshDataList')
				}
			})
		})
	})
}

defineExpose({
	init
})
</script>
