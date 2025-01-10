import service from '@/utils/request'

export const useClass_courseApi = (id: number) => {
	return service.get('/train/class_course/' + id)
}

export const useClass_courseSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/train/class_course', dataForm)
	} else {
		return service.post('/train/class_course', dataForm)
	}
}

export const resetScheduleApi = (id: number) => {
	return service.put('/train/class_course/resetSchedule/' + id)
}

export const scheduleCourseApi = (dataForm: any) => {
	return service.post('/train/class_course/scheduleCourse', dataForm)
}
