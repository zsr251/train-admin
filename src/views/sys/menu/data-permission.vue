<template>
	<el-row justify="end" style="margin-bottom: 10px">
		<el-col :span="4">
			<el-button icon="Plus" type="primary" @click="addHandle()">添加权限</el-button>
		</el-col>
	</el-row>
	<el-table :data="dataList" border style="width: 100%">
		<el-table-column prop="ruleName" label="规则名称" header-align="center" align="center"></el-table-column>
		<train-dict-column prop="ruleType" label="规则类型" dict-type="rule_type"></train-dict-column>
		<el-table-column prop="ruleFlag" label="规则标识" header-align="center" align="center"></el-table-column>
		<el-table-column prop="ruleValue" label="规则内容" header-align="center" align="center"></el-table-column>
		<el-table-column label="操作" fixed="right" header-align="center" align="center" width="120">
			<template #default="scope">
				<el-button type="primary" link @click="updateHandle(scope.row)">修改</el-button>
				<el-button type="primary" link @click="deleteHandle(scope.row.id)">删除</el-button>
			</template>
		</el-table-column>
	</el-table>

	<el-dialog v-model="visible" :title="!dataForm.id ? '添加数据权限' : '修改数据权限'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" >
			<el-form-item label="规则名称" prop="ruleName">
				<el-input v-model="dataForm.ruleName" placeholder="选择权限时展示的名字" />
			</el-form-item>
			<el-form-item label="规则类型" prop="ruleType">
				<train-dict-select v-model="dataForm.ruleType" dict-type="rule_type" placeholder="数据权限规则类型"></train-dict-select>
			</el-form-item>
			<el-form-item label="规则标识" prop="ruleFlag">
				<el-input v-model="dataForm.ruleFlag" placeholder="代码中的判断标识" />
			</el-form-item>
			<el-form-item label="规则内容" prop="ruleValue">
				<el-input v-model="dataForm.ruleValue" type="textarea" maxlength="1000" placeholder="具体的规则内容，使用英文【,】分割"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, toRaw } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { dataPermissionListApi, deleteDataPermissionApi, useDataPermissionApi } from '@/api/sys/menu'
const props = defineProps({
	component: String
})

const visible = ref(false)
// 数据列表
const dataList = ref([])
// 获取数据列表
const getDataList = () => {
	dataPermissionListApi({
		component: props.component
	}).then(res => {
		dataList.value = res.data
	})
}

// 添加或者修改
const dataForm = ref({
	id: 0,
	component: props.component,
	ruleName: '',
	ruleType: 'sql_rule',
	ruleFlag: '',
	ruleValue: ''
})
const dataFormRef = ref()
const dataRules = ref({
	ruleName: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
    ruleFlag: [{ required: true, message: '请输入规则标识', trigger: 'blur' }],
    ruleValue: [{ required: true, message: '请输入规则内容', trigger: 'blur' }],
    ruleType: [{ required: true, message: '请输入规则类型', trigger: 'blur' }]
})

// 添加/修改提交表单
const submitHandle = () => {
	// 表单校验
    dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
        useDataPermissionApi(dataForm.value).then(() => {
			ElMessage.success({
				message: '操作成功',
				duration: 500,
				onClose: () => {
					visible.value = false
					getDataList()
				}
			})
		})
    })
}
// 点添加
const addHandle = () => {
	dataForm.value = {
		id: 0,
		component: props.component,
		ruleName: '',
		ruleType: 'sql_rule',
		ruleFlag: '',
		ruleValue: ''
	}
    visible.value = true
}
// 点修改
const updateHandle = (row: any) => {
	dataForm.value = {
        ...row
    }
	visible.value = true
}
// 点删除
const deleteHandle = (id: number) => {
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	}).then(() => {
		deleteDataPermissionApi(id).then(() => {
			ElMessage.success({
				message: '删除成功',
				duration: 500,
				onClose: () => {
					getDataList()
				}
			})
		})
	})
}
onMounted(() => {
	// 获取数据列表
	getDataList()
})
</script>
<style scoped></style>
