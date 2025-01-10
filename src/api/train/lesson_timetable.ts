import service from '@/utils/request'

export const useLesson_timetableApi = (id: number) => {
	return service.get('/train/lesson_timetable/' + id)
}

export const useLesson_timetableSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/train/lesson_timetable', dataForm)
	} else {
		return service.post('/train/lesson_timetable', dataForm)
	}
}

export const getTeachersTimetableApi = (dataForm: any) => {
	return service.get('/train/lesson_timetable/teachers', {
		params: {
			...dataForm
		}})
}

export const getClassroomsTimetableApi = (dataForm: any) => {
	return service.get('/train/lesson_timetable/classrooms',{
		params: {
			...dataForm
		}})
	
}

export const getAppointTimetableApi = (dataForm: any) => {
	return service.get('/train/lesson_timetable/appoint', {
		params: {
			...dataForm
		}})
		
}

export const namedApi = (dataForm: any) => {
	return service.post('/train/lesson_timetable/named', dataForm)
}

export const cancelApi = (dataForm: any) => {
	return service.post('/train/lesson_timetable/cancel', dataForm)
}

export const reassignApi = (dataForm: any) => {
	return service.post('/train/lesson_timetable/reassign', dataForm)
}