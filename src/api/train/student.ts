import service from '@/utils/request'
import { id } from 'element-plus/es/locale'

export const useStudentApi = (id: number) => {
	return service.get('/train/student/' + id)
}

export const useStudentSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/train/student', dataForm)
	} else {
		return service.post('/train/student', dataForm)
	}
}

export const useStudentNameListApi = (idList: number[]) => {
	return service.post('/train/student/nameList', idList)
}

export const getUrlApi = (id: number) => {
	return service.get('/train/student/getUrl/' + id)
}

export const refreshUrlApi = (id: number) => {
	return service.post('/train/student/refreshUrl/' + id)
}