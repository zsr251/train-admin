import service from '@/utils/request'

export const useClass_studentApi = (id: number) => {
	return service.get('/train/class_student/' + id)
}

export const useClass_studentSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/train/class_student', dataForm)
	} else {
		return service.post('/train/class_student', dataForm)
	}
}