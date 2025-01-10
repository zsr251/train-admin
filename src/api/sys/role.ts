import service from '@/utils/request'

export const useRoleMenuApi = () => {
	return service.get('/sys/role/menu')
}

export const useRoleApi = (id: number) => {
	return service.get('/sys/role/' + id)
}

export const useRoleListApi = () => {
	return service.get('/sys/role/list')
}

export const useRoleNameListApi = (idList: number[]) => {
	return service.post('/sys/role/nameList', idList)
}

export const useRoleSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/sys/role', dataForm)
	} else {
		return service.post('/sys/role', dataForm)
	}
}

export const useRoleDataScopeSubmitApi = (dataForm: any) => {
	return service.put('/sys/role/data-scope', dataForm)
}

export const useRoleUserSubmitApi = (roleId: number, dataForm: any) => {
	return service.post('/sys/role/user/' + roleId, dataForm)
}
// 查数据权限列表
export const dataPermissionApi = () => {
	return service.get('/sys/role/dataPermission')
}
export const dataPermissionListApi = (dataForm: any) => {
	return service.get('/sys/role/dataPermissionList', {
		params: {
			...dataForm
		}})
}
export const dataPermissionAddApi = (dataForm: any) => {
	return service.post('/sys/role/dataPermissionAdd', dataForm)
}
