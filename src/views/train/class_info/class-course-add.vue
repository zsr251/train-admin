<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '报名' : '状态修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
            <el-form-item label="班级">
                <el-text>{{ props.className +  ' （'+ props.classCode +'）' }}</el-text>
			</el-form-item>
			<el-form-item label="课程" prop="courseCode">
                <train-course-input v-model="dataForm.courseCode" clearable placeholder="选择课程"  @select="onCourseSelect" ></train-course-input>
			</el-form-item>
			<el-form-item label="老师" prop="teacherCode">
                <train-teacher-input v-model="dataForm.teacherCode" clearable placeholder="选择老师"></train-teacher-input>
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
import { useClass_courseApi, useClass_courseSubmitApi } from '@/api/train/class_course'
import TrainCourseInput from '@/components/train-course-input/index.vue'
import TrainTeacherInput from '@/components/train-teacher-input/index.vue'
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
	classCode: props.classCode,
	courseCode: '',
	teacherCode: '',
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
	useClass_courseApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useClass_courseSubmitApi(dataForm).then(() => {
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
/**
 * 课程选择
 */
 const onCourseSelect = (rows: any[]) => {
	dataForm.teacherCode = rows[0].teacherCode
}

defineExpose({
	init
})
</script>
