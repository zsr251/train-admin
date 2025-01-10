<template>
	<el-input v-model="classroomName" :clearable :disabled readonly :placeholder @clear="model = ''">
		<template #append>
			<el-button icon="Search" @click="visible = true"></el-button>
		</template>
	</el-input>
	<train-data-table
		v-if="!disabled && visible"
		:key="visible + ''"
		v-model:visible="visible"
		title="教室选择"
		url="/train/classroom/page"
		:multiple
		:columns="[
			{ field: 'classroomName', label: '教室名称' },
			{ field: 'classroomCode', label: '教室编码' },
			{ field: 'capacity', label: '最大人数' },
			{ field: 'address', label: '教室地址' },
			{ field: 'classroomStatus', label: '教室状态', dictType: 'classroom_status' },
			{ field: 'remark', label: '备注' }
		]"
		:query-params="[
			{ field: 'classroomName', label: '教室名称' },
			{ field: 'classroomCode', label: '教室编码' },
            { field: 'classroomStatus', label: '教室状态', dictType: 'classroom_status' },
		]"
		@select="onSelect"
	></train-data-table>
</template>

<script setup lang="ts" name="TrainTeacherInput">
import { ref, watch } from 'vue'
import { useClassroomNameListApi } from '@/api/train/classroom'

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
const classroomName = ref()

watch(
	() => model.value,
	async val => {
		if (val) {
			const classroomCodeList = props.multiple ? val : [val]
			if (classroomCodeList.length > 0) {
				const { data } = await useClassroomNameListApi(classroomCodeList)
				classroomName.value = data.join(',')
			}
		} else {
			classroomName.value = ''
		}
	},
	{
		immediate: true
	}
)

const emit = defineEmits(['select'])
const onSelect = (rows: any[]) => {
	if (props.multiple) {
		model.value = rows.map((item: any) => item.classroomCode)
	} else {
		model.value = rows[0].classroomCode
	}

	emit('select', rows)
}
</script>
