<template>
	<train-data-table
		:key="visible + ''"
		v-model:visible="visible"
		title="用户选择"
		url="/sys/user/page"
		:multiple
		:columns="[
			{ field: 'id', label: '用户ID' },
			{ field: 'username', label: '用户名' },
			{ field: 'realName', label: '姓名' },
			{ field: 'mobile', label: '手机号' },
			{ field: 'createTime', label: '创建时间' }
		]"
		:query-params="[
			{ field: 'username', label: '用户名' },
			{ field: 'mobile', label: '手机号' }
		]"
		@select="onSelect"
	></train-data-table>
</template>

<script setup lang="ts" name="TrainUserDialog">
defineProps({
	multiple: {
		type: Boolean,
		required: false,
		default: false
	}
})

const visible = defineModel<boolean>()

const emit = defineEmits(['select'])
const onSelect = (rows: any[]) => {
	emit('select', rows)
}
</script>
