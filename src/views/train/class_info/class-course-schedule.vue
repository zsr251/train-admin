<template>
	<el-dialog v-model="visible" title="排课" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" v-loading="loading">
			<el-row>
				<el-col :span="12">
					<el-form-item label="班级" prop="classCode">
						<train-class-input v-model="dataForm.classCode" disabled placeholder="请选择课程" />
					</el-form-item>
					<el-form-item label="任课老师" prop="teacherCode">
						<train-teacher-input v-model="dataForm.teacherCode" clearable placeholder="请选择老师" />
					</el-form-item>
					<el-form-item label="计划课时" prop="planHours">
						<el-input-number v-model="dataForm.planHours" placeholder="计划课时"></el-input-number>
					</el-form-item>
					<el-form-item label="已授课时" prop="completedHours">
						<el-text class="mx-1" type="primary">{{ dataForm.completedHours }}</el-text>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="课程" prop="courseCode">
						<train-course-input v-model="dataForm.courseCode" disabled placeholder="关联课程" />
					</el-form-item>
					<el-form-item label="上课教室" prop="classroomCode">
						<train-classroom-input v-model="dataForm.classroomCode" clearable placeholder="请选择教室" />
					</el-form-item>
					<el-form-item label="每次课时数" prop="courseHourOnce">
						<el-input-number v-model="dataForm.courseHourOnce" placeholder="每次课时数"></el-input-number>
					</el-form-item>
					<el-form-item label="已排课时" prop="scheduleHours">
						<el-text class="mx-1" type="primary">{{ dataForm.scheduleHours }}</el-text>
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item label="备注" prop="remark">
				<el-input v-model="dataForm.remark" type="textarea" maxlength="200" placeholder="备注"></el-input>
			</el-form-item>
			<el-tabs v-model="dataForm.scheduleRuleVO.scheduleType" type="border-card" @tab-click="handleScheduleTypeClick">
				<el-tab-pane label="固定频率" name="frequency">
					<el-row>
						<el-col :span="12">
							<el-form-item label="频率">
								<train-dict-radio v-model="dataForm.scheduleRuleVO.frequencyType" dict-type="frequency_type"></train-dict-radio>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item
								v-if="dataForm.scheduleRuleVO.frequencyType == 'weekly' || dataForm.scheduleRuleVO.frequencyType == 'monthly'"
								label="指定"
							>
								<el-select
									v-if="dataForm.scheduleRuleVO.frequencyType == 'weekly'"
									clearable
									v-model="dataForm.scheduleRuleVO.frequencyAppoint"
									multiple
									placeholder="选择周几"
									style="width: 260px"
								>
									<el-option v-for="item in weeklyOptions" :key="item.value" :label="item.label" :value="item.value" />
								</el-select>
								<el-select
									v-if="dataForm.scheduleRuleVO.frequencyType == 'monthly'"
									clearable
									v-model="dataForm.scheduleRuleVO.frequencyAppoint"
									multiple
									placeholder="选择几号"
									style="width: 260px"
								>
									<el-option v-for="item in monthOptions" :key="item.value" :label="item.label" :value="item.value" />
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="开始日期" prop="beginDate">
								<el-date-picker v-model="dataForm.scheduleRuleVO.beginDate" type="date" value-format="YYYY-MM-DD" placeholder="开始日期" />
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="截止日期" prop="endDate">
								<el-date-picker v-model="dataForm.scheduleRuleVO.endDate" type="date" value-format="YYYY-MM-DD" placeholder="截止日期" />
							</el-form-item>
						</el-col>
						<el-col>
							<el-form-item label="每次上课时间" prop="timeSection">
								<div>
									<div class="flex">
										<el-time-select
											v-model="startTimeSection"
											style="width: 100px"
											:max-time="endTimeSection"
											class="mr-5"
											placeholder="上课"
											start="08:00"
											:step="timeStep"
											end="22:00"
										/>
										<el-time-select
											v-model="endTimeSection"
											style="width: 100px"
											:min-time="startTimeSection"
											class="mr-8"
											placeholder="下课"
											start="08:00"
											:step="timeStep"
											end="22:00"
										/>
										<el-button icon="Plus" class="mr-8" type="primary" size="small" circle @click="addTimeSection"></el-button>
										<div>可选时间间隔：</div><el-time-select
											v-model="timeStep"
											prefix-icon="Setting"
											style="width: 100px"
											class="mr-8"
											placeholder="下课"
											start="00:05"
											step="00:05"
											end="01:00"
										/>
									</div>
									<div class="flex gap-2 m-t">
										<el-tag type="primary" closable v-for="(item, index) in dataForm.scheduleRuleVO.timeSection" @close="removeTimeSection(item)">{{
											item
										}}</el-tag>
									</div>
								</div>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col>
							<el-form-item label="排除日期">
								<div>
									<div class="flex">
										<el-date-picker v-model="excludeDay" type="date" value-format="YYYY-MM-DD" placeholder="开始日期" />
										<el-button icon="Plus" type="primary" size="small" circle @click="addExcludeDay" class="ml-8 mr-8"></el-button>
										<train-dict-radio v-model="dataForm.scheduleRuleVO.excludeType" dict-type="schedule_day_exclude_type"></train-dict-radio>
									</div>
									<div class="flex gap-2 m-t">
										<el-tag type="primary" closable v-for="(item, index) in dataForm.scheduleRuleVO.excludeDays" @close="removeExcludeDay(item)">{{
											item
										}}</el-tag>
									</div>
								</div>
							</el-form-item>
						</el-col>
					</el-row>
				</el-tab-pane>
				<el-tab-pane label="指定日期" name="appoint">
					<el-row>
						<el-col>
							<el-form-item label="每次上课时间" prop="timeSection">
								<div>
									<div class="flex">
										<el-time-select
											v-model="startTimeSection"
											style="width: 100px"
											:max-time="endTimeSection"
											class="mr-5"
											placeholder="上课"
											start="08:00"
											:step=timeStep
											end="22:00"
										/>
										<el-time-select
											v-model="endTimeSection"
											style="width: 100px"
											:min-time="startTimeSection"
											class="mr-8"
											placeholder="下课"
											start="08:00"
											:step=timeStep
											end="22:00"
										/>
										<el-button icon="Plus" class="mr-8" type="primary" size="small" circle @click="addTimeSection"></el-button>
										<div>可选时间间隔：</div><el-time-select
											v-model="timeStep"
											prefix-icon="Setting"
											style="width: 100px"
											class="mr-8"
											placeholder="下课"
											start="00:05"
											step="00:05"
											end="01:00"
										/>
									</div>
									<div class="flex gap-2 m-t">
										<el-tag type="primary" closable v-for="(item, index) in dataForm.scheduleRuleVO.timeSection" @close="removeTimeSection(item)">{{
											item
										}}</el-tag>
									</div>
								</div>
							</el-form-item>
						</el-col>
						<el-col>
							<el-form-item label="指定日期">
								<div>
									<div class="flex">
										<el-date-picker v-model="excludeDay" type="date" value-format="YYYY-MM-DD" placeholder="上课日期" />
										<el-button icon="Plus" type="primary" size="small" circle @click="addAppointDay" class="ml-8 mr-8"></el-button>
									</div>
									<div class="flex gap-2 m-t">
										<el-tag type="primary" closable v-for="(item, index) in dataForm.scheduleRuleVO.appointDays" @close="removeAppointDay(item)">{{
											item
										}}</el-tag>
									</div>
								</div>
							</el-form-item>
						</el-col>
					</el-row>
				</el-tab-pane>
			</el-tabs>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" :disabled="loading" @click="keepIn">暂存</el-button>
			<el-button type="success" :disabled="loading" @click="doScheduleCourse">开始排课</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useClass_courseApi, useClass_courseSubmitApi, scheduleCourseApi } from '@/api/train/class_course'
import TrainCourseInput from '@/components/train-course-input/index.vue'
import TrainClassInput from '@/components/train-class-input/index.vue'
import TrainTeacherInput from '@/components/train-teacher-input/index.vue'
import TrainClassroomInput from '@/components/train-classroom-input/index.vue'
import type { TabsPaneContext } from 'element-plus'
import { Setting, ArrowRight, Delete, Edit, Share } from '@element-plus/icons-vue'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()
const loading = ref(false)

const startTimeSection = ref('')
const timeStep = ref('00:15')
const endTimeSection = ref('')
const excludeDay = ref('')

const dataForm = reactive({
	id: -1,
	classCode: '',
	courseCode: '',
	teacherCode: '',
	classroomCode: '',
	planHours: 0,
	courseHourOnce: 0,
	scheduleHours: 0,
	completedHours: 0,
	remark: '',
	scheduleStatus: '',
	version: null,
	scheduleRuleVO: {
		scheduleType: 'frequency',
		timeSection: [] as string[],
		beginDate: '',
		endDate: '',
		frequencyType: 'daily',
		frequencyAppoint: [] as string[],
		excludeType: 'appoint',
		excludeDays: [] as string[],
		appointDays: [] as string[]
	}
})

const weeklyOptions = [
	{ value: '1', label: '星期一' },
	{ value: '2', label: '星期二' },
	{ value: '3', label: '星期三' },
	{ value: '4', label: '星期四' },
	{ value: '5', label: '星期五' },
	{ value: '6', label: '星期六' },
	{ value: '7', label: '星期日' }
]
const monthOptions = [
	{ value: '1', label: '1号' },
	{ value: '2', label: '2号' },
	{ value: '3', label: '3号' },
	{ value: '4', label: '4号' },
	{ value: '5', label: '5号' },
	{ value: '6', label: '6号' },
	{ value: '7', label: '7号' },
	{ value: '8', label: '8号' },
	{ value: '9', label: '9号' },
	{ value: '10', label: '10号' },
	{ value: '11', label: '11号' },
	{ value: '12', label: '12号' },
	{ value: '13', label: '13号' },
	{ value: '14', label: '14号' },
	{ value: '15', label: '15号' },
	{ value: '16', label: '16号' },
	{ value: '17', label: '17号' },
	{ value: '18', label: '18号' },
	{ value: '19', label: '19号' },
	{ value: '20', label: '20号' },
	{ value: '21', label: '21号' },
	{ value: '22', label: '22号' },
	{ value: '23', label: '23号' },
	{ value: '24', label: '24号' },
	{ value: '25', label: '25号' },
	{ value: '26', label: '26号' },
	{ value: '27', label: '27号' },
	{ value: '28', label: '28号' },
	{ value: '29', label: '29号' },
	{ value: '30', label: '30号' },
	{ value: '31', label: '31号' }
]
const init = (id: number) => {
	visible.value = true
	dataForm.id = id
	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}
	getClassCourse(id)
}
/**
 * 获取班级课程详情
 */
const getClassCourse = (id: number) => {
	useClass_courseApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}
/**
 * 增加上课时间片段
 */
const addTimeSection = () => {
	if (startTimeSection.value == '' || endTimeSection.value == '') {
		ElMessage.error('请选择时间片段')
		return
	}
	var s = startTimeSection.value + '-' + endTimeSection.value
	// 判断是否存在
	if (dataForm.scheduleRuleVO.timeSection.indexOf(s) != -1) {
		ElMessage.error('已存在')
		return
	}
	dataForm.scheduleRuleVO.timeSection.push(s)
	startTimeSection.value = ''
	endTimeSection.value = ''
}
/**
 * 删除上课时间片段
 */
const removeTimeSection = (item: string) => {
	dataForm.scheduleRuleVO.timeSection.splice(dataForm.scheduleRuleVO.timeSection.indexOf(item), 1)
}
/**
 * 增加排除日期
 */
const addExcludeDay = () => {
	if (excludeDay.value == '') {
		ElMessage.error('请选择排除日期')
		return
	}
	// 判断是否存在
	if (dataForm.scheduleRuleVO.excludeDays.indexOf(excludeDay.value) != -1) {
		ElMessage.error('已存在')
		return
	}
	dataForm.scheduleRuleVO.excludeDays.push(excludeDay.value)
	excludeDay.value = ''
}
/**
 * 删除排除日期
 */
const removeExcludeDay = (item: string) => {
	dataForm.scheduleRuleVO.excludeDays.splice(dataForm.scheduleRuleVO.excludeDays.indexOf(item), 1)
}
/**
 * 增加指定上课日期
 */
const addAppointDay = () => {
	if (excludeDay.value == '') {
		ElMessage.error('请选择指定日期')
		return
	}
	// 判断是否存在
	if (dataForm.scheduleRuleVO.appointDays.indexOf(excludeDay.value) != -1) {
		ElMessage.error('已存在')
		return
	}
	dataForm.scheduleRuleVO.appointDays.push(excludeDay.value)
	excludeDay.value = ''
}
/**
 * 删除指定上课日期
 */
const removeAppointDay = (item: string) => {
	dataForm.scheduleRuleVO.appointDays.splice(dataForm.scheduleRuleVO.appointDays.indexOf(item), 1)
}
const handleScheduleTypeClick = (tab: TabsPaneContext, event: Event) => {
	console.log(tab, event)
}

const dataRules = ref({
    planHours: [
        { required: true, message: '请输入计划课时数', trigger: 'blur' }
    ],
    courseHourOnce: [
        { required: true, message: '请输入每次上课课时数', trigger: 'blur' }
    ],
    teacherCode: [
        { required: true, message: '请选择老师', trigger: 'blur' }
    ],

})
/**
 * 暂存
 */
const keepIn = () => {
	dataForm.version = null
	loading.value = true
	useClass_courseSubmitApi(dataForm)
		.then(() => {
			ElMessage.success({
				message: '暂存成功',
				duration: 500
			})
			loading.value = false
		})
		.catch(err => {
			loading.value = false
		})
}
/**
 * 进行排课
 */
const doScheduleCourse = () => {
	dataForm.version = null
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		loading.value = true
		scheduleCourseApi(dataForm)
			.then(() => {
				ElMessage.success({
					message: '排课完成',
					duration: 500,
					onClose: () => {
						visible.value = false
						loading.value = false
						emit('refreshDataList')
					}
				})
			})
			.catch(err => {
				loading.value = false
			})
	})
}
defineExpose({
	init
})
</script>
<style lang="css" scoped>
.flex {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
}
.ml-8 {
	margin-left: 2rem; /* 32px */
}
.mr-5 {
	margin-right: 1.25rem;
}
.mr-8 {
	margin-right: 2rem;
}
.gap-2 {
	gap: 0.5rem;
}
.m-t {
	margin-top: 0.5rem;
}
</style>
