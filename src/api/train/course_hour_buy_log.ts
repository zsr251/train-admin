import service from '@/utils/request'

export const useCourse_hour_buy_logApi = (id: number) => {
	return service.get('/train/course_hour_buy_log/' + id)
}

export const useCourse_hour_buy_logSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/train/course_hour_buy_log', dataForm)
	} else {
		return service.post('/train/course_hour_buy_log', dataForm)
	}
}