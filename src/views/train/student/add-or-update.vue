<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px">
			<el-row>
				<el-col :span="12">
					<el-form-item label="学员姓名" prop="studentName">
						<el-input v-model="dataForm.studentName" placeholder="学员姓名"></el-input>
					</el-form-item>
					<el-form-item label="手机号" prop="phone">
						<el-input v-model="dataForm.phone" placeholder="手机号"></el-input>
					</el-form-item>
					<el-form-item label="手机号所属" prop="phoneBelong">
						<el-input v-model="dataForm.phoneBelong" placeholder="学员/妈妈/爸爸"></el-input>
					</el-form-item>
					<el-form-item label="生日" prop="birthday">
						<el-date-picker v-model="dataForm.birthday" type="date" placeholder="选择日期"></el-date-picker>
					</el-form-item>
					<el-form-item label="在读学校" prop="school">
						<el-input v-model="dataForm.school" placeholder="在读学校名称"></el-input>
					</el-form-item>
					<el-form-item label="意向程度" prop="intentionLevel">
						<train-dict-select v-model="dataForm.intentionLevel" dict-type="student_intention_level" clearable placeholder="意向程度"></train-dict-select>
					</el-form-item>
					<el-form-item label="跟进状态" prop="followupStatus">
						<train-dict-select v-model="dataForm.followupStatus" dict-type="student_followup_status" clearable placeholder="跟进状态"></train-dict-select>
					</el-form-item>
					<el-form-item label="备用手机号" prop="alternatePhone">
						<el-input v-model="dataForm.alternatePhone" placeholder="备用手机号"></el-input>
					</el-form-item>
					<el-form-item label="备用手机所属" prop="alternatePhoneBelong">
						<el-input v-model="dataForm.alternatePhoneBelong" placeholder="学员/妈妈/爸爸"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="性别" prop="gender">
						<train-dict-radio v-model="dataForm.gender" dict-type="user_gender"></train-dict-radio>
					</el-form-item>
					<el-form-item label="学员类型" prop="studentType">
						<train-dict-select v-model="dataForm.studentType" dict-type="student_type" clearable placeholder="学员类型"></train-dict-select>
					</el-form-item>
					<el-form-item label="来源类型" prop="sourceType">
						<train-dict-select v-model="dataForm.sourceType" dict-type="student_source_type" clearable placeholder="学员来源类型"></train-dict-select>
					</el-form-item>
					<el-form-item label="推荐人姓名" prop="referrer">
						<el-input v-model="dataForm.referrer" placeholder="推荐人姓名"></el-input>
					</el-form-item>
					<el-form-item label="在读年级" prop="grade">
						<el-input v-model="dataForm.grade" placeholder="在读年级"></el-input>
					</el-form-item>
					<el-form-item label="跟进人" prop="followupPerson">
						<el-input v-model="dataForm.followupPerson" placeholder="跟进人"></el-input>
					</el-form-item>
					<el-form-item label="学管师" prop="academicAdvisor">
						<el-input v-model="dataForm.academicAdvisor" placeholder="学管师姓名"></el-input>
					</el-form-item>
					<el-form-item label="学员身份证" prop="idCard">
						<el-input v-model="dataForm.idCard" placeholder="学员身份证号"></el-input>
					</el-form-item>
					<el-form-item label="账户状态" prop="status">
						<train-dict-select v-model="dataForm.status" dict-type="student_status" clearable placeholder="账户状态"></train-dict-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item label="登录密码" prop="password">
				<el-input v-model="dataForm.password" type="password" minlength="6" placeholder="学员登录密码,最少6位"></el-input>
			</el-form-item>
			<el-form-item label="家庭地址" prop="address">
				<el-input v-model="dataForm.address" placeholder="家庭地址"></el-input>
			</el-form-item>
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
import { useStudentApi, useStudentSubmitApi } from '@/api/train/student'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	studentName: '',
	phone: '',
	phoneBelong: '',
	gender: '',
	birthday: '',
	studentType: '',
	sourceType: '',
	referrer: '',
	school: '',
	grade: '',
	avatar: '',
	status: '',
	password: '',
	alternatePhone: '',
	alternatePhoneBelong: '',
	address: '',
	idCard: '',
	intentionLevel: '',
	followupStatus: '',
	followupPerson: '',
	academicAdvisor: '',
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
		getStudent(id)
	}
}

const getStudent = (id: number) => {
	useStudentApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	studentName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	phone: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	gender: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	studentType: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	sourceType: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	status: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	password: [
		{ required: true, message: '必填项不能为空', trigger: 'blur' },
		{ min: 6, max: 18, message: '密码长度必须6～18位', trigger: 'blur' }
	]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useStudentSubmitApi(dataForm).then(() => {
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
