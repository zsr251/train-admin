import service from '@/utils/request'

export const useClass_infoApi = (id: number) => {
	return service.get('/train/class_info/' + id)
}

export const useClass_infoSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/train/class_info', dataForm)
	} else {
		return service.post('/train/class_info', dataForm)
	}
}

export const useClassInfoNameListApi = (idList: number[]) => {
	return service.post('/train/class_info/nameList', idList)
}