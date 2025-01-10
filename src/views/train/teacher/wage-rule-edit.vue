<template>
	<el-dialog v-model="visible" title="工资方案设置" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm.wageRule" label-width="100px">
			<el-form-item label="月固定工资" prop="wageRule">
				<el-input v-model="dataForm.wageRule.fixedSalary" type="number" placeholder="请输入月固定工资"> <template #append>元</template></el-input>
			</el-form-item>
			<el-row justify="end" style="margin: 10px">
				<el-button @click="handleAddCourse">选择课程</el-button>
			</el-row>
			<el-table :data="dataForm.wageRule.courseList" header-align="center" style="width: 100%" border>
				<el-table-column prop="courseCode" label="课程编码" header-align="center" align="center"> </el-table-column>
				<el-table-column prop="courseName" label="课程" header-align="center" align="center"> </el-table-column>
				<el-table-column prop="oneHourAmount" label="元/人/课时" header-align="center" align="center">
					<template #default="scope">
						<el-input v-model="scope.row.oneHourAmount" type="number" placeholder="老师课时单价"> <template #append>元</template></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="desc" label="备注" header-align="center" align="center">
					<template #default="scope">
						<el-input v-model="scope.row.desc" type="textarea" autosize placeholder="备注"></el-input>
					</template>
				</el-table-column>
                <el-table-column label="操作" width="80">
                    <template #default="scope">
                        <el-link @click="dataForm.wageRule.courseList.splice(scope.$index, 1)">删除</el-link>
                    </template>
                </el-table-column>
			</el-table>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
	<!--  课程选择 -->
	<train-data-table
		v-if="courseVisible"
		:key="courseVisible + ''"
		v-model:visible="courseVisible"
		title="课程选择"
		url="/train/course/page"
		:columns="[
			{ field: 'courseName', label: '课程名称' },
			{ field: 'courseCode', label: '课程编码' },
			{ field: 'classType', label: '关联班级类型', dictType: 'class_type' },
			{ field: 'remark', label: '备注' }
		]"
		:query-params="[
			{ field: 'courseName', label: '课程名称' },
			{ field: 'courseCode', label: '课程编码' },
			{ field: 'classType', label: '关联班级类型', dictType: 'class_type' }
		]"
		@select="onCourseSelect"
	></train-data-table>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { Search } from '@element-plus/icons-vue'
import { getWageRuleApi, updateWageRuleApi } from '@/api/train/teacher'
const visible = ref(false)
const courseVisible = ref(false)
const dataFormRef = ref()
const dataForm = reactive({
	id: 0,
	wageRule: {
		fixedSalary: 0,
		fixedList: [
			{
				code: '',
				name: '',
				value: ''
			}
		],
		courseList: [
			{
				courseCode: '',
				courseName: '',
				oneHourAmount: 0,
				desc: ''
			}
		]
	}
})
const init = (id: number) => {
	visible.value = true
	dataForm.id = id
	// 获取数据
	getWageRule(id)
}
// 获取方案
const getWageRule = (id: number) => {
	getWageRuleApi(id).then(res => {
		dataForm.wageRule = res.data
	})
}
// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		updateWageRuleApi(dataForm.id, dataForm.wageRule).then(() => {
			ElMessage.success({
				message: '操作成功',
				duration: 500,
				onClose: () => {
					visible.value = false
				}
			})
		})
	})
}
const handleAddCourse = () => {
	courseVisible.value = true
}
// 选择了课程
const onCourseSelect = (rows: any[]) => {
	let row = rows[0]
	// 判断列表中是否已存在该课程
	if (dataForm.wageRule.courseList.some((item: any) => item.courseCode == row.courseCode)) {
		ElMessage.error({
			message: '该课程已存在，请重新选择',
			duration: 1000
		})
		return
	}
	// 添加课程
	dataForm.wageRule.courseList.push({
		courseCode: row.courseCode,
		courseName: row.courseName,
		oneHourAmount: 0,
		desc: '面向学生：' + row.amountOneHour + ' 元/课时'
	})
}
defineExpose({
	init
})
</script>
