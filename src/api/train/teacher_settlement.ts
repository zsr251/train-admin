import service from '@/utils/request'

export const useTeacher_settlementApi = (id: number) => {
	return service.get('/train/teacher_settlement/' + id)
}

export const useTeacher_settlementSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/train/teacher_settlement', dataForm)
	} else {
		return service.post('/train/teacher_settlement', dataForm)
	}
}