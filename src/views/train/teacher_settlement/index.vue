<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item prop="settlementName">
				<el-input v-model="state.queryForm.settlementName" placeholder="结算名称"></el-input>
			</el-form-item>
			<el-form-item prop="settlementDate">
				<el-input v-model="state.queryForm.settlementDate" placeholder="结算日期"></el-input>
			</el-form-item>
			<el-form-item prop="teacher">
				<el-input v-model="state.queryForm.teacher" placeholder="结算对象"></el-input>
			</el-form-item>
			<el-form-item prop="payDate">
				<el-input v-model="state.queryForm.payDate" placeholder="发薪日"></el-input>
			</el-form-item>
			<el-form-item prop="processor">
				<el-input v-model="state.queryForm.processor" placeholder="经办人"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button icon="Search" type="primary" @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button icon="RefreshRight" @click="reset(queryRef)">重置</el-button>
			</el-form-item>
			<el-space>
				<el-popconfirm title="确定要导出吗?" @confirm="downloadExcel('/train/teacher_settlement/export', state.queryForm)">
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
				<el-button v-auth="'train:teacher_settlement:save'" icon="Plus" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-space>
			<el-space>
				<el-button v-auth="'train:teacher_settlement:delete'" icon="Delete" plain type="danger" @click="deleteBatchHandle()">批量删除</el-button>
			</el-space>
		</el-space>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="settlementName" label="结算名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="settlementAmount" label="结算金额" header-align="center" align="center"></el-table-column>
			<el-table-column prop="settlementDate" label="结算日期" header-align="center" align="center"></el-table-column>
			<el-table-column prop="teacherName" label="结算对象" header-align="center" align="center"></el-table-column>
			<el-table-column prop="settlementBeginDate" label="结算开始日期" header-align="center" align="center"></el-table-column>
			<el-table-column prop="settlementEndDate" label="结算结束日期" header-align="center" align="center"></el-table-column>
			<el-table-column prop="payDate" label="发薪日" header-align="center" align="center"></el-table-column>
			<el-table-column prop="processor" label="经办人" header-align="center" align="center"></el-table-column>
			<el-table-column prop="settlementDetail" label="结算详情" header-align="center" align="center"></el-table-column>
			<el-table-column prop="settlementStatus" label="结算状态" header-align="center" align="center"></el-table-column>
			<el-table-column prop="remark" label="备注" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-auth="'train:teacher_settlement:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button v-auth="'train:teacher_settlement:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
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

		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update ref="addOrUpdateRef" @refreshDataList="getDataList"></add-or-update>
	</el-card>
</template>

<script setup lang="ts" name="TrainTeacher_settlementIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import AddOrUpdate from './add-or-update.vue'
import { downloadExcel } from '@/api/common'

const state: IHooksOptions = reactive({
	dataListUrl: '/train/teacher_settlement/page',
	deleteUrl: '/train/teacher_settlement',
	queryForm: {
		settlementName: '',
		settlementDate: '',
		teacherCode: '',
		payDate: '',
		processor: ''
	}
})

const queryRef = ref()
const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud(state)
</script>
