<template>
	<el-card>
		<el-row justify="end" style="margin: 10px">
			<el-col :span="6">
				<el-button type="primary" @click="handlePre"
					><el-icon class="el-icon--left"><ArrowLeft /></el-icon>上周</el-button
				>
				<el-button type="success" @click="handleCur">本周</el-button>
				<el-button type="primary" @click="handleNext">
					下周<el-icon class="el-icon--right"><ArrowRight /></el-icon>
				</el-button>
				<el-button type="success" circle @click="handleRefresh"
					><el-icon><Refresh /></el-icon
				></el-button>
			</el-col>
		</el-row>
		<el-table :data="appointTimetable.voList" header-align="center" style="width: 100%" border>
			<el-table-column prop="label" header-align="center" align="center">
				<template #default="scope">
					<div>
						<div>{{ scope.row.label }}</div>
						<div>{{ scope.row.desc }}</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="mon" header-align="center" align="center">
				<template #header>
					<div :class="{ curday: appointTimetable.today != '' && appointTimetable.today == appointTimetable.monDay }">
						<div>周一</div>
						<div>{{ appointTimetable.monDay }}</div>
					</div>
				</template>
				<template #default="scope">
					<el-popover v-for="item in scope.row.mon" :key="item.id" placement="right" :width="300" trigger="hover">
						<template #reference>
							<div class="lessonItem" @click="handleItemClick(item)">
								<div>{{ item.className }}</div>
								<div>{{ item.courseName }} （{{ item.teacherName }}）</div>
								<div>{{ item.lessonBeginTime }} ～ {{ item.lessonEndTime }}</div>
								<div>{{ item.classroomName }}</div>
								<div>{{ item.lessonStatusLabel }}</div>
							</div>
						</template>
						<template #default>
							<div style="display: flex; flex-direction: column; align-items: between">
								<div style="border: 20px">
									<div>班级：{{ item.className }}</div>
									<div>课程：{{ item.courseName }} （{{ item.teacherName }}）</div>
									<div>时间：{{ item.lessonBeginTime }} ～ {{ item.lessonEndTime }}</div>
									<div>教室：{{ item.classroomName }}</div>
									<div>状态：{{ item.lessonStatusLabel }}</div>
								</div>
								<div v-if="item.lessonStatus == 'wait' && props.buttonVisible" style="display: flex; justify-content: center; margin-top: 10px">
									<el-button size="small" v-if="props.namedVisible" @click="handleNamedClick(item)" plain>点名</el-button>
									<el-button size="small" v-if="props.auditionVisible" @click="handleAuditionClick(item)" plain>试听</el-button>
									<el-button size="small" v-if="props.reassignVisible" @click="handleReassignClick(item)" plain>调课</el-button>
									<el-button size="small" v-if="props.cancelVisible" @click="handleCancelClick(item)" plain>撤销</el-button>
									<el-button size="small" v-if="props.leaveVisible" @click="handleLeaveClick(item)" plain>请假</el-button>
								</div>
							</div>
						</template>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column prop="tue" header-align="center" align="center">
				<template #header>
					<div :class="{ curday: appointTimetable.today != '' && appointTimetable.today == appointTimetable.tueDay }">
						<div>周二</div>
						<div>{{ appointTimetable.tueDay }}</div>
					</div>
				</template>
				<template #default="scope">
					<el-popover v-for="item in scope.row.tue" :key="item.id" placement="right" :width="300" trigger="hover">
						<template #reference>
							<div class="lessonItem" @click="handleItemClick(item)">
								<div>{{ item.className }}</div>
								<div>{{ item.courseName }} （{{ item.teacherName }}）</div>
								<div>{{ item.lessonBeginTime }} ～ {{ item.lessonEndTime }}</div>
								<div>{{ item.classroomName }}</div>
								<div>{{ item.lessonStatusLabel }}</div>
							</div>
						</template>
						<template #default>
							<div style="display: flex; flex-direction: column; align-items: between">
								<div style="border: 20px">
									<div>班级：{{ item.className }}</div>
									<div>课程：{{ item.courseName }} （{{ item.teacherName }}）</div>
									<div>时间：{{ item.lessonBeginTime }} ～ {{ item.lessonEndTime }}</div>
									<div>教室：{{ item.classroomName }}</div>
									<div>状态：{{ item.lessonStatusLabel }}</div>
								</div>
								<div v-if="item.lessonStatus == 'wait' && props.buttonVisible" style="display: flex; justify-content: center; margin-top: 10px">
									<el-button size="small" v-if="props.namedVisible" @click="handleNamedClick(item)" plain>点名</el-button>
									<el-button size="small" v-if="props.auditionVisible" @click="handleAuditionClick(item)" plain>试听</el-button>
									<el-button size="small" v-if="props.reassignVisible" @click="handleReassignClick(item)" plain>调课</el-button>
									<el-button size="small" v-if="props.cancelVisible" @click="handleCancelClick(item)" plain>撤销</el-button>
									<el-button size="small" v-if="props.leaveVisible" @click="handleLeaveClick(item)" plain>请假</el-button>
								</div>
							</div>
						</template>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column prop="wed" header-align="center" align="center">
				<template #header>
					<div :class="{ curday: appointTimetable.today != '' && appointTimetable.today == appointTimetable.wedDay }">
						<div>周三</div>
						<div>{{ appointTimetable.wedDay }}</div>
					</div>
				</template>
				<template #default="scope">
					<el-popover v-for="item in scope.row.wed" :key="item.id" placement="right" :width="300" trigger="hover">
						<template #reference>
							<div class="lessonItem" @click="handleItemClick(item)">
								<div>{{ item.className }}</div>
								<div>{{ item.courseName }} （{{ item.teacherName }}）</div>
								<div>{{ item.lessonBeginTime }} ～ {{ item.lessonEndTime }}</div>
								<div>{{ item.classroomName }}</div>
								<div>{{ item.lessonStatusLabel }}</div>
							</div>
						</template>
						<template #default>
							<div style="display: flex; flex-direction: column; align-items: between">
								<div style="border: 20px">
									<div>班级：{{ item.className }}</div>
									<div>课程：{{ item.courseName }} （{{ item.teacherName }}）</div>
									<div>时间：{{ item.lessonBeginTime }} ～ {{ item.lessonEndTime }}</div>
									<div>教室：{{ item.classroomName }}</div>
									<div>状态：{{ item.lessonStatusLabel }}</div>
								</div>
								<div v-if="item.lessonStatus == 'wait' && props.buttonVisible" style="display: flex; justify-content: center; margin-top: 10px">
									<el-button size="small" v-if="props.namedVisible" @click="handleNamedClick(item)" plain>点名</el-button>
									<el-button size="small" v-if="props.auditionVisible" @click="handleAuditionClick(item)" plain>试听</el-button>
									<el-button size="small" v-if="props.reassignVisible" @click="handleReassignClick(item)" plain>调课</el-button>
									<el-button size="small" v-if="props.cancelVisible" @click="handleCancelClick(item)" plain>撤销</el-button>
									<el-button size="small" v-if="props.leaveVisible" @click="handleLeaveClick(item)" plain>请假</el-button>
								</div>
							</div>
						</template>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column prop="thu" header-align="center" align="center">
				<template #header>
					<div :class="{ curday: appointTimetable.today != '' && appointTimetable.today == appointTimetable.thuDay }">
						<div>周四</div>
						<div>{{ appointTimetable.thuDay }}</div>
					</div>
				</template>
				<template #default="scope">
					<el-popover v-for="item in scope.row.thu" :key="item.id" placement="right" :width="300" trigger="hover">
						<template #reference>
							<div class="lessonItem" @click="handleItemClick(item)">
								<div>{{ item.className }}</div>
								<div>{{ item.courseName }} （{{ item.teacherName }}）</div>
								<div>{{ item.lessonBeginTime }} ～ {{ item.lessonEndTime }}</div>
								<div>{{ item.classroomName }}</div>
								<div>{{ item.lessonStatusLabel }}</div>
							</div>
						</template>
						<template #default>
							<div style="display: flex; flex-direction: column; align-items: between">
								<div style="border: 20px">
									<div>班级：{{ item.className }}</div>
									<div>课程：{{ item.courseName }} （{{ item.teacherName }}）</div>
									<div>时间：{{ item.lessonBeginTime }} ～ {{ item.lessonEndTime }}</div>
									<div>教室：{{ item.classroomName }}</div>
									<div>状态：{{ item.lessonStatusLabel }}</div>
								</div>
								<div v-if="item.lessonStatus == 'wait' && props.buttonVisible" style="display: flex; justify-content: center; margin-top: 10px">
									<el-button size="small" v-if="props.namedVisible" @click="handleNamedClick(item)" plain>点名</el-button>
									<el-button size="small" v-if="props.auditionVisible" @click="handleAuditionClick(item)" plain>试听</el-button>
									<el-button size="small" v-if="props.reassignVisible" @click="handleReassignClick(item)" plain>调课</el-button>
									<el-button size="small" v-if="props.cancelVisible" @click="handleCancelClick(item)" plain>撤销</el-button>
									<el-button size="small" v-if="props.leaveVisible" @click="handleLeaveClick(item)" plain>请假</el-button>
								</div>
							</div>
						</template>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column prop="fri" header-align="center" align="center">
				<template #header>
					<div :class="{ curday: appointTimetable.today != '' && appointTimetable.today == appointTimetable.friDay }">
						<div>周五</div>
						<div>{{ appointTimetable.friDay }}</div>
					</div>
				</template>
				<template #default="scope">
					<el-popover v-for="item in scope.row.fri" :key="item.id" placement="right" :width="300" trigger="hover">
						<template #reference>
							<div class="lessonItem" @click="handleItemClick(item)">
								<div>{{ item.className }}</div>
								<div>{{ item.courseName }} （{{ item.teacherName }}）</div>
								<div>{{ item.lessonBeginTime }} ～ {{ item.lessonEndTime }}</div>
								<div>{{ item.classroomName }}</div>
								<div>{{ item.lessonStatusLabel }}</div>
							</div>
						</template>
						<template #default>
							<div style="display: flex; flex-direction: column; align-items: between">
								<div style="border: 20px">
									<div>班级：{{ item.className }}</div>
									<div>课程：{{ item.courseName }} （{{ item.teacherName }}）</div>
									<div>时间：{{ item.lessonBeginTime }} ～ {{ item.lessonEndTime }}</div>
									<div>教室：{{ item.classroomName }}</div>
									<div>状态：{{ item.lessonStatusLabel }}</div>
								</div>
								<div v-if="item.lessonStatus == 'wait' && props.buttonVisible" style="display: flex; justify-content: center; margin-top: 10px">
									<el-button size="small" v-if="props.namedVisible" @click="handleNamedClick(item)" plain>点名</el-button>
									<el-button size="small" v-if="props.auditionVisible" @click="handleAuditionClick(item)" plain>试听</el-button>
									<el-button size="small" v-if="props.reassignVisible" @click="handleReassignClick(item)" plain>调课</el-button>
									<el-button size="small" v-if="props.cancelVisible" @click="handleCancelClick(item)" plain>撤销</el-button>
									<el-button size="small" v-if="props.leaveVisible" @click="handleLeaveClick(item)" plain>请假</el-button>
								</div>
							</div>
						</template>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column prop="sat" header-align="center" align="center">
				<template #header>
					<div :class="{ curday: appointTimetable.today != '' && appointTimetable.today == appointTimetable.satDay }">
						<div>周六</div>
						<div>{{ appointTimetable.satDay }}</div>
					</div>
				</template>
				<template #default="scope">
					<el-popover v-for="item in scope.row.sat" :key="item.id" placement="right" :width="300" trigger="hover">
						<template #reference>
							<div class="lessonItem" @click="handleItemClick(item)">
								<div>{{ item.className }}</div>
								<div>{{ item.courseName }} （{{ item.teacherName }}）</div>
								<div>{{ item.lessonBeginTime }} ～ {{ item.lessonEndTime }}</div>
								<div>{{ item.classroomName }}</div>
								<div>{{ item.lessonStatusLabel }}</div>
							</div>
						</template>
						<template #default>
							<div style="display: flex; flex-direction: column; align-items: between">
								<div style="border: 20px">
									<div>班级：{{ item.className }}</div>
									<div>课程：{{ item.courseName }} （{{ item.teacherName }}）</div>
									<div>时间：{{ item.lessonBeginTime }} ～ {{ item.lessonEndTime }}</div>
									<div>教室：{{ item.classroomName }}</div>
									<div>状态：{{ item.lessonStatusLabel }}</div>
								</div>
								<div v-if="item.lessonStatus == 'wait' && props.buttonVisible" style="display: flex; justify-content: center; margin-top: 10px">
									<el-button size="small" v-if="props.namedVisible" @click="handleNamedClick(item)" plain>点名</el-button>
									<el-button size="small" v-if="props.auditionVisible" @click="handleAuditionClick(item)" plain>试听</el-button>
									<el-button size="small" v-if="props.reassignVisible" @click="handleReassignClick(item)" plain>调课</el-button>
									<el-button size="small" v-if="props.cancelVisible" @click="handleCancelClick(item)" plain>撤销</el-button>
									<el-button size="small" v-if="props.leaveVisible" @click="handleLeaveClick(item)" plain>请假</el-button>
								</div>
							</div>
						</template>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column prop="sun" header-align="center" align="center">
				<template #header>
					<div :class="{ curday: appointTimetable.today != '' && appointTimetable.today == appointTimetable.sunDay }">
						<div>周日</div>
						<div>{{ appointTimetable.sunDay }}</div>
					</div>
				</template>
				<template #default="scope">
					<el-popover v-for="item in scope.row.sun" :key="item.id" placement="right" :width="300" trigger="hover">
						<template #reference>
							<div class="lessonItem" @click="handleItemClick(item)">
								<div>{{ item.className }}</div>
								<div>{{ item.courseName }} （{{ item.teacherName }}）</div>
								<div>{{ item.lessonBeginTime }} ～ {{ item.lessonEndTime }}</div>
								<div>{{ item.classroomName }}</div>
								<div>{{ item.lessonStatusLabel }}</div>
							</div>
						</template>
						<template #default>
							<div style="display: flex; flex-direction: column; align-items: between">
								<div style="border: 20px">
									<div>班级：{{ item.className }}</div>
									<div>课程：{{ item.courseName }} （{{ item.teacherName }}）</div>
									<div>时间：{{ item.lessonBeginTime }} ～ {{ item.lessonEndTime }}</div>
									<div>教室：{{ item.classroomName }}</div>
									<div>状态：{{ item.lessonStatusLabel }}</div>
								</div>
								<div v-if="item.lessonStatus == 'wait' && props.buttonVisible" style="display: flex; justify-content: center; margin-top: 10px">
									<el-button size="small" v-if="props.namedVisible" @click="handleNamedClick(item)" plain>点名</el-button>
									<el-button size="small" v-if="props.auditionVisible" @click="handleAuditionClick(item)" plain>试听</el-button>
									<el-button size="small" v-if="props.reassignVisible" @click="handleReassignClick(item)" plain>调课</el-button>
									<el-button size="small" v-if="props.cancelVisible" @click="handleCancelClick(item)" plain>撤销</el-button>
									<el-button size="small" v-if="props.leaveVisible" @click="handleLeaveClick(item)" plain>请假</el-button>
								</div>
							</div>
						</template>
					</el-popover>
				</template>
			</el-table-column>
		</el-table>
	</el-card>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { getAppointTimetableApi } from '@/api/train/lesson_timetable'
import { ArrowLeft, ArrowRight, Refresh, Edit, Share, SortUp } from '@element-plus/icons-vue'
const props = defineProps({
	visible: Boolean,
	studentId: Number,
	classCode: String,
	teacherCode: String,
	buttonVisible: {
		type: Boolean,
		default: false
	},
	namedVisible: {
		type: Boolean,
		default: false
	},
	auditionVisible: {
		type: Boolean,
		default: false
	},
	reassignVisible: {
		type: Boolean,
		default: false
	},
	cancelVisible: {
		type: Boolean,
		default: false
	},
	leaveVisible: {
		type: Boolean,
		default: false
	},
})
const dataForm = ref({
	studentId: 0,
	classCode: '',
	teacherCode: '',
	classroomCode: '',
	courseCode: ''
})
let week = ref(0)

const appointTimetable = ref({
	week: 0,
	today: '',
	monDay: '',
	tueDay: '',
	wedDay: '',
	thuDay: '',
	friDay: '',
	satDay: '',
	sunDay: '',
	voList: []
})
/**
 * 初始化
 */
const init = (d?: any) => {
	// console.log("buttonVisible："+props.buttonVisible)
	// console.log("namedVisible："+props.namedVisible)
	// console.log("reassignVisible："+props.reassignVisible)
	// console.log("cancelVisible："+props.cancelVisible)
	// console.log("auditionVisible:"+props.auditionVisible)
	if (d) {
		dataForm.value = d
		week.value = 0
	}
	getAppointTimetableApi({
		week: week.value,
		studentId: dataForm.value.studentId,
		teacherCode: dataForm.value.teacherCode,
		classroomCode: dataForm.value.classroomCode,
		courseCode: dataForm.value.courseCode,
		classCode: dataForm.value.classCode
	}).then(res => {
		appointTimetable.value = res.data
	})
}

const handlePre = () => {
	week.value = week.value - 1
	init()
}
const handleCur = () => {
	if (week.value == 0) {
		return
	}
	week.value = 0
	init()
}
const handleNext = () => {
	week.value = week.value + 1
	init()
}
const handleRefresh = () => {
	init()
}
const emit = defineEmits(['select'])
/**
 * 点击列表项
 */
const handleItemClick = (item: any) => {
	emit('select', item)
}
/**
 * 点名
 */
const handleNamedClick = (item: any) => {
	console.log('点名：' + item)
}
/**
 * 试听
 */
const handleAuditionClick = (item: any) => {
	console.log('试听' + item)
}
/**
 * 调课
 */
const handleReassignClick = (item: any) => {
	console.log('调课' + item)
}
/**
 * 撤销
 */
const handleCancelClick = (item: any) => {
	console.log('撤销' + item)
}
/**
 * 请假
 */
const handleLeaveClick = (item: any) => {
	console.log('请假' + item)
}
defineExpose({
	init
})
</script>
<style lang="css" scoped>
.curday {
	color: #67c23a;
}
.lessonItem {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
	padding: 10px;
	border-radius: 5px;
	background-color: #e7f6df;
	cursor: pointer;
	&:hover {
		background-color: #f9debe;
	}
	border-bottom-color: brown;
	border-bottom-width: 10px;
	border-color: aqua;
}
</style>
