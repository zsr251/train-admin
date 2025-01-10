<template>
	<el-input v-model="studentName" :clearable :disabled readonly :placeholder @clear="model = ''">
		<template #append>
			<el-button icon="Search" @click="visible = true"></el-button>
		</template>
	</el-input>
	<train-data-table
		v-if="!disabled && visible"
		:key="visible + ''"
		v-model:visible="visible"
		title="学员选择"
		url='/train/student/page'
		:multiple
		:columns="[
			{ field: 'studentName', label: '学员姓名' },
			{ field: 'studentTypeLabel', label: '学员类型' },
			{ field: 'phone', label: '手机号' },
			{ field: 'remark', label: '备注' }
		]"
		:query-params="[{ field: 'studentName', label: '学员姓名' },{ field: 'phone', label: '手机号' }]"
		@select="onSelect"
	></train-data-table>
</template>

<script setup lang="ts" name="TrainTeacherInput">
import { ref, watch } from 'vue'
import { useStudentNameListApi } from '@/api/train/student'

const props = defineProps({
	multiple: {
		type: Boolean,
		required: false,
		default: false
	},
	clearable: {
		type: Boolean,
		required: false,
		default: () => true
	},
	disabled: {
		type: Boolean,
		required: false,
		default: () => false
	},
	placeholder: {
		type: String,
		required: false,
		default: () => ''
	}
})

const model = defineModel<any | any[]>()
const visible = ref(false)
const studentName = ref()

watch(
	() => model.value,
	async val => {
		if (val) {
			const teacherCodeList = props.multiple ? val : [val]
			if (teacherCodeList.length > 0) {
				const { data } = await useStudentNameListApi(teacherCodeList)
				studentName.value = data.join(',')
			}
		} else {
			studentName.value = ''
		}
	},
	{
		immediate: true
	}
)

const emit = defineEmits(['select'])
const onSelect = (rows: any[]) => {
	if (props.multiple) {
		model.value = rows.map((item: any) => item.id)
	} else {
		model.value = rows[0].id
	}

	emit('select', rows)
}
</script>
