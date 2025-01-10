import service from '@/utils/request'

export const useLesson_studentApi = (id: number) => {
	return service.get('/train/lesson_student/' + id)
}

export const useLesson_studentSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/train/lesson_student', dataForm)
	} else {
		return service.post('/train/lesson_student', dataForm)
	}
}
// 试听
export const addAuditionApi = (dataForm: any) => {
	return service.post('/train/lesson_student/addAudition', dataForm)
}

// 获取课程学员列表
export const lessonStudentsApi = (dataForm: any) => {
	return service.get('/train/lesson_student/lessonStudents', {
		params: {
			...dataForm
		}})
}