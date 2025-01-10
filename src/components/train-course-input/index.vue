<template>
	<el-input v-model="courseName" :clearable :disabled readonly :placeholder @clear="model = ''">
		<template #append>
			<el-button icon="Search" @click="visible = true"></el-button>
		</template>
	</el-input>
	<train-data-table
		v-if="!disabled && visible"
		:key="visible + ''"
		v-model:visible="visible"
		title="课程选择"
		url="/train/course/page"
		:multiple
		:columns="[
			{ field: 'courseName', label: '课程名称' },
			{ field: 'courseCode', label: '课程编码' },
			{ field: 'classType', label: '关联班级类型', dictType: 'class_type' },
			{ field: 'remark', label: '备注' }
		]"
		:query-params="[
			{ field: 'courseName', label: '课程名称' },
			{ field: 'courseCode', label: '课程编码' },
            { field: 'classType', label: '关联班级类型', dictType: 'class_type' },
		]"
		@select="onSelect"
	></train-data-table>
</template>

<script setup lang="ts" name="TrainTeacherInput">
import { ref, watch } from 'vue'
import { useCourseNameListApi } from '@/api/train/course'

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
const courseName = ref()

watch(
	() => model.value,
	async val => {
		if (val) {
			const courseCodeList = props.multiple ? val : [val]
			if (courseCodeList.length > 0) {
				const { data } = await useCourseNameListApi(courseCodeList)
				courseName.value = data.join(',')
			}
		} else {
			courseName.value = ''
		}
	},
	{
		immediate: true
	}
)

const emit = defineEmits(['select'])
const onSelect = (rows: any[]) => {
	if (props.multiple) {
		model.value = rows.map((item: any) => item.courseCode)
	} else {
		model.value = rows[0].courseCode
	}

	emit('select', rows)
}
</script>
