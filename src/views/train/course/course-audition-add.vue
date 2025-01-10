<template>
	<el-dialog v-model="visible" title="试听登记" :close-on-click-modal="false" width="40%">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="课程">
				<el-text>{{ props.courseName }}</el-text>
			</el-form-item>
			<el-form-item label="班级">
				<el-text>{{ props.className }}</el-text>
			</el-form-item>
			<el-form-item label="任课老师">
				<el-text>{{ teacherName }}</el-text>
			</el-form-item>
			<el-form-item label="时间">
				<el-text>{{ props.lessonDate }} （ {{ lessonBeginTime }}-{{ lessonEndTime }} ）</el-text>
			</el-form-item>
			<el-form-item label="教室">
				<el-text>{{ props.classroomName }}</el-text>
			</el-form-item>
			<el-form-item label="学员" prop="studentId">
				<train-student-input v-model="dataForm.studentId" clearable placeholder="选择学员"></train-student-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import TrainStudentInput from '@/components/train-student-input/index.vue'
import { addAuditionApi } from '@/api/train/lesson_student'
const props = defineProps({
	id: Number,
	classCode: String,
	className: String,
	courseCode: String,
	courseName: String,
	teacherCode: String,
	teacherName: String,
	lessonDate: String,
	lessonBeginTime: String,
	lessonEndTime: String,
	classroomCode: String,
	classroomName: String
})
const visible = ref(false)
const dataFormRef = ref()
const dataForm = reactive({
	lessonId: props.id,
	studentId: ''
})

const init = () => {
	visible.value = true
	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}
}

const dataRules = ref({
	studentId: [{ required: true, message: '请选择学员', trigger: 'blur' }]
})
const emit = defineEmits(['success'])
// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		addAuditionApi({
			lessonId: props.id,
			studentId: dataForm.studentId
		}).then(() => {
			emit('success')
			ElMessage.success({
				message: '操作成功',
				duration: 500,
				onClose: () => {
					visible.value = false
				}
			})
		})
	})
}

defineExpose({
	init
})
</script>
<style scoped></style>
