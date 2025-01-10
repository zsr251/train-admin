<template>
	<el-dialog v-model="visible" title="学员二维码" :close-on-click-modal="false" >
		<view style="display: flex; flex-direction: column; justify-content: space-between;align-items: center; height: 400px">
			<view>
				<qrcode-vue :value="url" :size="300" foreground="#000000" level="M" :margin="1" id="canvasDom" />
			</view>
            <view>
                <span style="font-size: 14px; padding: 10px;">{{ url }}</span>
			</view>
			<view>
				<el-button @click="visible = false">关闭</el-button>
				<el-button type="primary" @click="downLoadQRcode()">下载</el-button>
				<el-button type="danger" @click="refreshUrl()">重新生成</el-button>
			</view>
		</view>
	</el-dialog>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus/es'
import QrcodeVue from 'qrcode.vue'
import { getUrlApi, refreshUrlApi } from '@/api/train/student'
import { useClipboard, useDark } from '@vueuse/core'
const visible = ref(false)
const studentId = ref(0)
const url = ref('')

const init = (id: number) => {
	visible.value = true
	studentId.value = id
	getUrlApi(id).then(res => {
		url.value = res.data
	})
}

// 刷新url 会造成之前链接失效
const refreshUrl = () => {
	ElMessageBox.confirm('重新生会使之前的链接失效！确认重新生成吗?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	})
		.then(() => {
			refreshUrlApi(studentId.value).then(res => {
				url.value = res.data
                ElMessage.success('刷新成功')
			})
		})
		.catch(() => {})
}
// 下载二维码
const downLoadQRcode = (): void => {
	const canvas = document.getElementById('canvasDom') as HTMLCanvasElement
	const url = canvas.toDataURL('image/png') // 通过 toDataURL 返回一个包含图片展示的 data URI
	const aDom = document.createElement('a')
	aDom.download = 'qrcode.png' // 设置下载的文件名
	aDom.href = url
	document.body.appendChild(aDom)
	aDom.click()
	aDom.remove()
}
defineExpose({
	init
})
</script>
<style scoped></style>
