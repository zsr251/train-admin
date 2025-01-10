import service from '@/utils/request'

export const useCourseApi = (id: number) => {
	return service.get('/train/course/' + id)
}

export const useCourseSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/train/course', dataForm)
	} else {
		return service.post('/train/course', dataForm)
	}
}
export const useCourseNameListApi = (idList: number[]) => {
	return service.post('/train/course/nameList', idList)
}