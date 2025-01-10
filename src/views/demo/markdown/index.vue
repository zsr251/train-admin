<template>
	<div>
		<train-markdown v-model="editorValue" height="500px"></train-markdown>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const editorValue = ref('123')
</script>
