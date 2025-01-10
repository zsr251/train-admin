import service from '@/utils/request'

export const useReassign_applyApi = (id: number) => {
	return service.get('/train/reassign_apply/' + id)
}

export const useReassign_applySubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/train/reassign_apply', dataForm)
	} else {
		return service.post('/train/reassign_apply', dataForm)
	}
}