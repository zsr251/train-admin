import service from '@/utils/request'
import { ElMessageBox, ElMessage } from 'element-plus/es'

const api = {
	train: '/train',
	system: '/sys'
}
export default api
export const useDataApi = async (url: string) => {
	const { data } = await service.get(url)

	return data
}

// post
export const postAction = (url: string, parameter: any) => {
	return service({
		url: url,
		method: 'post',
		data: parameter
	})
}
export const postActionByJson = (url: string, parameter: any) => {
	return service({
		url: url,
		method: 'post',
		data: parameter,
		headers: {
			'Content-Type': 'application/json'
		}
	})
}
export const postFormAction = (url: string, parameter: any) => {
	return service({
		url: url,
		method: 'post',
		data: parameter,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}
// post method = {post | put}
export const httpAction = (url: string, parameter: any, method: string) => {
	return service({
		url: url,
		method: method,
		data: parameter
	})
}
// put
export const putAction = (url: string, parameter: any) => {
	return service({
		url: url,
		method: 'put',
		data: parameter
	})
}
// get
export const getAction = (url: string, parameter: any) => {
	return service({
		url: url,
		method: 'get',
		params: parameter
	})
}
export const getActionWaitTime = (url: string, parameter: any, time: number) => {
	return service({
		url: url,
		method: 'get',
		params: parameter,
		timeout: time
	})
}
// delete
export const deleteAction = (url: string, parameter: any) => {
	return service({
		url: url,
		method: 'delete',
		params: parameter
	})
}
// file
export const getFile = (url: string, parameter: any) => {
	return service({
		url: url,
		method: 'get',
		params: parameter,
		responseType: 'blob',
		timeout: 100000
	})
}
export const postFile = (url: string, parameter: any) => {
	return service({
		url: url,
		method: 'post',
		data: parameter,
		responseType: 'blob',
		timeout: 180000
	})
}
// 下载文件 excel导出
export const downFile = (url: string, parameter: any) => {
	return service({
		url: url,
		method: 'get',
		params: parameter,
		responseType: 'blob',
		timeout: 180000
	})
}
// 下载导出Excel文件
export const downloadExcel = async (url: string,parameter: any, filename?: string): Promise<any> => {
	try {
		const res = await service({
			responseType: 'blob',
			url: url,
			method: 'get',
			params: parameter,
			timeout: 180000
		})
		// 创建a标签
		const down = document.createElement('a')

		// 文件名没传，则使用时间戳
		if (filename) {
			down.download = filename
		} else {
			const downName = res.headers['content-disposition'].split('=')[1]
			down.download = decodeURI(downName)
		}

		// 隐藏a标签
		down.style.display = 'none'

		// 创建下载url
		down.href = URL.createObjectURL(
			new Blob([res.data], {
				type: res.data.type
			})
		)

		// 模拟点击下载
		document.body.appendChild(down)
		down.click()

		// 释放URL
		URL.revokeObjectURL(down.href)
		// 下载完成移除
		document.body.removeChild(down)
	} catch (err: any) {
		ElMessage.error(err.message)
	}
}
