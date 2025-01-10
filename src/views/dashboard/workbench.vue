<template>
	<el-card>
		<el-row :gutter="20" justify="space-between">
			<el-col :span="15">
				<div style="display: flex; flex-direction: row">
					<el-avatar :size="60" :src="userStore.user.avatar" />
					<div style="display: flex; flex-direction: column; margin-left: 20px; line-height: 28px">
						<h1>早安，{{ userStore.user.realName }}，祝你开心每一天!</h1>
						<div></div>
					</div>
				</div>
			</el-col>
			<el-col :span="3">
				<el-statistic title="学员数" :value="outputValue" />
			</el-col>
			<el-col :span="3">
				<el-statistic title="课消数" :value="666666" />
			</el-col>
			<el-col :span="3">
				<el-statistic :value="6">
					<template #title>
						<div style="display: inline-flex; align-items: center">待办</div>
					</template>
				</el-statistic>
			</el-col>
		</el-row>
	</el-card>
	<br />
	<el-row :gutter="20" justify="space-between">
		<el-col :span="12" justify="space-between">
			<el-card style="width: 100%">
				<template #header>
					<div class="card-header">
						<span>学员统计</span>
					</div>
				</template>
				<div>
					<div ref="stuStat" style="width: 100%; height: 400px"></div>
				</div>
			</el-card>
		</el-col>
		<el-col :span="12" justify="space-between">
			<el-card style="width: 100%">
				<template #header>
					<div class="card-header">
						<span>老师统计</span>
					</div>
				</template>
				<div>
					<div ref="teaStat" style="width: 100%; height: 400px"></div>
				</div>
			</el-card>
		</el-col>
	</el-row>
	<br />
	<el-space fill wrap :fill-ratio="28" style="width: 100%">
		<el-card style="width: 100%">
			<template #header>
				<div class="card-header">
					<span>课消统计</span>
				</div>
			</template>
			<div style="height: 220px; display: flex; justify-content: center">
				<div ref="lessonStat" style="width: 100%; height: 220px"></div>
			</div>
		</el-card>
	</el-space>

	<br />
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/modules/user'
import { useTransition } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

const userStore = useUserStore()

const source = ref(0)
const outputValue = useTransition(source, {
	duration: 1500
})
source.value = 888888

onMounted(() => {
	init()
})

const stuStat = ref()
const teaStat = ref()
const lessonStat = ref()

const init = () => {
	setStuStat()
	setTeaStat()
	setLessonStat()
}
//学员统计
const setStuStat = () => {
	const myChart = echarts.init(stuStat.value)
	myChart.setOption({
		title: {
			text: '',
			subtext: '',
			left: 'center'
		},
		tooltip: {
			trigger: 'item'
		},
		legend: {
			orient: 'vertical',
			left: 'left'
		},
		series: [
			{
				name: '学员类型',
				type: 'pie',
				radius: '50%',
				data: [
					{ value: 1048, name: '潜在学员' },
					{ value: 735, name: '在读学员' },
					{ value: 580, name: '历史学员' }
				],
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			}
		]
	})
}
// 老师统计
const setTeaStat = () => {
	const myChart = echarts.init(teaStat.value)
	myChart.setOption({
		tooltip: {
			trigger: 'item'
		},
		legend: {
			top: '5%',
			left: 'center'
		},
		series: [
			{
				name: 'Access From',
				type: 'pie',
				radius: ['40%', '70%'],
				center: ['50%', '70%'],
				// adjust the start and end angle
				startAngle: 180,
				endAngle: 360,
				data: [
					{ value: 1048, name: 'Search Engine' },
					{ value: 735, name: 'Direct' },
					{ value: 580, name: 'Email' },
					{ value: 484, name: 'Union Ads' },
					{ value: 300, name: 'Video Ads' }
				]
			}
		]
	})
}
// 课消统计
const setLessonStat = () => {
	let option
	const myChart = echarts.init(lessonStat.value)
	const series = [
		{
			data: [120, 200, 150, 80, 70, 110, 130, 150, 80, 70, 110, 130],
			type: 'bar',
			stack: 'a',
			name: 'a'
		},
		{
			data: [10, 46, 64, '-', 0, '-', 0, 150, 80, 70, 110, 130],
			type: 'bar',
			stack: 'a',
			name: 'b'
		},
		{
			data: [30, '-', 0, 20, 10, '-', 0, 150, 80, 70, 110, 130],
			type: 'bar',
			stack: 'a',
			name: 'c'
		},
		{
			data: [30, '-', 0, 20, 10, '-', 0, 150, 80, 70, 110, 130],
			type: 'bar',
			stack: 'b',
			name: 'd'
		},
		{
			data: [10, 20, 150, 0, '-', 50, 10, 150, 80, 70, 110, 130],
			type: 'bar',
			stack: 'b',
			name: 'e'
		}
	]
	const stackInfo = {} as any
	for (let i = 0; i < series[0].data.length; ++i) {
		for (let j = 0; j < series.length; ++j) {
			const stackName = series[j].stack
			if (!stackName) {
				continue
			}
			if (!stackInfo[stackName]) {
				stackInfo[stackName] = {
					stackStart: [],
					stackEnd: []
				}
			}
			const info = stackInfo[stackName]
			const data = series[j].data[i]
			if (data && data !== '-') {
				if (info.stackStart[i] == null) {
					info.stackStart[i] = j
				}
				info.stackEnd[i] = j
			}
		}
	}
	for (let i = 0; i < series.length; ++i) {
		const data = series[i].data as any
		const info = stackInfo[series[i].stack]
		for (let j = 0; j < series[i].data.length; ++j) {
			const isEnd = info.stackEnd[j] === i
			const topBorder = isEnd ? 20 : 0
			const bottomBorder = 0
			data[j] = {
				value: data[j],
				itemStyle: {
					borderRadius: [topBorder, topBorder, bottomBorder, bottomBorder]
				}
			}
		}
	}
	option = {
		xAxis: {
			type: 'category',
			data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
		},
		yAxis: {
			type: 'value'
		},
		series: series
	}

	option && myChart.setOption(option)
	myChart.resize()
}
</script>
