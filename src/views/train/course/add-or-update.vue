<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" >
			<el-row>
				<el-col :span="12">
					<el-form-item label="课程编码" prop="courseCode">
						<el-input v-model="dataForm.courseCode" placeholder="课程编码"></el-input>
					</el-form-item>
					<el-form-item label="任课老师" prop="teacherCode">
						<train-teacher-input v-model="dataForm.teacherCode" :multiple="false" :clearable="true" :disabled="false" :placeholder="'选择任课老师'" />
					</el-form-item>
					<el-form-item label="每次课课时" prop="courseHourOnce">
						<el-input-number v-model="dataForm.courseHourOnce" placeholder="每次课课时" />
					</el-form-item>
					<el-form-item label="班级类型" prop="classType">
						<train-dict-select v-model="dataForm.classType" dict-type="class_type" placeholder="一对一/一对多"></train-dict-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="课程名称" prop="courseName">
						<el-input v-model="dataForm.courseName" placeholder="课程名称"></el-input>
					</el-form-item>
					<el-form-item label="总课时数" prop="courseHourTotal">
						<el-input-number v-model="dataForm.courseHourTotal" placeholder="总课时数" />
					</el-form-item>
					<el-form-item label="每课时收费" prop="amountOneHour">
						<el-input v-model="dataForm.amountOneHour" type="number" placeholder="每课时收费">
							<template #append>元</template>
						</el-input>
					</el-form-item>
					<el-form-item label="课程状态" prop="courseStatus">
						<train-dict-select v-model="dataForm.courseStatus" dict-type="course_status" placeholder="课程状态"></train-dict-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item label="课程简介" prop="courseDesc">
				<el-input v-model="dataForm.courseDesc" type="textarea" maxlength="500"  placeholder="课程简介"></el-input>
			</el-form-item>

			<el-form-item label="备注" prop="remark">
				<el-input v-model="dataForm.remark" type="textarea" maxlength="200"  placeholder="备注"></el-input>
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
import { useCourseApi, useCourseSubmitApi } from '@/api/train/course'
import TrainTeacherInput from '@/components/train-teacher-input/index.vue'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	courseCode: '',
	courseName: '',
	teacherCode: '',
	courseHourTotal: 0,
	courseHourOnce: 2,
	amountOneHour: '',
	courseDesc: '',
	courseStatus: '',
	classType: '',
	remark: '',
	version: '',
	deleted: '',
	creator: '',
	createTime: '',
	updater: '',
	updateTime: '',
	tenantId: ''
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getCourse(id)
	}
}

const getCourse = (id: number) => {
	useCourseApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	courseCode: [{ required: true, message: '课程编码不能为空', trigger: 'blur' }],
	courseName: [{ required: true, message: '课程名称不能为空', trigger: 'blur' }],
	teacherCode: [{ required: true, message: '任课老师不能为空', trigger: '' }],
	courseHourTotal: [{ required: true, message: '总课时数不能为空',trigger: 'blur' }],
	amountOneHour: [{ required: true, message: '每课时收费不能为空', trigger: 'blur' }],
	courseHourOnce: [{ required: true, message: '每次课课时不能为空', trigger: 'blur' }],
	courseStatus: [{ required: true, message: '课程状态不能为空', trigger: 'blur' }],
	classType: [{ required: true, message: '关联班级类型不能为空', trigger:'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useCourseSubmitApi(dataForm).then(() => {
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
