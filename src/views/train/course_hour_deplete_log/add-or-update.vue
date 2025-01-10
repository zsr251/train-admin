<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
	    				<el-form-item label="id" prop="id">
					<el-input v-model="dataForm.id" placeholder="id"></el-input>
				</el-form-item>
				<el-form-item label="学员ID" prop="studentId">
					<el-input v-model="dataForm.studentId" placeholder="学员ID"></el-input>
				</el-form-item>
				<el-form-item label="课程ID" prop="lessonId">
					<el-input v-model="dataForm.lessonId" placeholder="课程ID"></el-input>
				</el-form-item>
				<el-form-item label="班级课程ID" prop="classCourseId">
					<el-input v-model="dataForm.classCourseId" placeholder="班级课程ID"></el-input>
				</el-form-item>
				<el-form-item label="班级编码" prop="classCode">
					<el-input v-model="dataForm.classCode" placeholder="班级编码"></el-input>
				</el-form-item>
				<el-form-item label="课程编码" prop="courseCode">
					<el-input v-model="dataForm.courseCode" placeholder="课程编码"></el-input>
				</el-form-item>
				<el-form-item label="教室编码" prop="classroomCode">
					<el-input v-model="dataForm.classroomCode" placeholder="教室编码"></el-input>
				</el-form-item>
				<el-form-item label="任课老师" prop="teacher">
					<el-input v-model="dataForm.teacher" placeholder="任课老师"></el-input>
				</el-form-item>
				<el-form-item label="课程日期" prop="lessonDate">
					<el-input v-model="dataForm.lessonDate" placeholder="课程日期"></el-input>
				</el-form-item>
				<el-form-item label="课程开始时间" prop="lessonBeginTime">
					<el-input v-model="dataForm.lessonBeginTime" placeholder="课程开始时间"></el-input>
				</el-form-item>
				<el-form-item label="课程结束时间" prop="lessonEndTime">
					<el-input v-model="dataForm.lessonEndTime" placeholder="课程结束时间"></el-input>
				</el-form-item>
				<el-form-item label="到课状态" prop="arrivalStatus">
					<el-input v-model="dataForm.arrivalStatus" placeholder="到课状态"></el-input>
				</el-form-item>
				<el-form-item label="扣课时数" prop="courseHour">
					<el-input v-model="dataForm.courseHour" placeholder="扣课时数"></el-input>
				</el-form-item>
				<el-form-item label="消课时间" prop="depleteTime">
					<el-input v-model="dataForm.depleteTime" placeholder="消课时间"></el-input>
				</el-form-item>
				<el-form-item label="消课前课时" prop="courseHourBefore">
					<el-input v-model="dataForm.courseHourBefore" placeholder="消课前课时"></el-input>
				</el-form-item>
				<el-form-item label="消课后课时" prop="courseHourAfter">
					<el-input v-model="dataForm.courseHourAfter" placeholder="消课后课时"></el-input>
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
import { useCourse_hour_deplete_logApi, useCourse_hour_deplete_logSubmitApi } from '@/api/train/course_hour_deplete_log'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	studentId: '',
	lessonId: '',
	classCourseId: '',
	classCode: '',
	courseCode: '',
	classroomCode: '',
	teacher: '',
	lessonDate: '',
	lessonBeginTime: '',
	lessonEndTime: '',
	arrivalStatus: '',
	courseHour: '',
	depleteTime: '',
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
		getCourse_hour_deplete_log(id)
	}
}

const getCourse_hour_deplete_log = (id: number) => {
	useCourse_hour_deplete_logApi(id).then(res => {
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

		useCourse_hour_deplete_logSubmitApi(dataForm).then(() => {
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
