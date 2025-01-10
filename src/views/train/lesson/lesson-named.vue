<template>
	<el-dialog v-model="visible" title="点名消课" :close-on-click-modal="false" width="80%">
		<el-card>
			<el-descriptions title="上课信息" :column="3" border>
				<el-descriptions-item label="班级名称">{{ className }}</el-descriptions-item>
				<el-descriptions-item label="课程名称">{{ courseName }}</el-descriptions-item>
				<el-descriptions-item label="教室名称">{{ classroomName }}</el-descriptions-item>
				<el-descriptions-item label="任课老师">{{ teacherName }}</el-descriptions-item>
				<el-descriptions-item label="课程计划日期">{{ lessonDate }}</el-descriptions-item>
				<el-descriptions-item label="上课时间段">{{ lessonBeginTime }} ~ {{ lessonEndTime }}</el-descriptions-item>
				<el-descriptions-item label="扣课时数">{{ courseHour }}</el-descriptions-item>
				<el-descriptions-item label="课程状态"
					><el-tag>{{ lessonStatusLabel }}</el-tag></el-descriptions-item
				>
				<el-descriptions-item label="备注">{{ remark }}</el-descriptions-item>
			</el-descriptions>
		</el-card>
		<el-row justify="end" style="margin: 10px">
			<el-button @click="handleAllArrived">一键填写</el-button>
			<el-button type="primary" :icon="Plus" @click="handleAddAudition">添加试听</el-button>
		</el-row>
		<el-table :data="lessonStudents" v-loading="loading" header-align="center" style="width: 100%" border>
			<el-table-column prop="studentName" label="学员" header-align="center" align="center"> </el-table-column>
			<train-dict-column prop="memberType" label="学员类型" dict-type="lesson_member_type"></train-dict-column>
			<el-table-column prop="arrivalStatus" label="到课状态" header-align="center" align="center">
				<template #default="scope">
					<train-dict-select v-model="scope.row.arrivalStatus" dict-type="lesson_arrival_status" clearable placeholder="到课状态"></train-dict-select>
				</template>
			</el-table-column>
			<el-table-column prop="courseHour" label="扣课时数" header-align="center" align="center">
				<template #default="scope">
					<el-input-number v-model="scope.row.courseHour" type="number" placeholder="扣课时数" clearable></el-input-number>
				</template>
			</el-table-column>
			<el-table-column prop="remark" label="备注" header-align="center" align="center">
				<template #default="scope">
					<el-input v-model="scope.row.remark" type="textarea" autosize placeholder="备注" clearable></el-input>
				</template>
			</el-table-column>
		</el-table>

		<template #footer>
			<el-row justify="center" style="margin: 10px">
				<el-button :disabled="loading" @click="visible = false">取消</el-button>
				<el-button :disabled="loading" type="danger" @click="submitHandle()">确定点名消课</el-button>
			</el-row>
		</template>
	</el-dialog>
	<!-- 添加试听 -->
	<course-audition-add ref="courseAuditionAddRef" v-bind="props" @success="handleAddAuditionSuccess"></course-audition-add>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { lessonStudentsApi } from '@/api/train/lesson_student'
import { namedApi } from '@/api/train/lesson_timetable'
import CourseAuditionAdd from '@/views/train/course/course-audition-add.vue'
import { Plus } from '@element-plus/icons-vue'
const props = defineProps({
	id: Number,
	classCode: String,
	className: String,
	courseCode: String,
	courseName: String,
	teacherCode: String,
	teacherName: String,
	lessonDate: String,
	lessonBeginTime: String,
	lessonEndTime: String,
	classroomCode: String,
	classroomName: String,
	courseHour: Number,
	lessonStatusLabel: String,
	remark: String
})
const visible = ref(false)
const lessonStudents = ref([])
const courseAuditionAddRef = ref()
const loading = ref(false)

const init = (lessonId: number) => {
	visible.value = true
	loading.value = true
	lessonStudentsApi({
		lessonId: lessonId
	}).then((res: any) => {
		lessonStudents.value = res.data
		loading.value = false
	}).catch(() => {
		loading.value = false
	})
}
const emit = defineEmits(['refreshDataList'])
// 表单提交
const submitHandle = () => {
	loading.value = true
	namedApi({
		lessonId: props.id,
		defaultArrivalStatus: 'arrived',
		voList: lessonStudents.value
	})
		.then(() => {
			emit('refreshDataList')
			ElMessage.success({
				message: '点名完成',
				duration: 500,
				onClose: () => {
					visible.value = false
					loading.value = false
				}
			})
		})
		.catch(err => {
			loading.value = false
		})
}
/**
 * 默认全部到课
 */
const handleAllArrived = () => {
	// 遍历每一个 判断状态是否是等待
	lessonStudents.value.forEach((item: any) => {
		if (item.arrivalStatus == 'wait') {
			item.arrivalStatus = 'arrived'
			if (item.memberType == 'student') {
				item.courseHour = props.courseHour
			}
		}
	})
	ElMessage.success({
		message: '等待状态已全部变为已到课',
		duration: 500
	})
}
/**
 * 添加试听
 */
const handleAddAudition = () => {
	courseAuditionAddRef.value.init()
}
/**
 * 添加试听成功
 */
const handleAddAuditionSuccess = () => {
	loading.value = true
	lessonStudentsApi({
		lessonId: props.id
	}).then((res: any) => {
		lessonStudents.value = res.data
		loading.value = false
	}).catch(() => {
		loading.value = false
	})
}
defineExpose({
	init
})
</script>
<style scoped></style>
