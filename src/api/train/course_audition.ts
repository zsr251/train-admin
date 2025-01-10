import service from '@/utils/request'

export const useCourse_auditionApi = (id: number) => {
	return service.get('/train/course_audition/' + id)
}

export const useCourse_auditionSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/train/course_audition', dataForm)
	} else {
		return service.post('/train/course_audition', dataForm)
	}
}