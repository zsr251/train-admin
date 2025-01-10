import service from '@/utils/request'

export const useStudent_flowup_logApi = (id: number) => {
	return service.get('/train/student_flowup_log/' + id)
}

export const useStudent_flowup_logSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/train/student_flowup_log', dataForm)
	} else {
		return service.post('/train/student_flowup_log', dataForm)
	}
}