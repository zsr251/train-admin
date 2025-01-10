<template>
	<el-input v-model="className" :clearable :disabled readonly :placeholder @clear="model = ''">
		<template #append>
			<el-button icon="Search" @click="visible = true"></el-button>
		</template>
	</el-input>
	<train-data-table
		v-if="!disabled && visible"
		:key="visible + ''"
		v-model:visible="visible"
		title="班级选择"
		url="/train/class_info/page"
		:multiple
		:columns="[
			{ field: 'className', label: '班级名称' },
			{ field: 'classCode', label: '班级编码' },
			{ field: 'classType', label: '班级类型', dictType: 'class_type' },
			{ field: 'classStatus', label: '班级状态', dictType: 'class_status' },
			{ field: 'remark', label: '备注' }
		]"
		:query-params="[
			{ field: 'className', label: '班级名称' },
			{ field: 'classCode', label: '班级编码' },
            { field: 'classStatus', label: '班级状态', dictType: 'class_status' },
		]"
		@select="onSelect"
	></train-data-table>
</template>

<script setup lang="ts" name="TrainTeacherInput">
import { ref, watch } from 'vue'
import { useClassInfoNameListApi } from '@/api/train/class_info'

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
const className = ref()

watch(
	() => model.value,
	async val => {
		if (val) {
			const classCodeList = props.multiple ? val : [val]
			if (classCodeList.length > 0) {
				const { data } = await useClassInfoNameListApi(classCodeList)
				className.value = data.join(',')
			}
		} else {
			className.value = ''
		}
	},
	{
		immediate: true
	}
)

const emit = defineEmits(['select'])
const onSelect = (rows: any[]) => {
	if (props.multiple) {
		model.value = rows.map((item: any) => item.classCode)
	} else {
		model.value = rows[0].classCode
	}

	emit('select', rows)
}
</script>
