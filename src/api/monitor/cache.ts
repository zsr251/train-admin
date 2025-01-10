import service from '@/utils/request'

export const useCacheInfoApi = () => {
	return service.get('/monitor/cache/info')
}

export const getCacheKeysApi = (cacheKey: string) => {
	return service.get('/monitor/cache/getCacheKeys/'+cacheKey)
}

// 删除指定key
export const delCacheKeyApi = (cacheKey: string) => {
	return service.delete('/monitor/cache/delCacheKey/'+cacheKey)
}
// 删除指定key前缀
export const delCacheKeysApi = (cacheKey: string) => {
	return service.delete('/monitor/cache/delCacheKeys/'+cacheKey)
}