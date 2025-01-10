<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" >
			<el-row>
				<el-col :span="12">
					<el-form-item label="关联课程" prop="courseCode">
						<train-course-input v-model="dataForm.courseCode" :disabled="dataForm.id != ''" placeholder="关联课程" @select="onCourseSelect"></train-course-input>
					</el-form-item>
					<el-form-item label="班级名称" prop="className">
						<el-input v-model="dataForm.className" placeholder="班级名称"></el-input>
					</el-form-item>
					<el-form-item label="班级类型" prop="classType">
						<train-dict-select v-model="dataForm.classType" disabled dict-type="class_type" placeholder="一对一/一对多"></train-dict-select>
					</el-form-item>
					<el-form-item label="班级容量" prop="capacity">
						<el-input-number v-model="dataForm.capacity" placeholder="班级容量"></el-input-number>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="课程编码" prop="courseCode">
						<el-input v-model="dataForm.courseCode" disabled placeholder="课程编码"></el-input>
					</el-form-item>
					<el-form-item label="班级编码" prop="classCode">
						<el-input v-model="dataForm.classCode" :disabled="dataForm.id != ''" placeholder="CL01、CL11等"></el-input>
					</el-form-item>
					<el-form-item label="管理老师" prop="managerTeacher">
						<train-teacher-input v-model="dataForm.managerTeacher" :multiple="false" :clearable="true" placeholder="管理老师"></train-teacher-input>
					</el-form-item>
					<el-form-item label="班级状态" prop="classStatus">
						<train-dict-select v-model="dataForm.classStatus" dict-type="class_status" placeholder="班级状态"></train-dict-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item label="备注" prop="remark">
				<el-input v-model="dataForm.remark" type="textarea" maxlength="200" placeholder="备注"></el-input>
			</el-form-item>
			<el-row class="row-bg" justify="end">
				<el-button
					v-if="dataForm.id == ''"
					icon="Plus"
					type="primary"
					:disabled="!dataForm.courseCode || (dataForm.classType == '1' && dataForm.classStudents.length > 0)"
					@click="studentVisible = true"
					>选择已报名学员</el-button
				>
				<train-data-table
					v-if="studentVisible"
					:key="studentVisible + ''"
					v-model:visible="studentVisible"
					title="已报名学员选择"
					url="/train/course_enroll/page"
					:multiple="dataForm.classType != '1'"
					:columns="[
						{ field: 'studentName', label: '学员姓名' },
						{ field: 'phone', label: '手机号' },
						{ field: 'enrollStatus', label: '报名状态', dictType: 'course_enroll_status' },
						{ field: 'remark', label: '备注' }
					]"
					:query-params="[
						{ field: 'courseCode', label: '课程编号', hide: true, default: dataForm.courseCode },
						{ field: 'studentName', label: '学员姓名' },
						{ field: 'enrollStatus', label: '报名状态', dictType: 'course_enroll_status', default: 'normal' }
					]"
					@select="onStudentSelect"
				></train-data-table>
			</el-row>
			<el-table v-if="dataForm.id == ''" v-loading="false" :data="dataForm.classStudents" border class="layout-table">
				<el-table-column prop="studentName" label="学员姓名" header-align="center" align="center"></el-table-column>
				<el-table-column prop="phone" label="手机号" header-align="center" align="center"></el-table-column>
				<train-dict-column prop="enrollStatus" label="状态" dict-type="course_enroll_status"></train-dict-column>
				<el-table-column label="操作" fixed="right" header-align="center" align="center" width="100">
					<template #default="scope">
						<el-button v-auth="'train:class_info:delete'" type="primary" link @click="removeItem(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref,onUnmounted, onMounted } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useClass_infoApi, useClass_infoSubmitApi } from '@/api/train/class_info'
import TrainCourseInput from '@/components/train-course-input/index.vue'
import TrainTeacherInput from '@/components/train-teacher-input/index.vue'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()
const studentVisible = ref(false)

const dataForm = reactive({
	id: '',
	classCode: '',
	className: '',
	classType: '',
	capacity: 0,
	courseCode: '',
	managerTeacher: '',
	classStatus: '',
	remark: '',
	version: '',
	deleted: '',
	creator: '',
	createTime: '',
	updater: '',
	updateTime: '',
	tenantId: '',
	classStudents: [] as any[]
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''
	dataForm.classStudents = []

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getClass_info(id)
	}
}

const getClass_info = (id: number) => {
	useClass_infoApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	classCode: [{ required: true, message: '班级编码不能为空', trigger: 'blur' }],
	courseCode: [{ required: true, message: '关联课程不能为空', trigger: 'blur' }],
	className: [{ required: true, message: '班级名称不能为空', trigger: 'blur' }],
	classType: [{ required: true, message: '班级类型不能为空', trigger: 'blur' }],
	capacity: [{ required: true, message: '班级容量不能为空', trigger: 'blur'}],
	classStatus: [{ required: true, message: '班级状态不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useClass_infoSubmitApi(dataForm).then(() => {
			ElMessage.success({
				message: '操作成功',
				duration: 500,
				onClose: () => {
					visible.value = false
					emit('refreshDataList')
				}
			})
		})
	})
}

/**
 * 课程选择
 */
const onCourseSelect = (rows: any[]) => {
	dataForm.classType = rows[0].classType
	dataForm.managerTeacher = rows[0].teacherCode
	if (!dataForm.className) {
		dataForm.className = rows[0].courseName + '-'
	}
	dataForm.classStudents = []
}
/**
 * 删除列表项
 */
const removeItem = (id: number) => {
	dataForm.classStudents = dataForm.classStudents.filter((item: any) => item.id !== id)
}
/**
 * 选择已报名的客户
 */
const onStudentSelect = (rows: any[]) => {
	rows.forEach(row => {
		if (dataForm.classStudents.some(item => item.id === row.id)) {
			return
		}
		dataForm.classStudents.push(row)
	})
}

defineExpose({
	init
})
</script>
