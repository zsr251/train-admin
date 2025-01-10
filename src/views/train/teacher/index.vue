<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item prop="teacherCode">
				<el-input v-model="state.queryForm.teacherCode" placeholder="登录名"></el-input>
			</el-form-item>
			<el-form-item prop="teacherName">
				<el-input v-model="state.queryForm.teacherName" placeholder="老师名称"></el-input>
			</el-form-item>
			<el-form-item prop="phone">
				<el-input v-model="state.queryForm.phone" placeholder="手机号"></el-input>
			</el-form-item>
			<el-form-item prop="jobType">
				<train-dict-select v-model="state.queryForm.jobType" dict-type="teacher_job_type" clearable placeholder="全职/兼职"></train-dict-select>
			</el-form-item>
			<el-form-item prop="status">
				<train-dict-select v-model="state.queryForm.status" dict-type="teacher_status" clearable placeholder="状态"></train-dict-select>
			</el-form-item>
			<el-form-item>
				<el-button icon="Search" type="primary" @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button icon="RefreshRight" @click="reset(queryRef)">重置</el-button>
			</el-form-item>
			<el-space>
				<el-popconfirm title="确定要导出吗?" @confirm="downloadExcel('/train/teacher/export', state.queryForm)">
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
				<el-button v-auth="'train:teacher:save'" icon="Plus" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-space>
			<el-space>
				<el-button v-auth="'train:teacher:delete'" icon="Delete" plain type="danger" @click="deleteBatchHandle()">批量删除</el-button>
			</el-space>
		</el-space>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="teacherCode" label="登录名" header-align="center" align="center"></el-table-column>
			<el-table-column prop="teacherName" label="老师名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="phone" label="手机号" header-align="center" align="center"></el-table-column>
			<train-dict-column prop="jobType" label="工作类型" dict-type="teacher_job_type"></train-dict-column>
			<el-table-column prop="certification" label="资格证" header-align="center" align="center"></el-table-column>
			<train-dict-column prop="status" label="状态" dict-type="teacher_status"></train-dict-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="200">
				<template #default="scope">
					<el-button v-auth="'train:teacher:delete'" type="primary" link @click="openTimetable(scope.row.teacherCode)">课表</el-button>
					<el-button v-auth="'train:teacher:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button v-auth="'train:teacher:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
					<el-dropdown v-auth="'sys:role:update'" @command="(command: string) => handleCommand(command, scope.row)">
						<el-button type="primary" class="el-dropdown-link" link>更多</el-button>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item command="plan">工资方案</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
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
		<appoint-timetable :reassign-visible="true" :leave-visible="true" ref="appointTimetableRef" ></appoint-timetable>
		<!-- 工资方案 -->
		 <wage-rule-edit ref= "wageRuleEditRef"></wage-rule-edit>
	</el-card>
</template>

<script setup lang="ts" name="TrainTeacherIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import AddOrUpdate from './add-or-update.vue'
import AppointTimetable from '@/views/train/timetable/appoint-timetable.vue'
import WageRuleEdit from './wage-rule-edit.vue'
import { downloadExcel } from '@/api/common'

const state: IHooksOptions = reactive({
	dataListUrl: '/train/teacher/page',
	deleteUrl: '/train/teacher',
	queryForm: {
		teacherCode: '',
		teacherName: '',
		phone: '',
		jobType: '',
		status: ''
	}
})

const queryRef = ref()
const addOrUpdateRef = ref()
const appointTimetableRef = ref()
const wageRuleEditRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud(state)

const handleCommand = (command: string, row: any) => {
	if (command === 'plan') {
		wageRuleEditRef.value.init(row.id)
	}
}
// 打开课程表
const openTimetable = (code: string) => {
	appointTimetableRef.value.init({
		teacherCode: code
	})
}
</script>
<style scoped>
.el-dropdown-link {
	display: flex;
	align-items: center;
	line-height: normal;
	margin-left: 10px;
}
</style>
