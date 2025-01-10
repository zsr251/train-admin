<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" >
			<el-row>
				<el-col :span="12">
					<el-form-item label="登录名" prop="teacherCode">
						<el-input v-model="dataForm.teacherCode" readonly placeholder="选择系统用户">
							<template #append>
								<el-button :icon="Search" @click="userSelectVisible = true" />
								<train-user-dialog :key="userSelectVisible" v-model:visible="userSelectVisible" @select="userSelected"></train-user-dialog>
							</template>
						</el-input>
					</el-form-item>
					<el-form-item label="老师名称" prop="teacherName">
						<el-input v-model="dataForm.teacherName" placeholder="老师名称"></el-input>
					</el-form-item>
					<el-form-item label="手机号" prop="phone">
						<el-input v-model="dataForm.phone" placeholder="手机号"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="工作类型" prop="jobType">
						<train-dict-select v-model="dataForm.jobType" dict-type="teacher_job_type" placeholder="兼职/全职"></train-dict-select>
					</el-form-item>
					<el-form-item label="资格证" prop="certification">
						<el-input v-model="dataForm.certification" placeholder="资格证"></el-input>
					</el-form-item>
					<el-form-item label="状态" prop="status">
						<train-dict-select v-model="dataForm.status" dict-type="teacher_status" placeholder="在职状态"></train-dict-select>
					</el-form-item>
				</el-col>
			</el-row>

			<el-form-item label="备注" prop="remark">
				<el-input v-model="dataForm.remark" type="textarea" maxlength="200" placeholder="备注"></el-input>
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
import { useTeacherApi, useTeacherSubmitApi } from '@/api/train/teacher'
import { Search } from '@element-plus/icons-vue'


const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()
const userSelectVisible = ref(false)

const dataForm = reactive({
	id: '',
	userId: '',
	teacherCode: '',
	teacherName: '',
	phone: '',
	jobType: '',
	certification: '',
	wageRule: '',
	remark: '',
	status: '',
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
		getTeacher(id)
	}
}

const getTeacher = (id: number) => {
	useTeacherApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	teacherCode: [{ required: true, message: '登录名不能为空', trigger: 'blur' }],
	teacherName: [{ required: true, message: '老师名称不能为空', trigger: 'blur' }],
	phone: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
	jobType: [{ required: true, message: '工作类型不能为空', trigger: 'blur' }],
	status: [{ required: true, message: '状态不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useTeacherSubmitApi(dataForm).then(() => {
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

// 选择用户
const userSelected = (rows: any[]) => {
	console.log(rows[0])
	dataForm.userId = rows[0].id
	dataForm.teacherCode = rows[0].username
	dataForm.teacherName = rows[0].realName
	if (rows[0].mobile) {
		dataForm.phone = rows[0].mobile
	}
	userSelectVisible.value = false
}

defineExpose({
	init
})
</script>
