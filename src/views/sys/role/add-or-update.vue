<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="120px">
			<el-form-item prop="name" label="名称">
				<el-input v-model="dataForm.name" placeholder="名称"></el-input>
			</el-form-item>
			<el-form-item prop="roleCode" label="编码">
				<el-input v-model="dataForm.roleCode" placeholder="编码"></el-input>
			</el-form-item>
			<el-form-item prop="remark" label="备注">
				<el-input v-model="dataForm.remark" placeholder="备注"></el-input>
			</el-form-item>
			<el-row>
				<el-col :span="12">
					<el-form-item label="菜单权限">
						<el-tree ref="menuListTree" :data="menuList" :props="{ label: 'name', children: 'children' }" node-key="id" accordion show-checkbox>
							<template #default="{ node, data }">
								<span>{{ node.label }}
									<el-button circle size="small" v-if="data.hasDataPermission === 1"
										@click.stop="handleOpenDataP(data.url,data.name)"><train-icon  icon="icon-align-left" color="red"></train-icon
									></el-button>
								</span>
							</template>
						</el-tree>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item :label="curMenuName? curMenuName : '数据权限'">
						<el-tree v-show="curDataPermissionList.length > 0"
							ref="dataPermissionTree"
							:data="curDataPermissionList"
							:props="{ label: 'ruleName'}"
							node-key="id"
							accordion
							show-checkbox
							@check="handleDPCheck"
						></el-tree>
						<el-text type="warning" v-show="curDataPermissionList.length == 0">请选中有数据权限的菜单</el-text>
					</el-form-item>
				</el-col>
			</el-row>
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
import { useRoleApi, useRoleMenuApi, useRoleSubmitApi,dataPermissionApi } from '@/api/sys/role'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const menuList = ref([])
const menuListTree = ref()
const dataFormRef = ref()
// 数据权限
const dataPermissionTree = ref()
const dataPermissionList = ref([] as any[])
const curDataPermissionList = ref([] as any[])

const dataForm = reactive({
	id: '',
	name: '',
	roleCode: '',
	menuIdList: [] as any[],
	dataPermissionIdList:[] as number[],
	orgIdList: [],
	remark: ''
})

const init = async (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}
	if (menuListTree.value) {
		menuListTree.value.setCheckedKeys([])
	}
	curDataPermissionList.value = []
	dataForm.dataPermissionIdList = []
	// 菜单列表
	await getMenuList()

	await getDataPermissionList()
	// id 存在则为修改
	if (id) {
		getRole(id)
	}
}

// 获取菜单列表
const getMenuList = async () => {
	const res = await useRoleMenuApi()
	menuList.value = res.data
}
// 获取所有数据权限列表
const getDataPermissionList = async () => {
	const res = await dataPermissionApi()
	dataPermissionList.value = res.data
}
// 获取信息
const getRole = (id: number) => {
	useRoleApi(id).then(res => {
		Object.assign(dataForm, res.data)
		dataForm.menuIdList.forEach(item => menuListTree.value.setChecked(item, true))
	})
}

const dataRules = ref({
	name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	roleCode: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		dataForm.menuIdList = [...menuListTree.value.getHalfCheckedKeys(), ...menuListTree.value.getCheckedKeys()]

		useRoleSubmitApi(dataForm).then(() => {
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
// 打开数据权限的菜单名
const curMenuName = ref('')
// 打开数据权限
const handleOpenDataP = (url: string,name:string) => {
	
	curMenuName.value = name;
	// 从列表中筛选
	curDataPermissionList.value = dataPermissionList.value.filter(item => item.component == url)
	// console.log("选中的" + dataForm.dataPermissionIdList
	dataPermissionTree.value.setCheckedKeys(dataForm.dataPermissionIdList, true)
}
// 数据权限选择
const handleDPCheck = (a:any,val: any) => {
	// 删除 curDataPermissionList 所有ID项
	curDataPermissionList.value.forEach(item => {
		let n = dataForm.dataPermissionIdList.indexOf(item.id)
		if (n > -1) {
			dataForm.dataPermissionIdList.splice(n, 1)
		}
	})
	dataForm.dataPermissionIdList.push(...val.checkedKeys)
	// console.log("已选中：" + dataForm.dataPermissionIdList)
}
defineExpose({
	init
})
</script>
