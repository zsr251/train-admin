<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '报名' : '状态修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
            <el-form-item label="班级">
                <el-text>{{ props.className +' （'+ props.classCode +'）' }}</el-text>
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

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useClass_studentApi, useClass_studentSubmitApi } from '@/api/train/class_student'
import TrainStudentInput from '@/components/train-student-input/index.vue'
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

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	studentId: '',
	classCode: props.classCode,
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getCourse_enroll(id)
	}
}

const getCourse_enroll = (id: number) => {
	useClass_studentApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
    studentId: [
		{ required: true, message: '请选择学员', trigger: 'blur' }
	]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useClass_studentSubmitApi(dataForm).then(() => {
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
