import service from '@/utils/request'

export const useStudent_course_hourApi = (id: number) => {
	return service.get('/train/student_course_hour/' + id)
}

export const useStudent_course_hourSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/train/student_course_hour', dataForm)
	} else {
		return service.post('/train/student_course_hour', dataForm)
	}
}