import service from '@/utils/request'

export const useCourse_enrollApi = (id: number) => {
	return service.get('/train/course_enroll/' + id)
}

export const useCourse_enrollSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/train/course_enroll', dataForm)
	} else {
		return service.post('/train/course_enroll', dataForm)
	}
}