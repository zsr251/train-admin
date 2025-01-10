import service from '@/utils/request'

export const useTeacherApi = (id: number) => {
	return service.get('/train/teacher/' + id)
}

export const useTeacherSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/train/teacher', dataForm)
	} else {
		return service.post('/train/teacher', dataForm)
	}
}

export const useTeacherNameListApi = (teacherCodeList: string[]) => {
	return service.post('/train/teacher/nameList', teacherCodeList)
}
// 获取工资方案
export const getWageRuleApi = (id: number) => {
	return service.get('/train/teacher/wageRule/' + id)
}
// 更改工资方案
export const updateWageRuleApi = (id:number,dataForm: any) => {
	return service.post('/train/teacher/updateWageRule/' + id, dataForm)
}