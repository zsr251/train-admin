<template>
	<el-card header="二维码生成">
		<el-form label-position="left" label-width="100px">
			<el-form-item label="文本">
				<el-input v-model="value" />
			</el-form-item>
			<el-form-item label="大小">
				<el-slider v-model="size" :min="100" :max="500" />
			</el-form-item>
			<el-form-item label="颜色">
				<el-color-picker v-model="color" />
			</el-form-item>
			<el-form-item label="二维码" @click="downLoadQRcode()">
				<qrcode-vue :value="value" :size="size" :foreground="color" level="H" :margin="1" id="canvasDom" />
			</el-form-item>
		</el-form>
	</el-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import QrcodeVue from 'qrcode.vue'

const value = ref('https://github.com/zsr251')
const size = ref(200)
const color = ref('#000000')

const downLoadQRcode = ():void => {
    const canvas = document.getElementById('canvasDom') as HTMLCanvasElement
    const url = canvas.toDataURL("image/png") // 通过 toDataURL 返回一个包含图片展示的 data URI 
    const aDom = document.createElement("a")
    aDom.download = 'qrcode.png'// 设置下载的文件名
    aDom.href = url
    document.body.appendChild(aDom)
    aDom.click()
    aDom.remove()
}


</script>
