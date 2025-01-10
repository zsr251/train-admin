<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
	    				<el-form-item label="id" prop="id">
					<el-input v-model="dataForm.id" placeholder="id"></el-input>
				</el-form-item>
				<el-form-item label="学员ID" prop="studentId">
					<el-input v-model="dataForm.studentId" placeholder="学员ID"></el-input>
				</el-form-item>
				<el-form-item label="课程编码" prop="courseCode">
					<el-input v-model="dataForm.courseCode" placeholder="课程编码"></el-input>
				</el-form-item>
				<el-form-item label="课时单价" prop="amountOneHour">
					<el-input v-model="dataForm.amountOneHour" placeholder="课时单价"></el-input>
				</el-form-item>
				<el-form-item label="购买课时" prop="courseHourBuy">
					<el-input v-model="dataForm.courseHourBuy" placeholder="购买课时"></el-input>
				</el-form-item>
				<el-form-item label="订单金额" prop="orderAmount">
					<el-input v-model="dataForm.orderAmount" placeholder="订单金额"></el-input>
				</el-form-item>
				<el-form-item label="优惠金额" prop="discountAmount">
					<el-input v-model="dataForm.discountAmount" placeholder="优惠金额"></el-input>
				</el-form-item>
				<el-form-item label="支付金额" prop="payAmount">
					<el-input v-model="dataForm.payAmount" placeholder="支付金额"></el-input>
				</el-form-item>
				<el-form-item label="购买前课时" prop="courseHourBefore">
					<el-input v-model="dataForm.courseHourBefore" placeholder="购买前课时"></el-input>
				</el-form-item>
				<el-form-item label="购买后课时" prop="courseHourAfter">
					<el-input v-model="dataForm.courseHourAfter" placeholder="购买后课时"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="dataForm.remark" placeholder="备注"></el-input>
				</el-form-item>
				<el-form-item label="版本号" prop="version">
					<el-input v-model="dataForm.version" placeholder="版本号"></el-input>
				</el-form-item>
				<el-form-item label="删除标识  0：正常   1：已删除" prop="deleted">
					<el-input v-model="dataForm.deleted" placeholder="删除标识  0：正常   1：已删除"></el-input>
				</el-form-item>
				<el-form-item label="创建者" prop="creator">
					<el-input v-model="dataForm.creator" placeholder="创建者"></el-input>
				</el-form-item>
				<el-form-item label="创建时间" prop="createTime">
					<el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
				</el-form-item>
				<el-form-item label="更新者" prop="updater">
					<el-input v-model="dataForm.updater" placeholder="更新者"></el-input>
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
import { useCourse_hour_buy_logApi, useCourse_hour_buy_logSubmitApi } from '@/api/train/course_hour_buy_log'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	studentId: '',
	courseCode: '',
	amountOneHour: '',
	courseHourBuy: '',
	orderAmount: '',
	discountAmount: '',
	payAmount: '',
	courseHourBefore: '',
	courseHourAfter: '',
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
		getCourse_hour_buy_log(id)
	}
}

const getCourse_hour_buy_log = (id: number) => {
	useCourse_hour_buy_logApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useCourse_hour_buy_logSubmitApi(dataForm).then(() => {
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
