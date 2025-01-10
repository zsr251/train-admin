<template>
	<el-card>
		<el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
			<el-tab-pane label="老师课表" name="teachers">
				<el-row justify="end" style="margin: 10px">
					<el-col :span="6">
						<el-button type="primary" :icon="ArrowLeft" @click="handlePre('teachers')">上周</el-button>
						<el-button type="success" @click="handleCur('teachers')">本周</el-button>
						<el-button type="primary" @click="handleNext('teachers')">
							下周<el-icon class="el-icon--right"><ArrowRight /></el-icon>
						</el-button>
					</el-col>
				</el-row>

				<el-table :data="teachersTimetable.voList" header-align="center" style="width: 100%" border>
					<el-table-column prop="groupName" label="老师" header-align="center" align="center"></el-table-column>
					<el-table-column prop="mon" header-align="center" align="center">
						<template #header>
							<div :class="{ curday: teachersTimetable.today != '' && teachersTimetable.today == teachersTimetable.monDay }">
								<div>周一</div>
								<div>{{ teachersTimetable.monDay }}</div>
							</div>
						</template>
						<template #default="scope">
							<div v-for="item in scope.row.mon" :key="item.id" class="lessonItem">
								<div>{{ item.className }}</div>
								<div>{{ item.courseName }} （{{ item.teacherName }}）</div>
								<div>{{ item.lessonBeginTime }} - {{ item.lessonEndTime }}</div>
								<div>{{ item.classroomName }}</div>
								<div>{{ item.lessonStatusLabel }}</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="tue" header-align="center" align="center">
						<template #header>
							<div :class="{ curday: teachersTimetable.today != '' && teachersTimetable.today == teachersTimetable.tueDay }">
								<div>周二</div>
								<div>{{ teachersTimetable.tueDay }}</div>
							</div>
						</template>
						<template #default="scope">
							<div v-for="item in scope.row.tue" :key="item.id" class="lessonItem">
								<div>{{ item.className }}</div>
								<div>{{ item.courseName }} （{{ item.teacherName }}）</div>
								<div>{{ item.lessonBeginTime }} - {{ item.lessonEndTime }}</div>
								<div>{{ item.classroomName }}</div>
								<div>{{ item.lessonStatusLabel }}</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="wed" header-align="center" align="center">
						<template #header>
							<div :class="{ curday: teachersTimetable.today != '' && teachersTimetable.today == teachersTimetable.wedDay }">
								<div>周三</div>
								<div>{{ teachersTimetable.wedDay }}</div>
							</div>
						</template>
						<template #default="scope">
							<div v-for="item in scope.row.wed" :key="item.id" class="lessonItem">
								<div>{{ item.className }}</div>
								<div>{{ item.courseName }} （{{ item.teacherName }}）</div>
								<div>{{ item.lessonBeginTime }} - {{ item.lessonEndTime }}</div>
								<div>{{ item.classroomName }}</div>
								<div>{{ item.lessonStatusLabel }}</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="thu" header-align="center" align="center">
						<template #header>
							<div :class="{ curday: teachersTimetable.today != '' && teachersTimetable.today == teachersTimetable.thuDay }">
								<div>周四</div>
								<div>{{ teachersTimetable.thuDay }}</div>
							</div>
						</template>
						<template #default="scope">
							<div v-for="item in scope.row.thu" :key="item.id" class="lessonItem">
								<div>{{ item.className }}</div>
								<div>{{ item.courseName }} （{{ item.teacherName }}）</div>
								<div>{{ item.lessonBeginTime }} - {{ item.lessonEndTime }}</div>
								<div>{{ item.classroomName }}</div>
								<div>{{ item.lessonStatusLabel }}</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="fri" header-align="center" align="center">
						<template #header>
							<div :class="{ curday: teachersTimetable.today != '' && teachersTimetable.today == teachersTimetable.friDay }">
								<div>周五</div>
								<div>{{ teachersTimetable.friDay }}</div>
							</div>
						</template>
						<template #default="scope">
							<div v-for="item in scope.row.fri" :key="item.id" class="lessonItem">
								<div>{{ item.className }}</div>
								<div>{{ item.courseName }} （{{ item.teacherName }}）</div>
								<div>{{ item.lessonBeginTime }} - {{ item.lessonEndTime }}</div>
								<div>{{ item.classroomName }}</div>
								<div>{{ item.lessonStatusLabel }}</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="sat" header-align="center" align="center">
						<template #header>
							<div :class="{ curday: teachersTimetable.today != '' && teachersTimetable.today == teachersTimetable.satDay }">
								<div>周六</div>
								<div>{{ teachersTimetable.satDay }}</div>
							</div>
						</template>
						<template #default="scope">
							<div v-for="item in scope.row.sat" :key="item.id" class="lessonItem">
								<div>{{ item.className }}</div>
								<div>{{ item.courseName }} （{{ item.teacherName }}）</div>
								<div>{{ item.lessonBeginTime }} - {{ item.lessonEndTime }}</div>
								<div>{{ item.classroomName }}</div>
								<div>{{ item.lessonStatusLabel }}</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="sun" header-align="center" align="center">
						<template #header>
							<div :class="{ curday: teachersTimetable.today != '' && teachersTimetable.today == teachersTimetable.sunDay }">
								<div>周日</div>
								<div>{{ teachersTimetable.sunDay }}</div>
							</div>
						</template>
						<template #default="scope">
							<div v-for="item in scope.row.sun" :key="item.id" class="lessonItem">
								<div>{{ item.className }}</div>
								<div>{{ item.courseName }} （{{ item.teacherName }}）</div>
								<div>{{ item.lessonBeginTime }} - {{ item.lessonEndTime }}</div>
								<div>{{ item.classroomName }}</div>
								<div>{{ item.lessonStatusLabel }}</div>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="教室课表" name="classrooms">
				<el-row justify="end" style="margin: 10px">
					<el-col :span="4">
						<el-button type="primary" :icon="ArrowLeft" @click="handlePre('classrooms')">上周</el-button>
						<el-button type="success" @click="handleCur('classrooms')">本周</el-button>
						<el-button type="primary" @click="handleNext('classrooms')">
							下周<el-icon class="el-icon--right"><ArrowRight /></el-icon>
						</el-button>
					</el-col>
				</el-row>

				<el-table :data="classroomsTimetable.voList" header-align="center" style="width: 100%" border>
					<el-table-column prop="groupName" label="教室" header-align="center" align="center"></el-table-column>
					<el-table-column prop="mon" header-align="center" align="center">
						<template #header>
							<div :class="{ curday: classroomsTimetable.today != '' && classroomsTimetable.today == classroomsTimetable.monDay }">
								<div>周一</div>
								<div>{{ classroomsTimetable.monDay }}</div>
							</div>
						</template>
						<template #default="scope">
							<div v-for="item in scope.row.mon" :key="item.id" class="lessonItem">
								<div>{{ item.className }}</div>
								<div>{{ item.courseName }} （{{ item.teacherName }}）</div>
								<div>{{ item.lessonBeginTime }} - {{ item.lessonEndTime }}</div>
								<div>{{ item.classroomName }}</div>
								<div>{{ item.lessonStatusLabel }}</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="tue" header-align="center" align="center">
						<template #header>
							<div :class="{ curday: classroomsTimetable.today != '' && classroomsTimetable.today == classroomsTimetable.tueDay }">
								<div>周二</div>
								<div>{{ classroomsTimetable.tueDay }}</div>
							</div>
						</template>
						<template #default="scope">
							<div v-for="item in scope.row.tue" :key="item.id" class="lessonItem">
								<div>{{ item.className }}</div>
								<div>{{ item.courseName }} （{{ item.teacherName }}）</div>
								<div>{{ item.lessonBeginTime }} - {{ item.lessonEndTime }}</div>
								<div>{{ item.classroomName }}</div>
								<div>{{ item.lessonStatusLabel }}</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="wed" header-align="center" align="center">
						<template #header>
							<div :class="{ curday: classroomsTimetable.today != '' && classroomsTimetable.today == classroomsTimetable.wedDay }">
								<div>周三</div>
								<div>{{ classroomsTimetable.wedDay }}</div>
							</div>
						</template>
						<template #default="scope">
							<div v-for="item in scope.row.wed" :key="item.id" class="lessonItem">
								<div>{{ item.className }}</div>
								<div>{{ item.courseName }} （{{ item.teacherName }}）</div>
								<div>{{ item.lessonBeginTime }} - {{ item.lessonEndTime }}</div>
								<div>{{ item.classroomName }}</div>
								<div>{{ item.lessonStatusLabel }}</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="thu" header-align="center" align="center">
						<template #header>
							<div :class="{ curday: classroomsTimetable.today != '' && classroomsTimetable.today == classroomsTimetable.thuDay }">
								<div>周四</div>
								<div>{{ classroomsTimetable.thuDay }}</div>
							</div>
						</template>
						<template #default="scope">
							<div v-for="item in scope.row.thu" :key="item.id" class="lessonItem">
								<div>{{ item.className }}</div>
								<div>{{ item.courseName }} （{{ item.teacherName }}）</div>
								<div>{{ item.lessonBeginTime }} - {{ item.lessonEndTime }}</div>
								<div>{{ item.classroomName }}</div>
								<div>{{ item.lessonStatusLabel }}</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="fri" header-align="center" align="center">
						<template #header>
							<div :class="{ curday: classroomsTimetable.today != '' && classroomsTimetable.today == classroomsTimetable.friDay }">
								<div>周五</div>
								<div>{{ classroomsTimetable.friDay }}</div>
							</div>
						</template>
						<template #default="scope">
							<div v-for="item in scope.row.fri" :key="item.id" class="lessonItem">
								<div>{{ item.className }}</div>
								<div>{{ item.courseName }} （{{ item.teacherName }}）</div>
								<div>{{ item.lessonBeginTime }} - {{ item.lessonEndTime }}</div>
								<div>{{ item.classroomName }}</div>
								<div>{{ item.lessonStatusLabel }}</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="sat" header-align="center" align="center">
						<template #header>
							<div :class="{ curday: classroomsTimetable.today != '' && classroomsTimetable.today == classroomsTimetable.satDay }">
								<div>周六</div>
								<div>{{ classroomsTimetable.satDay }}</div>
							</div>
						</template>
						<template #default="scope">
							<div v-for="item in scope.row.sat" :key="item.id" class="lessonItem">
								<div>{{ item.className }}</div>
								<div>{{ item.courseName }} （{{ item.teacherName }}）</div>
								<div>{{ item.lessonBeginTime }} - {{ item.lessonEndTime }}</div>
								<div>{{ item.classroomName }}</div>
								<div>{{ item.lessonStatusLabel }}</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="sun" header-align="center" align="center">
						<template #header>
							<div :class="{ curday: classroomsTimetable.today != '' && classroomsTimetable.today == classroomsTimetable.sunDay }">
								<div>周日</div>
								<div>{{ classroomsTimetable.sunDay }}</div>
							</div>
						</template>
						<template #default="scope">
							<div v-for="item in scope.row.sun" :key="item.id" class="lessonItem">
								<div>{{ item.className }}</div>
								<div>{{ item.courseName }} （{{ item.teacherName }}）</div>
								<div>{{ item.lessonBeginTime }} ~ {{ item.lessonEndTime }}</div>
								<div>{{ item.classroomName }}</div>
								<div>{{ item.lessonStatusLabel }}</div>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
		</el-tabs>
	</el-card>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import  { TabsPaneContext } from 'element-plus'
import { getTeachersTimetableApi, getClassroomsTimetableApi } from '@/api/train/lesson_timetable'
import { ArrowLeft, ArrowRight, Delete, Edit, Share } from '@element-plus/icons-vue'
const dataForm = ref({
	week: 0
})

const teachersTimetable = ref({
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
const classroomsTimetable = ref({
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

const activeName = ref('teachers')

onMounted(() => {
	getTeachersTimetableApi(dataForm.value).then(res => {
		teachersTimetable.value = res.data
	})
})

const handleClick = (e: any) => {
	if (e === 'teachers') {
		getTeachersTimetableApi(dataForm.value).then(res => {
			teachersTimetable.value = res.data
		})
	}
	if (e === 'classrooms') {
		getClassroomsTimetableApi(dataForm.value).then(res => {
			classroomsTimetable.value = res.data
		})
	}
}
const handlePre = (name: string) => {
	dataForm.value.week = dataForm.value.week - 1
	if (name == 'teachers') {
		getTeachersTimetableApi(dataForm.value).then(res => {
			teachersTimetable.value = res.data
		})
	} else if (name == 'classrooms') {
		getClassroomsTimetableApi(dataForm.value).then(res => {
			classroomsTimetable.value = res.data
		})
	}
}
const handleCur = (name: string) => {
	if (dataForm.value.week == 0) {
		return
	}
	dataForm.value.week = 0
	if (name == 'teachers') {
		getTeachersTimetableApi(dataForm.value).then(res => {
			teachersTimetable.value = res.data
		})
	} else if (name == 'classrooms') {
		getClassroomsTimetableApi(dataForm.value).then(res => {
			classroomsTimetable.value = res.data
		})
	}
}
const handleNext = (name: string) => {
	dataForm.value.week = dataForm.value.week + 1
	if (name == 'teachers') {
		getTeachersTimetableApi(dataForm.value).then(res => {
			teachersTimetable.value = res.data
		})
	} else if (name == 'classrooms') {
		getClassroomsTimetableApi(dataForm.value).then(res => {
			classroomsTimetable.value = res.data
		})
	}
}
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
	background-color: #f1f2ea;
	/* cursor: pointer; */
	&:hover {
		background-color: #ebeef5;
	}
}
</style>
