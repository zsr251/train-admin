<template>
	<el-table :data="studentList" border style="width: 100%">
		<el-table-column prop="studentName" label="学员姓名" header-align="center" align="center"></el-table-column>
		<el-table-column prop="memberTypeLabel" label="成员类型" header-align="center" align="center"></el-table-column>
		<train-dict-column prop="arrivalStatus" label="到课状态" dict-type="lesson_arrival_status"></train-dict-column>
	</el-table>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { ElMessage, ElMessageBox } from 'element-plus'
import { lessonStudentsApi } from '@/api/train/lesson_student'

const studentList = ref([])
const dataForm = reactive({
	courseCode: '',
	id: -1,
	enrollStatus: ''
})

const init = (id: number) => {
	getLessonStudents(id)
}

const getLessonStudents = (id: number) => {
	lessonStudentsApi({
		lessonId: id
	}).then((res: any) => {
		studentList.value = res.data
	})
}
defineExpose({
	init
})
</script>
