import service from '@/utils/request'

export const useClassroomApi = (id: number) => {
	return service.get('/train/classroom/' + id)
}

export const useClassroomSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/train/classroom', dataForm)
	} else {
		return service.post('/train/classroom', dataForm)
	}
}

export const useClassroomNameListApi = (idList: number[]) => {
	return service.post('/train/classroom/nameList', idList)
}