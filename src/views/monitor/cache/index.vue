<template>
	<el-card class="monitor-cache">
		<el-card class="box-card">
			<template #header>
				<div class="card-header">
					<span>基本信息</span>
				</div>
			</template>
			<el-descriptions :column="3" border>
				<el-descriptions-item label="Redis版本">{{ data.info.redis_version }}</el-descriptions-item>
				<el-descriptions-item label="运行模式">{{ data.info.redis_mode == 'standalone' ? '单机' : '集群' }}</el-descriptions-item>
				<el-descriptions-item label="端口">{{ data.info.tcp_port }}</el-descriptions-item>
				<el-descriptions-item label="客户端">{{ data.info.connected_clients }}</el-descriptions-item>
				<el-descriptions-item label="运行时间（天）">{{ data.info.uptime_in_days }}</el-descriptions-item>
				<el-descriptions-item label="Key数量">{{ data.keyCount }}</el-descriptions-item>
				<el-descriptions-item label="最大内存配置">{{ data.info.maxmemory_human }}</el-descriptions-item>
				<el-descriptions-item label="使用CPU">{{ data.info.used_cpu_user_children }}%</el-descriptions-item>
				<el-descriptions-item label="已用内存">{{ data.info.used_memory_human }}</el-descriptions-item>
				<el-descriptions-item label="AOF是否开启">{{ data.info.aof_enabled === 0 ? '否' : '是' }}</el-descriptions-item>
				<el-descriptions-item label="RDB是否成功">{{ data.info.rdb_last_bgsave_status }}</el-descriptions-item>
				<el-descriptions-item label="网络入口/出口"
					>{{ data.info.instantaneous_input_kbps }}kps/{{ data.info.instantaneous_output_kbps }}kps</el-descriptions-item
				>
			</el-descriptions>
		</el-card>
		<el-card class="layout-query">
			<el-form ref="queryRef" :rules="dataRules" :inline="true" :model="queryForm">
				<el-form-item prop="cacheKey">
					<el-input v-model="queryForm.cacheKey" placeholder="不带 * 的Redis Key"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button icon="Search" type="primary" @click="getKeyList()">查询</el-button>
					<el-button type="danger" @click="deleteKeys(queryForm.cacheKey)">删除缓存</el-button>
				</el-form-item>
			</el-form>
			<div>
				<el-table :data="keys" header-align="center" style="width: 100%">
					<el-table-column align="center" prop="key" label="Redis Key">
						<template #default="scope">
							<el-text>{{ scope.row }}</el-text>
						</template>
					</el-table-column>
					<el-table-column align="center" width="150" label="操作">
						<template #default="scope">
							<el-link @click="deleteKey(scope.row)">删除</el-link>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</el-card>
		<el-card class="box-card">
			<template #header>
				<div class="card-header">
					<span>命令统计</span>
				</div>
			</template>
			<el-table :data="data.commandStats" header-align="center" style="width: 100%">
				<el-table-column align="center" prop="name" label="属性" />
				<el-table-column align="center" prop="value" label="值" />
			</el-table>
		</el-card>
	</el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCacheInfoApi, getCacheKeysApi, delCacheKeyApi, delCacheKeysApi } from '@/api/monitor/cache'
import { ElMessage } from 'element-plus'

const data = ref({
	info: {
		redis_version: '',
		redis_mode: 'standalone',
		tcp_port: 6379,
		connected_clients: 1,
		uptime_in_days: 0,
		used_memory_human: 0,
		used_cpu_user_children: 0,
		maxmemory_human: 0,
		aof_enabled: 0,
		rdb_last_bgsave_status: '0',
		instantaneous_input_kbps: '0.00',
		instantaneous_output_kbps: '0.00'
	},
	keyCount: 0,
	commandStats: []
})

const init = onMounted(() => {
	getCacheInfo()
})

const getCacheInfo = () => {
	useCacheInfoApi().then(res => {
		data.value = res.data
	})
}

const queryRef = ref()
const keys = ref([])
const queryForm = ref({
	cacheKey: ''
})
const dataRules = ref({
	cacheKey: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})
const getKeyList = () => {
	if (queryForm.value.cacheKey == '') {
		ElMessage.warning({
			message: '请输入Redis Key',
			duration: 500
		})
		return
	}
	keys.value = []
	getCacheKeysApi(queryForm.value.cacheKey).then(res => {
		keys.value = res.data
	})
}
const deleteKey = (cacheKey: string) => {
	if (cacheKey != '') {
		delCacheKeyApi(cacheKey).then(() => {
			// 提示成功
			ElMessage.success({
				message: '删除成功',
				duration: 500
			})
			getKeyList()
		})
	} else {
		ElMessage.warning({
			message: '请输入Redis Key',
			duration: 500
		})
	}
}
const deleteKeys = (cacheKey: string) => {
	if (cacheKey != '') {
		delCacheKeysApi(cacheKey).then(() => {
			// 提示成功
			ElMessage.success({
				message: '删除成功',
				duration: 500
			})
			getKeyList()
		})
	} else {
		ElMessage.warning({
			message: '请输入Redis Key',
			duration: 500
		})
	}
}
</script>

<style lang="scss" scoped>
.monitor-cache {
	.box-card {
		margin-bottom: 15px;
	}
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		span {
			font-size: 16px;
			font-weight: bold;
		}
	}
	::v-deep(.el-descriptions__label) {
		width: 120px !important;
	}
	::v-deep(.el-descriptions__content) {
		width: 200px !important;
	}
}
</style>
