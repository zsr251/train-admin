<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item prop="depleteTimeBegin">
				<el-date-picker v-model="state.queryForm.depleteTimeBegin" value-format="YYYY-MM-DD hh:mm:ss" type="datetime" placeholder="课消时间开始" />
			</el-form-item>
			<el-form-item prop="depleteTimeEnd">
				<el-date-picker v-model="state.queryForm.depleteTimeEnd" value-format="YYYY-MM-DD hh:mm:ss" type="datetime" placeholder="课消日期结束" />
			</el-form-item>
			<el-form-item prop="studentId">
				<train-student-input v-model="state.queryForm.studentId" :multiple="false" :clearable="true" placeholder="学员"></train-student-input>
			</el-form-item>
			<el-form-item prop="courseCode">
				<train-course-input v-model="state.queryForm.courseCode" :multiple="false" :clearable="true" placeholder="课程"></train-course-input>
			</el-form-item>
			<el-form-item prop="teacherCode">
				<train-teacher-input v-model="state.queryForm.teacherCode" :multiple="false" :clearable="true" placeholder="老师"></train-teacher-input>
			</el-form-item>
			<el-form-item>
				<el-button icon="Search" type="primary" @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button icon="RefreshRight" @click="reset(queryRef)">重置</el-button>
			</el-form-item>
			<el-space>
				<el-popconfirm title="确定要导出吗?" @confirm="downloadExcel('/train/course_hour_deplete_log/export', state.queryForm)">
					<template #reference>
						<el-button icon="Download" >导出</el-button>
					</template>
				</el-popconfirm>
			</el-space>
		</el-form>
	</el-card>

	<el-card>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table" @selection-change="selectionChangeHandle">
			<el-table-column prop="studentName" label="学员" header-align="center" align="center"></el-table-column>
			<train-dict-column prop="className" label="班级" dict-type="class_code"></train-dict-column>
			<el-table-column prop="courseName" label="课程" header-align="center" align="center"></el-table-column>
			<el-table-column prop="teacherName" label="任课老师" header-align="center" align="center"></el-table-column>
			<el-table-column prop="classroomName" label="教室" header-align="center" align="center"></el-table-column>
			<el-table-column prop="lessonDate" label="课程日期" header-align="center" align="center"></el-table-column>
			<el-table-column prop="lessonBeginTime" label="课程开始时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="lessonEndTime" label="课程结束时间" header-align="center" align="center"></el-table-column>
			<train-dict-column prop="arrivalStatus" label="到课状态" dict-type="lesson_arrival_status"></train-dict-column>
			<el-table-column prop="courseHour" label="扣课时数" header-align="center" align="center"></el-table-column>
			<el-table-column prop="depleteTime" label="消课时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="courseHourBefore" label="消课前课时" header-align="center" align="center"></el-table-column>
			<el-table-column prop="courseHourAfter" label="消课后课时" header-align="center" align="center"></el-table-column>
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

<script setup lang="ts" name="TrainCourse_hour_deplete_logIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import AddOrUpdate from './add-or-update.vue'
import { downloadExcel } from '@/api/common'
import TrainStudentInput from '@/components/train-student-input/index.vue'
import TrainCourseInput from '@/components/train-course-input/index.vue'
import TrainTeacherInput from '@/components/train-teacher-input/index.vue'

const state: IHooksOptions = reactive({
	dataListUrl: '/train/course_hour_deplete_log/page',
	deleteUrl: '/train/course_hour_deplete_log',
	queryForm: {
		depleteTimeBegin: '',
		depleteTimeEnd: '',
		studentId: '',
		courseCode: '',
		teacherCode: ''
	}
})

const queryRef = ref()
const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud(state)
</script>
