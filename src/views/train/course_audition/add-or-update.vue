<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
	    				<el-form-item label="id" prop="id">
					<el-input v-model="dataForm.id" placeholder="id"></el-input>
				</el-form-item>
				<el-form-item label="学员ID" prop="studentId">
					<el-input v-model="dataForm.studentId" placeholder="学员ID"></el-input>
				</el-form-item>
				<el-form-item label="课程计划ID" prop="lessonId">
					<el-input v-model="dataForm.lessonId" placeholder="课程计划ID"></el-input>
				</el-form-item>
				<el-form-item label="课程编码" prop="courseCode">
					<el-input v-model="dataForm.courseCode" placeholder="课程编码"></el-input>
				</el-form-item>
				<el-form-item label="班级编码" prop="classCode">
					<el-input v-model="dataForm.classCode" placeholder="班级编码"></el-input>
				</el-form-item>
				<el-form-item label="教室编码" prop="classroomCode">
					<el-input v-model="dataForm.classroomCode" placeholder="教室编码"></el-input>
				</el-form-item>
				<el-form-item label="老师编码" prop="teacher">
					<el-input v-model="dataForm.teacher" placeholder="老师编码"></el-input>
				</el-form-item>
				<el-form-item label="试听状态" prop="auditionStatus">
					<el-input v-model="dataForm.auditionStatus" placeholder="试听状态"></el-input>
				</el-form-item>
				<el-form-item label="试听反馈" prop="auditionFeedback">
					<el-input v-model="dataForm.auditionFeedback" placeholder="试听反馈"></el-input>
				</el-form-item>
				<el-form-item label="审批状态" prop="approvalStatus">
					<el-input v-model="dataForm.approvalStatus" placeholder="审批状态"></el-input>
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
import { useCourse_auditionApi, useCourse_auditionSubmitApi } from '@/api/train/course_audition'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	studentId: '',
	lessonId: '',
	courseCode: '',
	classCode: '',
	classroomCode: '',
	teacher: '',
	auditionStatus: '',
	auditionFeedback: '',
	approvalStatus: '',
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
		getCourse_audition(id)
	}
}

const getCourse_audition = (id: number) => {
	useCourse_auditionApi(id).then(res => {
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

		useCourse_auditionSubmitApi(dataForm).then(() => {
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
