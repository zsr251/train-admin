import service from '@/utils/request'

export const useLeave_applyApi = (id: number) => {
	return service.get('/train/leave_apply/' + id)
}

export const useLeave_applySubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/train/leave_apply', dataForm)
	} else {
		return service.post('/train/leave_apply', dataForm)
	}
}