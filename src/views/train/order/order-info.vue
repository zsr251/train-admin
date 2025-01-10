<template>
	<el-dialog v-model="visible" title="订单" :close-on-click-modal="false">
		<el-row class="row-bg" justify="center">
			<el-col :span="14">
				<el-steps :active="step" finish-status="success" align-center>
					<el-step title="创建" />
					<el-step title="查看" />
				</el-steps>
			</el-col>
		</el-row>
		<el-divider />
		<div v-if="step === 0">
			<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
				<el-row>
					<el-col :span="12">
						<el-form-item label="学员" prop="studentId">
							<train-student-input v-model="dataForm.studentId" clearable placeholder="选择学员"></train-student-input>
						</el-form-item>
						<el-form-item label="订单金额" prop="totalPrice">
							<el-text size="large">{{ totalPriceComputed }} 元</el-text>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="应付金额" prop="shouldPay">
							<el-tag type="success" size="large">{{ totalPriceComputed - dataForm.discount }} 元</el-tag>
						</el-form-item>
						<el-form-item label="减免金额" prop="discount">
							<el-input v-model="dataForm.discount" type="number" placeholder="减免金额" clearable><template #append>元</template></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="减免原因" prop="discountReason">
							<el-input v-model="dataForm.discountReason" type="textarea" placeholder="请填写金额减免的原因"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="备注" prop="remark">
							<el-input v-model="dataForm.remark" type="textarea" placeholder="订单备注"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<el-row justify="space-between" align="bottom" style="margin: 10px">
				<el-text type="primary">{{ totalPriceComputed }}元</el-text>
				<el-button type="primary" :icon="Plus" @click="handleAddCourse">添加课程</el-button>
			</el-row>
			<el-table :data="dataForm.courseList" v-loading="loading" header-align="center" style="width: 100%" border>
				<el-table-column prop="courseName" label="课程" header-align="center" align="center"> </el-table-column>
				<el-table-column prop="courseHourTotal" label="总课时" header-align="center" align="center" width="80"> </el-table-column>
				<el-table-column prop="amountOneHour" label="课时单价" header-align="center" align="center" width="85">
					<template #default="scope">
						<el-text>{{ scope.row.amountOneHour }}元</el-text>
					</template>
				</el-table-column>
				<el-table-column prop="buyHours" label="购买时数" header-align="center" align="center" width="180">
					<template #default="scope">
						<el-input-number v-model="scope.row.buyHours" type="number" placeholder="购买时数" min="1" clearable></el-input-number>
					</template>
				</el-table-column>
				<el-table-column prop="totalPrice" label="应付金额" header-align="center" align="center">
					<template #default="scope">
						<el-text>{{ scope.row.amountOneHour * scope.row.buyHours }}元</el-text>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="60">
                    <template #default="scope">
                        <el-link @click="dataForm.courseList.splice(scope.$index, 1)">删除</el-link>
                    </template>
                </el-table-column>
			</el-table>
		</div>
		<div v-if="step === 1">
			<el-descriptions title="" :column="2" border>
				<el-descriptions-item label="学员">{{ dataForm.studentName }}</el-descriptions-item>
				<el-descriptions-item label="订单状态"
					><train-dict-label dict-type="order_status" :dict-value="dataForm.orderStatus"></train-dict-label>
				</el-descriptions-item>
				<el-descriptions-item v-if="dataForm.orderStatus == 'paid'" label="实际收到金额"
					><el-text type="error" size="large">{{ dataForm.actuallyReceived }} 元 </el-text></el-descriptions-item
				>
				<el-descriptions-item v-if="dataForm.orderStatus == 'paid'" label="通道手续费"
					><el-text type="warning" size="large">{{ dataForm.serviceFee }} 元 </el-text></el-descriptions-item
				>
				<el-descriptions-item v-if="dataForm.orderStatus == 'paid'" label="实付金额"
					><el-text type="success" size="large">{{ dataForm.paid }} 元</el-text></el-descriptions-item
				>
				<el-descriptions-item v-if="dataForm.orderStatus == 'paid'" label="支付时间"
					><el-text type="success" size="large">{{ dataForm.paidTime }} </el-text></el-descriptions-item
				>
				<el-descriptions-item label="应付金额"
					><el-text type="primary" size="large">{{ dataForm.shouldPay }} 元</el-text></el-descriptions-item
				>
				<el-descriptions-item label="订单金额">{{ dataForm.totalPrice }} 元</el-descriptions-item>
				<el-descriptions-item label="减免金额"
					><el-text type="warning" size="large">{{ dataForm.discount }} 元</el-text></el-descriptions-item
				>
				<el-descriptions-item label="备注">{{ dataForm.remark }}</el-descriptions-item>
				<el-descriptions-item label="减免原因"> {{ dataForm.discountReason }}</el-descriptions-item>
			</el-descriptions>
			<el-divider>已选课程</el-divider>
			<el-table :data="dataForm.courseList" v-loading="loading" header-align="center" style="width: 100%" border>
				<el-table-column prop="courseName" label="课程" header-align="center" align="center"> </el-table-column>
				<el-table-column prop="courseHourTotal" label="总课时" header-align="center" align="center"> </el-table-column>
				<el-table-column prop="amountOneHour" label="课时单价" header-align="center" align="center">
					<template #default="scope">
						<el-text>{{ scope.row.amountOneHour }}元</el-text>
					</template>
				</el-table-column>
				<el-table-column prop="buyHours" label="购买时数" header-align="center" align="center">
					<template #default="scope">
						<el-tag>{{ scope.row.buyHours }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="totalPrice" label="应付金额" header-align="center" align="center">
					<template #default="scope">
						<el-text>{{ scope.row.totalPrice }}元</el-text>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<template #footer>
			<el-row justify="center" style="margin: 10px">
				<el-button v-if="step === 0" @click="visible = false">取消</el-button>
				<el-button v-if="step === 0" type="primary" @click="submitHandle()">提交订单</el-button>
				<el-button v-if="step === 1" @click="visible = false">关闭</el-button>
				<el-button v-if="step === 1 && dataForm.orderStatus == 'wait'" type="warning" @click="handleCancelOrder()">取消订单</el-button>
				<el-button v-if="step === 1 && dataForm.orderStatus == 'wait'" type="primary" @click="handlePayOrder()">立刻支付</el-button>
			</el-row>
		</template>
	</el-dialog>
	<!--  课程选择 -->
	<train-data-table
		v-if="courseVisible"
		:key="courseVisible + ''"
		v-model:visible="courseVisible"
		title="课程选择"
		url="/train/course/page"
		:columns="[
			{ field: 'courseName', label: '课程名称' },
			{ field: 'courseCode', label: '课程编码' },
			{ field: 'classType', label: '关联班级类型', dictType: 'class_type' },
			{ field: 'remark', label: '备注' }
		]"
		:query-params="[
			{ field: 'courseName', label: '课程名称' },
			{ field: 'courseCode', label: '课程编码' },
			{ field: 'classType', label: '关联班级类型', dictType: 'class_type' }
		]"
		@select="onCourseSelect"
	></train-data-table>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { calcOrderPriceApi, createOrder, getOrderApi, payApi, cancelApi } from '@/api/train/order'
import { Plus } from '@element-plus/icons-vue'
import TrainStudentInput from '@/components/train-student-input/index.vue'
// 步骤条
const step = ref(0)

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const courseVisible = ref(false)
const loading = ref(false)
const dataFormRef = ref()
// 订单信息
const dataForm = ref({
	id: 0,
	studentId: '',
	studentName: '',
	paid: 0,
	paidTime: '',
	serviceFee:0,
	actuallyReceived:0,
	shouldPay: 0,
	totalPrice: 0,
	discount: 0,
	discountReason: '',
	orderStatus: '',
	remark: '',
	courseList: [] as any[]
})
// 计算属性 订单总金额
const totalPriceComputed = computed(() => {
	let totalPrice = 0
	dataForm.value.courseList.forEach((item: any) => {
		totalPrice += item.amountOneHour * item.buyHours
	})
	return totalPrice
})
const init = (id?: number, calc?: any) => {
	visible.value = true

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getOrderInfo(id)
		step.value = 1
		return
	}
	step.value = 0
	if (calc) {
		calcOrderPriceApi(calc).then(({ data }) => {
			dataForm.value.studentId = data.studentId
			dataForm.value.courseList = data.courseList
		})
	} else {
		// 如果没有ID 对参数进行初始化
		dataForm.value = {
			id: 0,
			studentId: '',
			studentName: '',
			paid: 0,
			paidTime: '',
			serviceFee:0,
			actuallyReceived:0,
			shouldPay: 0,
			totalPrice: 0,
			discount: 0,
			discountReason: '',
			orderStatus: '',
			remark: '',
			courseList: [] as any[]
		}
	}
}
// 获取订单信息
const getOrderInfo = (id: number) => {
	getOrderApi(id).then(data => {
		dataForm.value = data.data
	})
}

const dataRules = ref({
	studentId: [{ required: true, message: '学员不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	if (totalPriceComputed.value - dataForm.value.discount <= 0) {
		ElMessage.warning({
			message: '应付金额必须大于0',
			duration: 1000
		})
		return false
	}
	if(dataForm.value.discountReason == '' && dataForm.value.discount > 0){
		ElMessage.warning({
			message: '减免原因不能为空',
			duration: 1000
		})
		return false
	}
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		createOrder(dataForm.value)
			.then(data => {
				emit('refreshDataList')
				dataForm.value = data.data
				step.value = 1
				ElMessage.success({
					message: '订单创建成功',
					duration: 1000,
					onClose: () => {}
				})
			})
			.catch(() => {})
	})
}
// 点添加课程
const handleAddCourse = () => {
	courseVisible.value = true
}
// 选择了课程
const onCourseSelect = (rows: any[]) => {
	let row = rows[0]
	// 判断列表中是否已存在该课程
	if (dataForm.value.courseList.some((item: any) => item.courseCode == row.courseCode)) {
		ElMessage.error({
			message: '该课程已存在，请重新选择',
			duration: 1000
		})
		return
	}
	// 添加课程
	dataForm.value.courseList.push({
		courseCode: row.courseCode,
		courseName: row.courseName,
		courseHourTotal: row.courseHourTotal,
		courseHourOnce: row.courseHourOnce,
		amountOneHour: row.amountOneHour,
		buyHours: row.courseHourTotal,
		totalPrice: 0
	})
}
// 取消订单
const handleCancelOrder = () => {
	ElMessageBox.confirm('确定取消订单吗?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	})
		.then(() => {
			cancelApi({ id: dataForm.value.id }).then(() => {
				emit('refreshDataList')
				ElMessage.success({
					message: '取消订单成功',
					duration: 1000,
					onClose: () => {
						visible.value = false
					}
				})
			})
		})
		.catch(() => {})
}
// 立即支付
const handlePayOrder = () => {
	ElMessageBox.prompt('请输入支付的手续费。实际收到金额 = 支付金额 - 手续费', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		inputPattern: /^[0-9.]+$/,
		inputErrorMessage: '请输入数字'
	})
		.then(({ value }) => {
			console.log("输入的金额是：",value)
			payApi({
				id: dataForm.value.id,
				serviceFee: value
			}).then(() => {
				emit('refreshDataList')
				ElMessage.success({
					message: '支付订单成功',
					duration: 1000,
					onClose: () => {
						visible.value = false
					}
				})
			})
		})
		.catch(() => {})
	// ElMessageBox.confirm('确定支付订单吗?', '提示', {
	// 	confirmButtonText: '确定',
	// 	cancelButtonText: '取消',
	// 	type: 'warning'
	// })
	// 	.then(() => {
	// 		payApi({ id: dataForm.value.id }).then(() => {
	// 			emit('refreshDataList')
	// 			ElMessage.success({
	// 				message: '支付订单成功',
	// 				duration: 1000,
	// 				onClose: () => {
	// 					visible.value = false
	// 				}
	// 			})
	// 		})
	// 	})
	// 	.catch(() => {})
}

defineExpose({
	init
})
</script>
