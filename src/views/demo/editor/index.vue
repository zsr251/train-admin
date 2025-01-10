<template>
	<div>
		<train-editor v-model="editorValue" placeholder="请输入..."></train-editor>
	</div>
</template>

<script lang="ts" setup name="DemoEditorIndex">
import { ref } from 'vue'

const editorValue = ref('<p>train</p>')
</script>
