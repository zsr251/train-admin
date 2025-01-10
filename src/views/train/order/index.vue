<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item prop="paidTimeBegin">
				<el-date-picker v-model="state.queryForm.paidTimeBegin" value-format="YYYY-MM-DD hh:mm:ss" type="datetime" placeholder="支付日期开始" />
			</el-form-item>
			<el-form-item prop="paidTimeEnd">
				<el-date-picker v-model="state.queryForm.paidTimeEnd" value-format="YYYY-MM-DD hh:mm:ss" type="datetime" placeholder="支付日期结束" />
			</el-form-item>
			<el-form-item prop="studentId">
				<train-student-input v-model="state.queryForm.studentId" :multiple="false" :clearable="true" placeholder="学员"></train-student-input>
			</el-form-item>
			<el-form-item prop="orderStatus">
				<train-dict-select v-model="state.queryForm.orderStatus" dict-type="order_status" clearable placeholder="订单状态"></train-dict-select>
			</el-form-item>
			<el-form-item>
				<el-button icon="Search" type="primary" @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button icon="RefreshRight" @click="reset(queryRef)">重置</el-button>
			</el-form-item>
			<el-space>
				<el-popconfirm title="确定要导出吗?" @confirm="downloadExcel('/train/order/export', state.queryForm)">
					<template #reference>
						<el-button icon="Download" >导出</el-button>
					</template>
				</el-popconfirm>
			</el-space>
		</el-form>
	</el-card>

	<el-card>
		<el-space>
			<el-space>
				<el-button v-auth="'train:lesson_timetable:save'" icon="Plus" type="primary" @click="handleView()">新增</el-button>
			</el-space>
		</el-space>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table" @selection-change="selectionChangeHandle">
			<el-table-column prop="studentName" label="学员" header-align="center" align="center"></el-table-column>
			<el-table-column prop="shouldPay" label="共需支付金额" header-align="center" align="center"></el-table-column>
			<el-table-column prop="paid" label="已支付金额" header-align="center" align="center"></el-table-column>
			<el-table-column prop="paidTime" label="支付时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="serviceFee" label="通道手续费" header-align="center" align="center"></el-table-column>
			<el-table-column prop="totalPrice" label="原订单金额" header-align="center" align="center"></el-table-column>
			<el-table-column prop="discount" label="减免金额" header-align="center" align="center"></el-table-column>
			<train-dict-column prop="orderStatus" label="订单状态" dict-type="order_status"></train-dict-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="200">
				<template #default="scope">
					<el-button type="primary" link @click="handleView(scope.row.id)">查看</el-button>
					<el-button v-if="scope.row.orderStatus == 'wait'" type="primary" link @click="handleCancel(scope.row.id)">取消</el-button>
					<el-button v-if="scope.row.orderStatus == 'wait'" type="primary" link @click="handlePay(scope.row.id)">支付</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
		</el-table>
		<el-pagination
			:current-page="state.page"
			:page-sizes="state.pageSizes"
			:page-size="state.limit"
			:total="state.total"
			layout="total, sizes, prev, pager, next, jumper"
			@size-change="sizeChangeHandle"
			@current-change="currentChangeHandle"
		>
		</el-pagination>

		<!-- 订单创建/详情 -->
		<order-info ref="orderInfoRef" @refreshDataList="getDataList"></order-info>
	</el-card>
</template>

<script setup lang="ts" name="OrderIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { ElMessage, ElMessageBox } from 'element-plus'
import { payApi, cancelApi } from '@/api/train/order'
import TrainStudentInput from '@/components/train-student-input/index.vue'
import OrderInfo from '@/views/train/order/order-info.vue'
import { downloadExcel } from '@/api/common'

const state: IHooksOptions = reactive({
	dataListUrl: '/train/order/page',
	deleteUrl: '/train/order',
	queryForm: {
		studentId: 0,
		orderStatus: '',
		paidTimeBegin: '',
		paidTimeEnd: ''
	}
})

const queryRef = ref()
const orderInfoRef = ref()
const selectedLesson = ref()
const lessonNamedRef = ref()

// 查看订单
const handleView = (id?: number) => {
	orderInfoRef.value.init(id)
}
// 取消订单
const handleCancel = (id: number) => {
	ElMessageBox.confirm('确定取消订单吗?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	})
		.then(() => {
			cancelApi({ id }).then(() => {
				ElMessage.success({
					message: '取消订单成功',
					duration: 500,
					onClose: () => {
						getDataList()
					}
				})
			})
		})
		.catch(() => {})
}
// 支付订单
const handlePay = (id: number) => {
	ElMessageBox.prompt('请输入支付的手续费。实际收到金额 = 支付金额 - 手续费', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		inputPattern: /^[0-9.]+$/,
		inputErrorMessage: '请输入数字'
	})
		.then(({ value }) => {
			console.log("输入的金额是：",value)
			payApi({
				id: id,
				serviceFee: value
			}).then(() => {
				ElMessage.success({
					message: '支付订单成功',
					duration: 1000,
					onClose: () => {
						getDataList()
					}
				})
			})
		})
		.catch(() => {})
	// ElMessageBox.confirm('确定支付订单吗?', '提示', {
	// 	confirmButtonText: '确定',
	// 	cancelButtonText: '取消',
	// 	type: 'warning'
	// })
	// 	.then(() => {
	// 		payApi({ id }).then(() => {
	// 			ElMessage.success({
	// 				message: '支付订单成功',
	// 				duration: 500,
	// 				onClose: () => {
	// 					getDataList()
	// 				}
	// 			})
	// 		})
	// 	})
	// 	.catch(() => {})
}
const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud(state)
</script>
<style scoped>
.el-dropdown-link {
	display: flex;
	align-items: center;
	line-height: normal;
	margin-left: 10px;
}
</style>
