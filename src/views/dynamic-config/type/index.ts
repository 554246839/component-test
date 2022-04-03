class CommonType {
  title?: string
  code?: string
  filter?: string
  langCode?: string
  readVariable?: string
  writeVariable?: string
}
export class Common {
  hide = true
  type = 'common'
  properties = new CommonType
  dialogTemplate = []
}

/**** 容器组件 ****/
// form
class FormType {
  size?: 'large' | 'default' | 'small'
  labelWidth?: string | number
  labelPosition: 'left' | 'right' | 'top' = 'right'
}

// search
class SearchType extends FormType {
  gutter = 20
  searchBtnText = '搜索'
  searchIcon = 'Search'
  resetBtnText = '重置'
  resetIcon = 'Refresh'
  round?: boolean
}
export class Search {
  bui = true
  type = 'search'
  properties = new SearchType
  children = []
}

// aside
class AsideType {
  width = '200'
  type: 'none' | 'url' | 'refreshTable' = 'none'
  api?: string
  requestType?: 'post' | 'get'
  requestParams?: string
  url?: string
}
export class Aside {
  bui = true
  hide = true
  type = 'aside'
  properties = new AsideType
  children = []
}

// table
class ColumnType {
  prop?: string
  width?: string
  label = 'label'
  i18n?: string
  showOverflowTooltip?: boolean
  allowCustomBtn?: boolean
  customBtnPos?: string
  align: 'left' | 'center' | 'right' = 'left'
  format?: string
  extra?: string
  type: 'selection' | 'default' | 'operate' = 'default'
  sortable?: boolean
  fixed: 'none' | 'left' | 'right' = 'none'
  isCustomText?: boolean
  parentData?: string
  customText = `\
function fn(row, parse) {

}`
}
export class Column {
  type = 'column'
  properties = new ColumnType
  children?: Button[]
}
class TableType {
  size = 'small'
  showSum?: boolean
  api?: string
  requestType?: 'post' | 'get'
  requestParams?: string
  sumText?: string
  sumCols = []
  // sumFormat?: string
  sumApi?: string
  sumRequestType?: 'post' | 'get'
  sumRequestParams?: string
  pagination = true
  pSize = 10
  pSizes = '10,20,50,100'
  pAlign: 'left' | 'center' | 'right' = 'left'
}
export class Table {
  bui = true
  type = 'table'
  properties = new TableType
  buttons: Button[] = []
  children: Column[] = []
  sortables = []
}

// 集算表
class TableSheetType {

}
export class TbSheet {
  hide = true
  bui = true
  type = 'tbSheet'
  properties = new TableSheetType
  children = []
}


// dialog
class DialogType extends FormType {
  title = '弹窗模板'
  width = '50%'
  readVariable?: string
  writeVariable?: string
  getDataApi?: string
  requestType?: 'post' | 'get'
  requestParams?: string
  showFooter = true
  readonly?: boolean
  footerAlign: 'left' | 'center' | 'right' = 'left'
}
export class Dialog {
  hide = true
  type = 'dialog'
  properties = new DialogType
  children = []
  buttons: Button[] = []
}

// export class Form {
//   type = 'form'
//   properties = new FormType
//   children: (Text | Input | TextareaType | Select | Button | Download | Upload | Checkbox | Radio | Date)[] = []
// }


/**** Form UI组件 ****/
interface CommonItem {
  label: string
  i18n?: string
  value: string
}
class FormItem {
  label = 'label'
  i18n?: string
  prop?: string
  defaultValue?: string
  tip?: string
  span = 24
  labelWidth?: string
  required?: boolean
  disabled?: boolean
  searchAttrLogic?: string
  rule?: string
  errMsg?: string
  status: 'disabled' | 'display' | 'none' = 'none'
  condition = `\
function fn(formData) {

}`
}
// text
class TextType {
  label = 'label'
  i18n?: string
  labelWidth?: string
  text = '文本'
  defaultValue?: string
  prop?: string
  span = 24
  style?: string
  format?: string
  dateFormat?: string
  isShow?: boolean
  condition = `\
function fn(formData) {

}`
  isCustom?: boolean
  parentData?: string[]
  customText = `\
function fn(formData, parse) {

}`
}
export class Text {
  type = 'text'
  properties = new TextType
}

// input
class InputType extends FormItem {
  type: 'password' | 'text' | 'number' = 'text'
  placeholder?: string
  clearable = true
}
export class Input {
  type = 'input'
  properties: InputType = new InputType
}

// textarea
class TextareaType extends FormItem {
  rows = 4
  placeholder?: string
  clearable = true
}
export class Textarea {
  type = 'textarea'
  properties = new TextareaType
}

// select
class SelectType extends FormItem {
  placeholder?: string
  optionsId?: string
  api?: string
  requestType?: 'get' | 'post'
  requestParams?: string
  filterable?: boolean
  clearable = true
  multiple?: boolean
}
export class Select {
  type = 'select'
  properties = new SelectType
}

// button
class ButtonType {
  label = '文本'
  i18n?: string
  icon?: string
  type: 'none' | 'link' | 'confirm' | 'dialog' | 'download' = 'none'
  btnSize?: 'large' | 'default' | 'small'
  styleType?: 'warning' | 'success' | 'primary' | 'danger' | 'text' | 'info'
  round = true
  circle?: boolean
  api?: string
  requestType?: 'post' | 'get'
  requestParams?: string
  url?: string
  externalLink?: boolean
  title?: string
  message?: string
  dialogTemplateId?: string
  refreshTable?: boolean
  depData?: 'search' | 'table'
  closeDialog = true    // dialog-footer
  span = 24
  // column
  showCondition = `\
function fn(row) {

}`
  // 弹窗底部
  functionType: 'other' | 'close' | 'reset' = 'other'
}
export class Button {
  type = 'button'
  properties = new ButtonType
}

// download
class DownloadType {
  label = 'label'
  i18n?: string
  prop?: string
  span = 24
  labelWidth?: string
  allowDelete?: boolean
}
export class Download {
  type = 'download'
  properties = new DownloadType
  children: CommonItem[] = []
}

// upload
class UploadType extends FormItem {
  api?: string
  requestParams?: string
  multiple?: boolean
  uploadTip = 'jpg/png files with a size less than 500kb'
}
export class Upload {
  type = 'upload'
  properties = new UploadType
}

// checkbox
class CheckboxType extends FormItem {
  api?: string
  requestType?: 'get' | 'post'
  requestParams?: string
}
export class Checkbox {
  type = 'checkbox'
  properties = new CheckboxType
  children: CommonItem[] = []
}

// radio
class RadioType extends FormItem {
  api?: string
  requestType?: 'get' | 'post'
  requestParams?: string
}
export class Radio {
  type = 'radio'
  properties = new RadioType
  children: CommonItem[] = []
}

// switch
class SwitchType extends FormItem {
  activeValue?: string
  inactiveValue?: string
  activeColor?: string
  inactiveColor?: string
  api?: string
  requestType?: 'get' | 'post'
  requestParams?: string
  refreshTable?: boolean
  showCondition = `\
function fn(row) {

}`
}
export class Switch {
  type = 'switch'
  properties = new SwitchType
}

// date
class DateType extends FormItem {
  type: 'date' | 'month' | 'year' | 'datetime' | 'datetimerange' | 'daterange' | 'monthrange' = 'date'
  placeholder?: string
  startPlaceholder?: string
  endPlaceholder?: string
  rangeSeparator?: string
  format = 'YYYY-MM-DD'
  valueFormat = 'YYYY-MM-DD'
  useDisabled?: boolean
  startDisabled?: string
  endDisabled?: string
  clearable = true
}
export class Date {
  type = 'date'
  properties = new DateType
}

// time
class TimeType extends FormItem {
  placeholder?: string
  clearable = true
}
export class Time {
  type = 'time'
  properties = new TimeType
}

// monaco
class MonacoType extends FormItem {
  language: 'json' | 'javascript' | 'java' | 'mysql' | 'python' | 'shell' = 'json'
  width = '100%'
  height = '300px'
}
export class Monaco {
  type = 'monaco'
  properties = new MonacoType
}
