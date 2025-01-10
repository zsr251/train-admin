import service from '@/utils/request'

export const useCourse_hour_deplete_logApi = (id: number) => {
	return service.get('/train/course_hour_deplete_log/' + id)
}

export const useCourse_hour_deplete_logSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/train/course_hour_deplete_log', dataForm)
	} else {
		return service.post('/train/course_hour_deplete_log', dataForm)
	}
}