<template>
	<el-input v-model="teacherName" :clearable :disabled readonly :placeholder @clear="model = ''">
		<template #append>
			<el-button icon="Search" @click="visible = true"></el-button>
		</template>
	</el-input>
	<train-data-table
		v-if="!disabled && visible"
		:key="visible + ''"
		v-model:visible="visible"
		title="老师选择"
		url='/train/teacher/page'
		:multiple
		:columns="[
			{ field: 'teacherName', label: '老师名称' },
			{ field: 'teacherCode', label: '老师编码' },
			{ field: 'remark', label: '备注' }
		]"
		:query-params="[{ field: 'teacherName', label: '老师名称' }]"
		@select="onSelect"
	></train-data-table>
</template>

<script setup lang="ts" name="TrainTeacherInput">
import { ref, watch } from 'vue'
import { useTeacherNameListApi } from '@/api/train/teacher'

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
const teacherName = ref()

watch(
	() => model.value,
	async val => {
		if (val) {
			const teacherCodeList = props.multiple ? val : [val]
			if (teacherCodeList.length > 0) {
				const { data } = await useTeacherNameListApi(teacherCodeList)
				teacherName.value = data.join(',')
			}
		} else {
			teacherName.value = ''
		}
	},
	{
		immediate: true
	}
)

const emit = defineEmits(['select'])
const onSelect = (rows: any[]) => {
	if (props.multiple) {
		model.value = rows.map((item: any) => item.teacherCode)
	} else {
		model.value = rows[0].teacherCode
	}

	emit('select', rows)
}
</script>
