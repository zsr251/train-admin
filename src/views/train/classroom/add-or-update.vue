<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px">
			<el-row>
				<el-col :span="12">
					<el-form-item label="教室编码" prop="classroomCode">
						<el-input v-model="dataForm.classroomCode" placeholder="R01、R11等"></el-input>
					</el-form-item>
					<el-form-item label="教室容量" prop="capacity">
						<el-input-number v-model="dataForm.capacity" placeholder="教室容量"></el-input-number>
					</el-form-item>
					<el-form-item label="忽略排课冲突" prop="ignoreConflict">
						<train-dict-select v-model="dataForm.ignoreConflict" dict-type="ignore_conflict" placeholder="教室状态"></train-dict-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="教室名称" prop="classroomName">
						<el-input v-model="dataForm.classroomName" placeholder="教室名称"></el-input>
					</el-form-item>
					<el-form-item label="教室状态" prop="classroomStatus">
						<train-dict-select v-model="dataForm.classroomStatus" dict-type="classroom_status" placeholder="教室状态"></train-dict-select>
					</el-form-item>
					<el-form-item label="教室地址" prop="address">
						<el-input v-model="dataForm.address" placeholder="教室地址"></el-input>
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
import { useClassroomApi, useClassroomSubmitApi } from '@/api/train/classroom'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	classroomCode: '',
	classroomName: '',
	capacity: '',
	address: '',
	ignoreConflict: '',
	classroomStatus: '',
	remark: '',
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getClassroom(id)
	}
}

const getClassroom = (id: number) => {
	useClassroomApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	classroomCode: [{ required: true, message: '教室编码不能为空', trigger: 'blur' }],
	classroomName: [{ required: true, message: '教室名称不能为空', trigger: 'blur' }],
	capacity: [{ required: true, message: '教室容量不能为空', trigger: 'blur' }],
	classroomStatus: [{ required: true, message: '教室状态不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useClassroomSubmitApi(dataForm).then(() => {
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
