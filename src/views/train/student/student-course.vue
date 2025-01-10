<template>
	<el-form :inline="true" :model="state.queryForm">
		<el-form-item>
			<el-button icon="Search" type="primary" @click="getDataList()">查询</el-button>
		</el-form-item>
		<el-form-item>
			<el-button icon="Plus" type="primary" @click="handleToBuy()">购买</el-button>
		</el-form-item>
	</el-form>
	<el-table
		v-loading="state.dataListLoading"
		:data="state.dataList"
		border
		style="width: 100%"
		@selection-change="selectionChangeHandle"
		@sort-change="sortChangeHandle"
	>
		<train-dict-column prop="courseCode" label="课程" dict-type="course_code"></train-dict-column>
		<el-table-column prop="courseHourDeplete" label="总消耗课时" header-align="center" align="center"></el-table-column>
		<el-table-column prop="courseHourLeft" label="剩余课时" header-align="center" align="center">
			<template #default="scope">
				<el-tag v-if="scope.row.courseHourLeft < 0" type="danger">{{ scope.row.courseHourLeft }}</el-tag>
			</template>
		</el-table-column>
		<el-table-column prop="remark" label="备注" header-align="center" align="center"></el-table-column>
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
</template>
<script lang="ts" setup>
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { ElMessage, ElMessageBox } from 'element-plus'
import OrderInfo from '@/views/train/order/order-info.vue'

const orderInfoRef = ref()

const props = defineProps({
	studentId: {
		type: Number,
		required: true
	}
})

const dataForm = reactive({
	studentId: props.studentId,
	id: -1
})

const state: IHooksOptions = reactive({
	dataListUrl: '/train/student_course_hour/page',
	deleteUrl: '/train/student_course_hour',
	queryForm: {
		courseCode: '',
		studentId: props.studentId
	}
})
// 购买课程
const handleToBuy = () => {
	let courseList = [] as any[]
	// 判断课程是否有负值的 如果有负值则加入课程列表
	state.dataList?.forEach(item => {
		if (item.courseHourLeft < 0) {
			courseList.push({
				courseCode: item.courseCode,
				buyHours: -item.courseHourLeft
			})
		}
	})
	orderInfoRef.value.init(null, {
		studentId: props.studentId,
		courseList: courseList
	})
}

const { getDataList, sizeChangeHandle, selectionChangeHandle, sortChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
<style lang="css" scoped></style>
