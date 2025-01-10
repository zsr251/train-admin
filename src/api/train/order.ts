import service from '@/utils/request'

export const useOrderApi = (id: number) => {
	return service.get('/train/order/' + id)
}

export const useOrderSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/train/order', dataForm)
	} else {
		return service.post('/train/order', dataForm)
	}
}
export const payApi = (dataForm: any) => {
	return service.post('/train/order/pay', dataForm)
}
export const cancelApi = (dataForm: any) => {
	return service.post('/train/order/cancel', dataForm)
}
export const calcOrderPriceApi = (dataForm: any) => {
	return service.post('/train/order/calcOrderPrice', dataForm)
}
export const createOrder = (dataForm: any) => {
	return service.post('/train/order/createOrder', dataForm)
}
export const getOrderApi = (id: number) => {
	return service.get('/train/order/' + id)
}