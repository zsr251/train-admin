<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item prop="classroomCode">
				<el-input v-model="state.queryForm.classroomCode" placeholder="教室编码"></el-input>
			</el-form-item>
			<el-form-item prop="classroomName">
				<el-input v-model="state.queryForm.classroomName" placeholder="教室名称"></el-input>
			</el-form-item>
			<el-form-item prop="classroomStatus">
				<train-dict-select v-model="state.queryForm.classroomStatus" dict-type="classroom_status" clearable placeholder="教室状态"></train-dict-select>
			</el-form-item>
			<el-form-item prop="ignoreConflict">
				<train-dict-select v-model="state.queryForm.ignoreConflict" dict-type="ignore_conflict" clearable placeholder="忽略排课冲突"></train-dict-select>
			</el-form-item>
			<el-form-item>
				<el-button icon="Search" type="primary" @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button icon="RefreshRight" @click="reset(queryRef)">重置</el-button>
			</el-form-item>
			<el-space>
				<el-popconfirm title="确定要导出吗?" @confirm="downloadExcel('/train/classroom/export', state.queryForm)">
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
				<el-button v-auth="'train:classroom:save'" icon="Plus" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-space>
			<el-space>
				<el-button v-auth="'train:classroom:delete'" icon="Delete" plain type="danger" @click="deleteBatchHandle()">批量删除</el-button>
			</el-space>
		</el-space>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="classroomCode" label="教室编码" header-align="center" align="center"></el-table-column>
			<el-table-column prop="classroomName" label="教室名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="capacity" label="教室容量" header-align="center" align="center"></el-table-column>
			<el-table-column prop="address" label="教室地址" header-align="center" align="center"></el-table-column>
			<train-dict-column prop="classroomStatus" label="教室状态" dict-type="classroom_status"></train-dict-column>
			<train-dict-column prop="ignoreConflict" label="排课冲突" dict-type="ignore_conflict"></train-dict-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="200">
				<template #default="scope">
					<el-button v-auth="'train:classroom:update'" type="primary" link @click="openTimetable(scope.row.classroomCode)">课表</el-button>
					<el-button v-auth="'train:classroom:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button v-auth="'train:classroom:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
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
		<!-- 课表 -->
		<appoint-timetable ref="appointTimetableRef" ></appoint-timetable>
	</el-card>
</template>

<script setup lang="ts" name="TrainClassroomIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import AddOrUpdate from './add-or-update.vue'
import AppointTimetable from '@/views/train/timetable/appoint-timetable.vue'
import { downloadExcel } from '@/api/common'

const state: IHooksOptions = reactive({
	dataListUrl: '/train/classroom/page',
	deleteUrl: '/train/classroom',
	queryForm: {
		classroomCode: '',
		classroomName: '',
		classroomStatus: ''
	}
})

const queryRef = ref()
const addOrUpdateRef = ref()
const appointTimetableRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud(state)
// 打开课程表
const openTimetable = (code: string) => {
	appointTimetableRef.value.init({
		classroomCode: code
	})
}
</script>
