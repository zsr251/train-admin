<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
					<el-form-item>
				<el-button icon="Search" type="primary" @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button icon="RefreshRight" @click="reset(queryRef)">重置</el-button>
			</el-form-item>
		</el-form>
	</el-card>

	<el-card>
		<el-space>
			<el-space>
				<el-button v-auth="'train:course_audition:save'" icon="Plus" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-space>
			<el-space>
				<el-button v-auth="'train:course_audition:delete'" icon="Delete" plain type="danger" @click="deleteBatchHandle()">批量删除</el-button>
			</el-space>
		</el-space>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="id" label="id" header-align="center" align="center"></el-table-column>
			<el-table-column prop="studentId" label="学员ID" header-align="center" align="center"></el-table-column>
			<el-table-column prop="lessonId" label="课程计划ID" header-align="center" align="center"></el-table-column>
			<el-table-column prop="courseCode" label="课程编码" header-align="center" align="center"></el-table-column>
			<el-table-column prop="classCode" label="班级编码" header-align="center" align="center"></el-table-column>
			<el-table-column prop="classroomCode" label="教室编码" header-align="center" align="center"></el-table-column>
			<el-table-column prop="teacher" label="老师编码" header-align="center" align="center"></el-table-column>
			<el-table-column prop="auditionStatus" label="试听状态" header-align="center" align="center"></el-table-column>
			<el-table-column prop="auditionFeedback" label="试听反馈" header-align="center" align="center"></el-table-column>
			<el-table-column prop="approvalStatus" label="审批状态" header-align="center" align="center"></el-table-column>
			<el-table-column prop="version" label="版本号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="deleted" label="删除标识  0：正常   1：已删除" header-align="center" align="center"></el-table-column>
			<el-table-column prop="creator" label="创建者" header-align="center" align="center"></el-table-column>
			<el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="updater" label="更新者" header-align="center" align="center"></el-table-column>
			<el-table-column prop="updateTime" label="更新时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="tenantId" label="租户ID" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-auth="'train:course_audition:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button v-auth="'train:course_audition:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
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

<script setup lang="ts" name="TrainCourse_auditionIndex">
	import {useCrud} from '@/hooks'
	import {reactive, ref} from 'vue'
	import {IHooksOptions} from '@/hooks/interface'
	import AddOrUpdate from './add-or-update.vue'

	const state: IHooksOptions = reactive({
	dataListUrl: '/train/course_audition/page',
	deleteUrl: '/train/course_audition',
	queryForm: {
	}
})

const queryRef = ref()
const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud(state)
</script>
