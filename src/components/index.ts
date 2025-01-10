import type { App, Plugin } from 'vue'
import TrainDictColumn from '@/components/train-dict/train-dict-column/index.vue'
import TrainDictLabel from '@/components/train-dict/train-dict-label/index.vue'
import TrainDictRadio from '@/components/train-dict/train-dict-radio/index.vue'
import TrainDictTreeSelect from '@/components/train-dict/train-dict-tree-select/index.vue'
import TrainDictSelect from '@/components/train-dict/train-dict-select/index.vue'
import TrainDictCheckbox from '@/components/train-dict/train-dict-checkbox/index.vue'
import TrainDataColumn from '@/components/train-data/train-data-column/index.vue'
import TrainDataLabel from '@/components/train-data/train-data-label/index.vue'
import TrainDataSelect from '@/components/train-data/train-data-select/index.vue'
import TrainDataTreeSelect from '@/components/train-data/train-data-tree-select/index.vue'
import TrainDataTreeLeft from '@/components/train-data/train-data-tree-left/index.vue'
import TrainDataTable from '@/components/train-data/train-data-table/index.vue'
import TrainImageColumn from '@/components/train-image-column/index.vue'

import TrainIcon from '@/components/train-icon/index.vue'
import TrainEditor from '@/components/train-editor/index.vue'
import TrainMarkdown from '@/components/train-markdown/index.vue'
import TrainAddress from '@/components/train-address/index.vue'
import TrainUserInput from '@/components/train-user/train-user-input/index.vue'
import TrainUserDialog from '@/components/train-user/train-user-dialog/index.vue'
import TrainOrgSelect from '@/components/train-org/train-org-select/index.vue'
import TrainOrgInput from '@/components/train-org/train-org-input/index.vue'
import TrainRoleInput from '@/components/train-role-input/index.vue'
import TrainPostInput from '@/components/train-post-input/index.vue'
import TrainUploadImage from '@/components/train-upload/train-upload-image/index.vue'
import TrainUploadImages from '@/components/train-upload/train-upload-images/index.vue'
import TrainUploadFile from '@/components/train-upload/train-upload-file/index.vue'
import TrainUploadExcel from '@/components/train-upload/train-upload-excel/index.vue'

const components = [
	TrainEditor,
	TrainMarkdown,
	TrainAddress,
	TrainIcon,
	TrainDictLabel,
	TrainDictColumn,
	TrainDictRadio,
	TrainDictSelect,
	TrainDictCheckbox,
	TrainDictTreeSelect,
	TrainDataColumn,
	TrainDataLabel,
	TrainDataSelect,
	TrainDataTreeSelect,
	TrainDataTreeLeft,
	TrainDataTable,
	TrainImageColumn,
	TrainUserInput,
	TrainUserDialog,
	TrainOrgSelect,
	TrainOrgInput,
	TrainRoleInput,
	TrainPostInput,
	TrainUploadImage,
	TrainUploadImages,
	TrainUploadFile,
	TrainUploadExcel
]

const TrainComponent: Plugin = {
	install(Vue: App) {
		components.forEach((component: any) => {
			Vue.component(component.name, component)
		})
	}
}

export default TrainComponent
