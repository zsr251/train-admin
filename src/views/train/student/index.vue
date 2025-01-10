<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item prop="studentName">
				<el-input v-model="state.queryForm.studentName" placeholder="学生姓名"></el-input>
			</el-form-item>
			<el-form-item prop="phone">
				<el-input v-model="state.queryForm.phone" placeholder="手机号"></el-input>
			</el-form-item>
			<el-form-item prop="studentType">
				<train-dict-select v-model="state.queryForm.studentType" dict-type="student_type" clearable placeholder="学员类型"></train-dict-select>
			</el-form-item>
			<el-form-item prop="sourceType">
				<train-dict-select
					v-model="state.queryForm.sourceType"
					dict-type="student_source_type"
					clearable
					placeholder="学员来源类型"
				></train-dict-select>
			</el-form-item>
			<el-form-item>
				<el-button icon="Search" type="primary" @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button icon="RefreshRight" @click="reset(queryRef)">重置</el-button>
			</el-form-item>
			<el-space>
				<el-popconfirm title="确定要导出吗?" @confirm="downloadExcel('/train/student/export', state.queryForm)">
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
				<el-button v-auth="'train:student:save'" icon="Plus" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-space>
			<el-space>
				<el-button v-auth="'train:student:delete'" icon="Delete" plain type="danger" @click="deleteBatchHandle()">批量删除</el-button>
			</el-space>
		</el-space>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="studentName" label="学员姓名" header-align="center" align="center"></el-table-column>
			<el-table-column prop="phone" label="手机号" header-align="center" align="center"></el-table-column>
			<train-dict-column prop="studentType" label="学员类型" dict-type="student_type"></train-dict-column>
			<train-dict-column prop="gender" label="性别" dict-type="user_gender"></train-dict-column>
			<train-dict-column prop="status" label="状态" dict-type="student_status"></train-dict-column>
			<train-dict-column prop="intentionLevel" label="意向程度" dict-type="student_intention_level"></train-dict-column>
			<train-dict-column prop="followupStatus" label="跟进状态" dict-type="student_followup_status"></train-dict-column>
			<el-table-column prop="followupPerson" label="跟进人" header-align="center" align="center"></el-table-column>
			<train-dict-column prop="sourceType" label="学员来源类型" dict-type="student_source_type"></train-dict-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="200">
				<template #default="scope">
					<el-button v-auth="'train:student:update'" type="primary" link @click="studentCourseHour(scope.row)">课时</el-button>
					<el-button v-auth="'train:student:update'" type="primary" link @click="openTimetable(scope.row.id)">课表</el-button>
					<el-button v-auth="'train:student:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-dropdown v-auth="'sys:role:update'" @command="(command: string) => handleCommand(command, scope.row)">
						<el-button type="primary" class="el-dropdown-link" link>更多</el-button>
						<template #dropdown>
							<el-dropdown-menu>
								<!-- <el-dropdown-item command="qrcode">二维码</el-dropdown-item> -->
								<el-dropdown-item command="delete">删除</el-dropdown-item>
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
		<appoint-timetable ref="appointTimetableRef" :leave-visible="true" @select="handleLessonSelect"></appoint-timetable>
		<!-- 学员课时 -->
		<el-drawer v-if="courseVisible" v-model="courseVisible" :title="courseTitle" :size="800" :close-on-press-escape="false">
			<student-course :student-id="curStudentId"></student-course>
		</el-drawer>
		<!-- 二维码 -->
		<!-- <student-qrcode ref="studentQrcodeRef" :named-visible="true"></student-qrcode> -->
	</el-card>
</template>

<script setup lang="ts" name="TrainStudentIndex">
import { useCrud } from '@/hooks'
import { reactive, ref, onMounted } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import AddOrUpdate from './add-or-update.vue'
import AppointTimetable from '@/views/train/timetable/appoint-timetable.vue'
import StudentCourse from '@/views/train/student/student-course.vue'
import { downloadExcel } from '@/api/common'
import studentQrcode  from './student-qrcode.vue'

const state: IHooksOptions = reactive({
	dataListUrl: '/train/student/page',
	deleteUrl: '/train/student',
	queryForm: {
		studentName: '',
		phone: '',
		studentType: '',
		sourceType: ''
	}
})

const queryRef = ref()
const addOrUpdateRef = ref()
const appointTimetableRef = ref()
// const studentQrcodeRef = ref()
const courseVisible = ref(false)
const courseTitle = ref()
const curStudentId = ref(0)

const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud(state)

const handleCommand = (command: string, row: any) => {
	if (command === 'qrcode') {
		// studentQrcodeRef.value.init(row.id)
	} else if (command === 'delete') {
		deleteBatchHandle(row.id)
	}
}

const openTimetable = (id: number) => {
	appointTimetableRef.value.init({
		studentId: id
	})
}
const handleLessonSelect = (item: any) => {
	console.log(item)
}
/**
 * 打开学员课程课时
 */
const studentCourseHour = (row: any) => {
	courseVisible.value = true
	courseTitle.value = '学员课程 - ' + row.studentName
	curStudentId.value = row.id
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
