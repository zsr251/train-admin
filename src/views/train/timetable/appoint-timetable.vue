<template>
    <el-dialog v-model="visible" title="课表" :close-on-click-modal="true" width="98%" @open="handleTimetableOpen">
        <train-timetable ref="timetableRef" :button-visible="props.namedVisible || props.auditionVisible || props.reassignVisible || props.cancelVisible || props.leaveVisible" 
		:named-visible="props.namedVisible" :audition-visible="props.auditionVisible" :reassign-visible="props.reassignVisible" :cancel-visible="props.cancelVisible" :leave-visible="props.leaveVisible"
        @select="handleSelect"></train-timetable>
    </el-dialog>
</template>
<script lang="ts" setup>
import { reactive, ref,onMounted } from 'vue'
import TrainTimetable from '@/components/train-timetable/index.vue'

const props = defineProps({

	namedVisible: {
		type: Boolean,
		default: false
	},
	auditionVisible: {
		type: Boolean,
		default: false
	},
	reassignVisible: {
		type: Boolean,
		default: false
	},
	cancelVisible: {
		type: Boolean,
		default: false
	},
	leaveVisible: {
		type: Boolean,
		default: false
	},
})

const visible = ref(false)
const timetableRef = ref()
let curDataForm = {}
const init = (dataForm: any) => {
    visible.value = true
    curDataForm = dataForm
}
const handleTimetableOpen = () => {
	timetableRef.value.init(curDataForm)
}

const emit = defineEmits(['select'])
/**
 * 点击列表项
 */
 const handleSelect = (item: any) => {
    emit('select', item)
}
defineExpose({
	init
})
</script>
<style scoped>
</style>