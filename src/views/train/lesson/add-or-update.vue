<template>
	<el-dialog v-model="visible" title="调课" :close-on-click-modal="false">
		<el-descriptions title="" :column="3" border>
			<el-descriptions-item label="班级名称">{{ dataForm.className }}</el-descriptions-item>
			<el-descriptions-item label="课程名称">{{ dataForm.courseName }}</el-descriptions-item>
			<el-descriptions-item label="教室名称">{{ dataForm.classroomName }}</el-descriptions-item>
			<el-descriptions-item label="任课老师">{{ dataForm.teacherName }}</el-descriptions-item>
			<el-descriptions-item label="课程计划日期">{{ dataForm.lessonDate }}</el-descriptions-item>
			<el-descriptions-item label="上课时间段">{{ dataForm.lessonBeginTime }} ~ {{ dataForm.lessonEndTime }}</el-descriptions-item>
			<el-descriptions-item label="扣课时数">{{ dataForm.courseHour }}</el-descriptions-item>
			<el-descriptions-item label="课程状态"
				><el-tag>{{ dataForm.lessonStatusLabel }}</el-tag></el-descriptions-item
			>
			<el-descriptions-item label="备注">{{ dataForm.remark }}</el-descriptions-item>
		</el-descriptions>
		<el-divider />
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" >
			<el-form-item label="新任课老师" prop="newTeacherCode">
				<train-teacher-input v-model="dataForm.newTeacherCode" :multiple="false" :clearable="true" :disabled="false" :placeholder="'选择任课老师'" />
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
import { useLesson_timetableApi, reassignApi } from '@/api/train/lesson_timetable'
import TrainTeacherInput from '@/components/train-teacher-input/index.vue'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	newTeacherCode:'',
	className: '',
	courseName: '',
	classCourseId: '',
	classroomName: '',
	teacherName: '',
	classCode: '',
	courseCode: '',
	classroomCode: '',
	teacherCode: '',
	lessonDate: '',
	lessonBeginTime: '',
	lessonEndTime: '',
	courseHour: '',
	lessonStatus: '',
	remark: '',
	lessonStatusLabel: ''
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''
	dataForm.newTeacherCode = ''
	if (id) {
		getLesson_timetable(id)
	}
}

const getLesson_timetable = (id: number) => {
	useLesson_timetableApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	newTeacherCode: [{ required: true, message: '请选择任课老师', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		reassignApi({
			id: dataForm.id,
			teacherCode: dataForm.newTeacherCode
		}).then(() => {
			ElMessage.success({
				message: '调课成功',
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
