/**
 * 不同组件的属性配置
 */
interface Rule {
  originValue?: string
  destValue?: (string | boolean | number | undefined)[]
}
interface TemplateItem {
  label: string
  value: string
  type: 'input' | 'select' | 'radio' | 'switch' | 'textarea' | 'edit' | 'title' | 'monaco',
  rows?: number
  multiple?: boolean
  children?: { label: string, value: string }[]
  use?: (string | undefined)[]
  rules?: Rule[]
  editFields?: string[]
  valueChildren?: Record<'label' | 'value', string>[]
  placeholder?: string
}

const formItem: TemplateItem[] = [
  {
    use: ['search', 'dialog'],
    label: 'Form 表单属性',
    value: 'Form Properties',
    type: 'title'
  },
  {
    use: ['search', 'dialog'],
    label: '标签',
    value: 'label',
    type: 'input'
  },
  {
    use: ['search', 'dialog'],
    label: '多语言属性',
    value: 'i18n',
    type: 'input'
  },
  {
    use: ['search', 'dialog'],
    label: '属性',
    value: 'prop',
    type: 'input'
  },
  {
    use: ['search', 'dialog'],
    label: '初始值',
    value: 'defaultValue',
    type: 'textarea',
    rows: 1
  },
  {
    use: ['search', 'dialog'],
    label: '跨度范围',
    value: 'span',
    type: 'input'
  },
  {
    use: ['search', 'dialog'],
    label: '标签宽度',
    value: 'labelWidth',
    type: 'input'
  },
  {
    use: ['search'],
    label: '搜索属性逻辑',
    value: 'searchAttrLogic',
    type: 'select',
    children: []
  },
  {
    label: '提示信息',
    value: 'tip',
    type: 'input',
    use: ['dialog']
  },
  {
    label: '规则',
    value: 'rule',
    type: 'input',
    use: ['dialog']
  },
  {
    label: '错误信息',
    value: 'errMsg',
    type: 'input',
    use: ['dialog']
  },
  {
    label: '选择类型操作',
    value: 'status',
    type: 'select',
    use: ['dialog'],
    children: [
      {
        label: 'none',
        value: 'none'
      },
      {
        label: 'disabled',
        value: 'disabled'
      },
      {
        label: 'display',
        value: 'display'
      }
    ]
  },
  {
    rules: [
      {
        originValue: 'status',
        destValue: ['disabled', 'display']
      }
    ],
    label: '条件逻辑',
    value: 'condition',
    type: 'monaco',
    use: ['dialog']
  },
  {
    label: '必填',
    value: 'required',
    type: 'switch',
    use: ['dialog']
  }
]

const FormType: TemplateItem[] = [
  {
    label: 'Form 表单属性',
    value: 'Form Properties',
    type: 'title'
  },
  {
    label: '标签位置',
    value: 'labelPosition',
    type: 'select',
    children: [
      {
        label: 'left',
        value: 'left'
      },
      {
        label: 'right',
        value: 'right'
      },
      {
        label: 'top',
        value: 'top'
      }
    ]
  },
  {
    label: '标签宽度',
    value: 'labelWidth',
    type: 'input'
  },
  {
    label: '大小设置',
    value: 'size',
    type: 'select',
    children: [
      {
        label: 'large',
        value: 'large'
      },
      {
        label: 'default',
        value: 'default'
      },
      {
        label: 'small',
        value: 'small'
      }
    ]
  }
]

const propertyTemplate: Record<string, TemplateItem[]> = {
  common: [
    {
      label: '页面标题',
      value: 'title',
      type: 'input'
    },
    {
      label: '页面code',
      value: 'code',
      type: 'input'
    },
    {
      label: '页面国际化code',
      value: 'langCode',
      type: 'input'
    },
    {
      label: '过滤规则',
      value: 'filter',
      type: 'input'
    },
    {
      label: '可读变量(包含读写)',
      value: 'readVariable',
      type: 'select',
      children: []
    },
    {
      label: '可写变量(包含读写)',
      value: 'writeVariable',
      type: 'select',
      multiple: true,
      children: []
    }
  ],
  search: [
    {
      label: '搜索按钮文本',
      value: 'searchBtnText',
      type: 'input'
    },
    {
      label: '搜索按钮图标',
      value: 'searchIcon',
      type: 'input'
    },
    {
      label: '重置按钮文本',
      value: 'resetBtnText',
      type: 'input'
    },
    {
      label: '重置按钮图标',
      value: 'resetIcon',
      type: 'input'
    },
    {
      label: '按钮圆角',
      value: 'round',
      type: 'switch'
    },
    {
      label: '组件间隔',
      value: 'gutter',
      type: 'input'
    },
    ...FormType
  ],
  aside: [
    {
      label: '宽度',
      value: 'width',
      type: 'input'
    },
    {
      label: '请求api',
      value: 'api',
      type: 'input'
    },
    {
      label: '请求类型',
      value: 'requestType',
      type: 'select',
      children: [
        {
          label: 'get',
          value: 'get'
        },
        {
          label: 'post',
          value: 'post'
        }
      ]
    },
    {
      label: '请求参数',
      value: 'requestParams',
      type: 'textarea'
    },
    {
      label: '回调操作类型',
      value: 'type',
      type: 'select',
      children: [
        {
          label: 'none',
          value: 'none'
        },
        {
          label: '跳转',
          value: 'url'
        },
        {
          label: '刷新table',
          value: 'refreshTable'
        }
      ]
    },
    {
      rules: [
        {
          originValue: 'type',
          destValue: ['url']
        }
      ],
      label: '跳转url',
      value: 'url',
      type: 'input'
    }
  ],

  table: [
    {
      label: 'table大小',
      value: 'size',
      type: 'select',
      children: [
        {
          label: 'large',
          value: 'large'
        },
        {
          label: 'default',
          value: 'default'
        },
        {
          label: 'small',
          value: 'small'
        }
      ]
    },
    {
      label: '请求api',
      value: 'api',
      type: 'input'
    },
    {
      label: '请求类型',
      value: 'requestType',
      type: 'select',
      children: [
        {
          label: 'get',
          value: 'get'
        },
        {
          label: 'post',
          value: 'post'
        }
      ]
    },
    {
      label: '请求参数',
      value: 'requestParams',
      type: 'textarea'
    },
    {
      label: '显示合计行',
      value: 'showSum',
      type: 'switch'
    },
    {
      rules: [
        {
          originValue: 'showSum',
          destValue: [true]
        }
      ],
      label: '合计行首列文本',
      value: 'sumText',
      type: 'input'
    },
    {
      rules: [
        {
          originValue: 'showSum',
          destValue: [true]
        }
      ],
      label: '选择合计列',
      value: 'sumCols',
      type: 'select',
      multiple: true,
      children: []
    },
    {
      rules: [
        {
          originValue: 'showSum',
          destValue: [true]
        }
      ],
      label: '合并行数据Api',
      value: 'sumApi',
      type: 'input'
    },
    {
      rules: [
        {
          originValue: 'showSum',
          destValue: [true]
        }
      ],
      label: '请求类型',
      value: 'sumRequestType',
      type: 'select',
      children: [
        {
          label: 'get',
          value: 'get'
        },
        {
          label: 'post',
          value: 'post'
        }
      ]
    },
    {
      rules: [
        {
          originValue: 'showSum',
          destValue: [true]
        }
      ],
      label: '请求参数',
      value: 'sumRequestParams',
      type: 'textarea'
    },
    {
      label: '添加排序规则',
      value: '',
      type: 'edit',
      editFields: ['sortables', 'prop', 'value'],
      valueChildren: [
        {
          label: '升序',
          value: 'ASC'
        },
        {
          label: '降序',
          value: 'DESC'
        }
      ]
    },
    {
      label: 'Pagination 属性',
      value: 'Pagination Properties',
      type: 'title'
    },
    {
      label: '使用分页',
      value: 'pagination',
      type: 'switch'
    },
    {
      rules: [
        {
          originValue: 'pagination',
          destValue: [true]
        }
      ],
      label: '每页数量',
      value: 'pSize',
      type: 'input'
    },
    {
      rules: [
        {
          originValue: 'pagination',
          destValue: [true]
        }
      ],
      label: '可选每页数量(10,20,50,100)',
      value: 'pSizes',
      type: 'input'
    },
    {
      rules: [
        {
          originValue: 'pagination',
          destValue: [true]
        }
      ],
      label: '组件位置',
      value: 'pAlign',
      type: 'select',
      children: [
        {
          label: 'left',
          value: 'left'
        },
        {
          label: 'center',
          value: 'center'
        },
        {
          label: 'right',
          value: 'right'
        }
      ]
    }
  ],
  column: [
    {
      rules: [
        {
          originValue: 'type',
          destValue: ['default', 'operate']
        }
      ],
      label: '列标题',
      value: 'label',
      type: 'input'
    },
    {
      rules: [
        {
          originValue: 'type',
          destValue: ['default', 'operate']
        }
      ],
      label: '多语言属性',
      value: 'i18n',
      type: 'input'
    },
    {
      rules: [
        {
          originValue: 'type',
          destValue: ['default', 'operate']
        }
      ],
      label: '属性',
      value: 'prop',
      type: 'input'
    },
    {
      label: '类型',
      value: 'type',
      type: 'select',
      children: [
        {
          label: 'selection',
          value: 'selection'
        },
        {
          label: 'default',
          value: 'default'
        },
        {
          label: 'operate',
          value: 'operate'
        }
      ]
    },
    {
      label: '宽度(不写为自适应)',
      value: 'width',
      type: 'input'
    },
    {
      rules: [
        {
          originValue: 'type',
          destValue: ['default']
        }
      ],
      label: '是否排序',
      value: 'sortable',
      type: 'switch'
    },
    {
      rules: [
        {
          originValue: 'type',
          destValue: ['default', 'operate']
        }
      ],
      label: '超出隐藏',
      value: 'showOverflowTooltip',
      type: 'switch'
    },
    {
      rules: [
        {
          originValue: 'type',
          destValue: ['operate']
        }
      ],
      label: '操作列',
      value: 'allowCustomBtn',
      type: 'switch'
    },
    {
      rules: [
        {
          originValue: 'type',
          destValue: ['operate']
        },
        {
          originValue: 'allowCustomBtn',
          destValue: [true]
        }
      ],
      label: '自定义按钮位置',
      value: 'customBtnPos',
      type: 'input'
    },
    {
      label: '固定列',
      value: 'fixed',
      type: 'select',
      children: [
        {
          label: 'none',
          value: 'none'
        },
        {
          label: 'left',
          value: 'left'
        },
        {
          label: 'right',
          value: 'right'
        }
      ]
    },
    {
      label: '文本排列',
      value: 'align',
      type: 'select',
      children: [
        {
          label: 'left',
          value: 'left'
        },
        {
          label: 'center',
          value: 'center'
        },
        {
          label: 'right',
          value: 'right'
        }
      ]
    },
    {
      rules: [
        {
          originValue: 'type',
          destValue: ['default', 'operate']
        }
      ],
      label: '格式类型',
      value: 'format',
      type: 'select',
      children: []
    },
    {
      rules: [
        {
          originValue: 'type',
          destValue: ['default', 'operate']
        },
        {
          originValue: 'format',
          destValue: ['date']
        }
      ],
      label: '日期格式',
      value: 'extra',
      type: 'input',
      placeholder: 'YYYY-MM-DD hh:mm:ss'
    },
    {
      rules: [
        {
          originValue: 'type',
          destValue: ['default', 'operate']
        }
      ],
      label: '自定义文本',
      value: 'isCustomText',
      type: 'switch'
    },
    {
      rules: [
        {
          originValue: 'type',
          destValue: ['default', 'operate']
        },
        {
          originValue: 'isCustomText',
          destValue: [true]
        }
      ],
      label: '依赖父级下拉数据源',
      value: 'parentData',
      type: 'select',
      children: []
    },
    {
      rules: [
        {
          originValue: 'type',
          destValue: ['default', 'operate']
        },
        {
          originValue: 'isCustomText',
          destValue: [true]
        }
      ],
      label: '自定义文本函数',
      value: 'customText',
      type: 'monaco'
    }
  ],

  dialog: [
    {
      label: '弹框标题',
      value: 'title',
      type: 'input'
    },
    {
      label: '多语言属性',
      value: 'i18n',
      type: 'input'
    },
    {
      label: '宽度',
      value: 'width',
      type: 'input'
    },
    {
      label: '可读变量(包含读写)',
      value: 'readVariable',
      type: 'select',
      children: []
    },
    {
      label: '可写变量(包含读写)',
      value: 'writeVariable',
      type: 'select',
      multiple: true,
      children: []
    },
    {
      label: '初始数据Api',
      value: 'getDataApi',
      type: 'input'
    },
    {
      label: '请求类型',
      value: 'requestType',
      type: 'select',
      children: [
        {
          label: 'get',
          value: 'get'
        },
        {
          label: 'post',
          value: 'post'
        }
      ]
    },
    {
      label: '请求参数',
      value: 'requestParams',
      type: 'textarea'
    },
    {
      label: '底部',
      value: 'showFooter',
      type: 'switch'
    },
    {
      label: '只读',
      value: 'readonly',
      type: 'switch'
    },
    {
      rules: [
        {
          originValue: 'showFooter',
          destValue: [true]
        }
      ],
      label: '底部按钮排列',
      value: 'footerAlign',
      type: 'select',
      children: [
        {
          label: 'left',
          value: 'left'
        },
        {
          label: 'center',
          value: 'center'
        },
        {
          label: 'right',
          value: 'right'
        }
      ]
    },
    ...FormType
  ],

  form: [],
  text: [
    {
      label: '标签',
      value: 'label',
      type: 'input'
    },
    {
      label: '多语言属性',
      value: 'i18n',
      type: 'input'
    },
    {
      label: '标签宽度',
      value: 'labelWidth',
      type: 'input'
    },
    {
      label: '文本',
      value: 'text',
      type: 'textarea'
    },
    {
      label: '缺省文本',
      value: 'defaultValue',
      type: 'input'
    },
    {
      label: '属性',
      value: 'prop',
      type: 'input'
    },
    {
      label: '跨度范围',
      value: 'span',
      type: 'input'
    },
    {
      label: '样式',
      value: 'style',
      type: 'textarea'
    },
    {
      label: '格式',
      value: 'format',
      type: 'select'
    },
    {
      rules: [
        {
          originValue: 'format',
          destValue: ['date']
        }
      ],
      label: '日期格式',
      value: 'dateFormat',
      type: 'input',
      placeholder: 'YYYY-MM-DD hh:mm:ss'
    },
    {
      label: '是否显示',
      value: 'isShow',
      type: 'switch'
    },
    {
      rules: [
        {
          originValue: 'isShow',
          destValue: [true]
        }
      ],
      label: '显示条件',
      value: 'condition',
      type: 'monaco'
    },
    {
      label: '自定义文本',
      value: 'isCustom',
      type: 'switch'
    },
    {
      rules: [
        {
          originValue: 'isCustom',
          destValue: [true]
        }
      ],
      label: '依赖父级下拉数据源',
      value: 'parentData',
      type: 'select',
      multiple: true
    },
    {
      rules: [
        {
          originValue: 'isCustom',
          destValue: [true]
        }
      ],
      label: '自定义文本方法',
      value: 'customText',
      type: 'monaco'
    }
  ],
  input: [
    {
      label: '类型',
      value: 'type',
      type: 'select',
      children: [
        {
          label: 'text',
          value: 'text'
        },
        {
          label: 'password',
          value: 'password'
        },
        {
          label: 'number',
          value: 'number'
        }
      ]
    },
    {
      label: '占位提示文本',
      value: 'placeholder',
      type: 'input'
    },
    {
      label: '可清除',
      value: 'clearable',
      type: 'switch'
    },
    {
      label: '禁用',
      value: 'disabled',
      type: 'switch'
    },
    ...formItem
  ],
  textarea: [
    {
      label: '行高数',
      value: 'rows',
      type: 'input'
    },
    {
      label: '占位提示文本',
      value: 'placeholder',
      type: 'input'
    },
    {
      label: '可清除',
      value: 'clearable',
      type: 'switch'
    },
    {
      label: '禁用',
      value: 'disabled',
      type: 'switch'
    },
    ...formItem
  ],
  select: [
    {
      label: '占位提示文本',
      value: 'placeholder',
      type: 'input'
    },
    {
      label: '下拉数据源',
      value: 'optionsId',
      type: 'select',
      children: []
    },
    {
      label: '可清除',
      value: 'clearable',
      type: 'switch'
    },
    {
      label: '多选',
      value: 'multiple',
      type: 'switch'
    },
    {
      label: '禁用',
      value: 'disabled',
      type: 'switch'
    },
    {
      label: '筛选',
      value: 'filterable',
      type: 'switch'
    },
    {
      rules: [
        {
          originValue: 'multiple',
          destValue: [false, undefined]
        },
        {
          originValue: 'disabled',
          destValue: [false, undefined]
        }
      ],
      label: '请求api(change)',
      value: 'api',
      type: 'input'
    },
    {
      rules: [
        {
          originValue: 'multiple',
          destValue: [false, undefined]
        },
        {
          originValue: 'disabled',
          destValue: [false, undefined]
        }
      ],
      label: '请求类型',
      value: 'requestType',
      type: 'select',
      children: [
        {
          label: 'get',
          value: 'get'
        },
        {
          label: 'post',
          value: 'post'
        }
      ]
    },
    {
      rules: [
        {
          originValue: 'multiple',
          destValue: [false, undefined]
        },
        {
          originValue: 'disabled',
          destValue: [false, undefined]
        }
      ],
      label: '请求参数',
      value: 'requestParams',
      type: 'textarea'
    },
    ...formItem
  ],
  button: [
    {
      label: '文本',
      value: 'label',
      type: 'input'
    },
    {
      label: '多语言属性',
      value: 'i18n',
      type: 'input'
    },
    {
      label: '图标',
      value: 'icon',
      type: 'input'
    },
    {
      label: '样式类型',
      value: 'styleType',
      type: 'select',
      children: [
        {
          label: 'default',
          value: 'default'
        },
        {
          label: 'primary',
          value: 'primary'
        },
        {
          label: 'text',
          value: 'text'
        },
        {
          label: 'warning',
          value: 'warning'
        },
        {
          label: 'success',
          value: 'success'
        },
        {
          label: 'info',
          value: 'info'
        },
        {
          label: 'danger',
          value: 'danger'
        }
      ]
    },
    {
      label: '圆角',
      value: 'round',
      type: 'switch'
    },
    {
      label: '圆形',
      value: 'circle',
      type: 'switch'
    },
    {
      label: '按钮大小',
      value: 'btnSize',
      type: 'select',
      children: [
        {
          label: 'large',
          value: 'large'
        },
        {
          label: 'default',
          value: 'default'
        },
        {
          label: 'small',
          value: 'small'
        }
      ]
    },
    {
      rules: [
        {
          originValue: 'functionType',
          destValue: ['other']
        }
      ],
      label: '功能类型',
      value: 'type',
      type: 'select',
      children: [
        {
          label: 'none',
          value: 'none'
        },
        {
          label: '链接',
          value: 'link'
        },
        {
          label: '确认提示',
          value: 'confirm'
        },
        {
          label: '弹窗',
          value: 'dialog'
        },
        {
          label: '下载',
          value: 'download'
        }
      ]
    },
    {
      use: ['table'],
      label: '依赖数据',
      value: 'depData',
      type: 'select',
      children: [
        {
          label: '搜索栏数据',
          value: 'search'
        },
        {
          label: 'table选中数据(不为空)',
          value: 'table'
        }
      ]
    },
    {
      rules: [
        {
          originValue: 'type',
          destValue: ['confirm']
        },
        {
          originValue: 'functionType',
          destValue: ['other']
        }
      ],
      label: '确认框标题',
      value: 'title',
      type: 'input'
    },
    {
      rules: [
        {
          originValue: 'type',
          destValue: ['confirm']
        },
        {
          originValue: 'functionType',
          destValue: ['other']
        }
      ],
      label: '确认框标题多语言属性',
      value: 'i18nTitle',
      type: 'input'
    },
    {
      rules: [
        {
          originValue: 'type',
          destValue: ['confirm']
        },
        {
          originValue: 'functionType',
          destValue: ['other']
        }
      ],
      label: '确认框内容',
      value: 'message',
      type: 'textarea'
    },
    {
      rules: [
        {
          originValue: 'type',
          destValue: ['confirm']
        },
        {
          originValue: 'functionType',
          destValue: ['other']
        }
      ],
      label: '确认框内容多语言属性',
      value: 'i18nMsg',
      type: 'input'
    },
    {
      rules: [
        {
          originValue: 'type',
          destValue: ['none', 'link', 'confirm', 'download']
        },
        {
          originValue: 'functionType',
          destValue: ['other']
        }
      ],
      label: '点击回调api',
      value: 'api',
      type: 'input'
    },
    {
      rules: [
        {
          originValue: 'type',
          destValue: ['none', 'link', 'confirm']
        },
        {
          originValue: 'functionType',
          destValue: ['other']
        }
      ],
      label: '请求类型',
      value: 'requestType',
      type: 'select',
      children: [
        {
          label: 'get',
          value: 'get'
        },
        {
          label: 'post',
          value: 'post'
        }
      ]
    },
    {
      rules: [
        {
          originValue: 'type',
          destValue: ['none', 'link', 'confirm', 'download']
        },
        {
          originValue: 'functionType',
          destValue: ['other']
        }
      ],
      label: '请求参数',
      value: 'requestParams',
      type: 'textarea'
    },
    {
      rules: [
        {
          originValue: 'type',
          destValue: ['link']
        },
        {
          originValue: 'functionType',
          destValue: ['other']
        }
      ],
      label: '跳转url',
      value: 'url',
      type: 'input'
    },
    {
      rules: [
        {
          originValue: 'type',
          destValue: ['link']
        },
        {
          originValue: 'functionType',
          destValue: ['other']
        }
      ],
      label: '外部链接',
      value: 'externalLink',
      type: 'switch'
    },
    {
      rules: [
        {
          originValue: 'type',
          destValue: ['dialog']
        },
        {
          originValue: 'functionType',
          destValue: ['other']
        }
      ],
      label: '调用弹窗',
      value: 'dialogTemplateId',
      type: 'select',
      children: []
    },
    {
      use: ['table', 'column', 'dialogFooter', 'aside'],
      rules: [
        {
          originValue: 'type',
          destValue: ['none', 'link', 'confirm']
        },
        // {
        //   originValue: 'functionType',
        //   destValue: ['other']
        // }
      ],
      label: '刷新table',
      value: 'refreshTable',
      type: 'switch'
    },
    {
      use: ['column'],
      label: '显示条件',
      value: 'showCondition',
      type: 'monaco'
    },
    {
      rules: [
        {
          originValue: 'type',
          destValue: ['none', 'link', 'confirm']
        }
      ],
      use: ['dialogFooter'],
      label: '功能类型',
      value: 'functionType',
      type: 'select',
      children: [
        {
          label: 'other',
          value: 'other'
        },
        {
          label: 'close',
          value: 'close'
        },
        {
          label: 'reset',
          value: 'reset'
        }
      ]
    },
    {
      rules: [
        {
          originValue: 'type',
          destValue: ['none', 'link', 'confirm']
        },
        {
          originValue: 'functionType',
          destValue: ['other']
        }
      ],
      use: ['dialogFooter'],
      label: '关闭弹窗',
      value: 'closeDialog',
      type: 'switch'
    },
    {
      use: ['dialog'],
      label: 'Form Properties',
      value: 'Form Properties',
      type: 'title'
    },
    {
      use: ['dialog'],
      label: '跨度范围',
      value: 'span',
      type: 'input'
    }
  ],
  download: [
    {
      label: '添加下载子项',
      value: '',
      type: 'edit',
      editFields: ['children', 'name', 'url']
    },
    {
      label: 'Form 属性',
      value: 'Form Properties',
      type: 'title'
    },
    {
      label: '标签',
      value: 'label',
      type: 'input'
    },
    {
      label: '多语言属性',
      value: 'i18n',
      type: 'input'
    },
    {
      label: '属性',
      value: 'prop',
      type: 'input'
    },
    {
      label: '允许删除',
      value: 'allowDelete',
      type: 'switch'
    },
    {
      label: '跨度范围',
      value: 'span',
      type: 'input'
    },
    {
      label: '标签宽度',
      value: 'labelWidth',
      type: 'input'
    }
  ],
  upload: [
    {
      label: '上传api',
      value: 'api',
      type: 'input'
    },
    {
      label: '请求参数',
      value: 'requestParams',
      type: 'textarea'
    },
    {
      label: '多文件上传',
      value: 'multiple',
      type: 'switch'
    },
    {
      label: '上传提示',
      value: 'uploadTip',
      type: 'textarea'
    },
    ...formItem
  ],
  checkbox: [
    {
      label: '禁用',
      value: 'disabled',
      type: 'switch'
    },
    {
      label: '添加多选',
      value: '',
      type: 'edit',
      editFields: ['children', 'label', 'value']
    },
    ...formItem
  ],
  radio: [
    {
      label: '禁用',
      value: 'disabled',
      type: 'switch'
    },
    {
      rules: [
        {
          originValue: 'disabled',
          destValue: [false, undefined]
        }
      ],
      label: '请求api(change)',
      value: 'api',
      type: 'input'
    },
    {
      rules: [
        {
          originValue: 'disabled',
          destValue: [false, undefined]
        }
      ],
      label: '请求类型',
      value: 'requestType',
      type: 'select',
      children: [
        {
          label: 'get',
          value: 'get'
        },
        {
          label: 'post',
          value: 'post'
        }
      ]
    },
    {
      rules: [
        {
          originValue: 'disabled',
          destValue: [false, undefined]
        }
      ],
      label: '请求参数',
      value: 'requestParams',
      type: 'textarea'
    },
    {
      label: '添加单选',
      value: '',
      type: 'edit',
      editFields: ['children', 'label', 'value']
    },
    ...formItem
  ],
  date: [
    {
      use: ['search'],
      label: '类型',
      value: 'type',
      type: 'select',
      children: [
        {
          label: 'year',
          value: 'year'
        },
        {
          label: 'month',
          value: 'month'
        },
        {
          label: 'date',
          value: 'date'
        },
        {
          label: 'datetime',
          value: 'datetime'
        },
        {
          label: 'datetimerange',
          value: 'datetimerange'
        },
        {
          label: 'daterange',
          value: 'daterange'
        },
        {
          label: 'monthrange',
          value: 'monthrange'
        }
      ]
    },
    {
      use: ['dialog'],
      label: '类型',
      value: 'type',
      type: 'select',
      children: [
        {
          label: 'year',
          value: 'year'
        },
        {
          label: 'month',
          value: 'month'
        },
        {
          label: 'date',
          value: 'date'
        },
        {
          label: 'datetime',
          value: 'datetime'
        }
      ]
    },
    {
      rules: [
        {
          originValue: 'type',
          destValue: ['year', 'month', 'date', 'datetime']
        }
      ],
      label: '占位提示文本',
      value: 'placeholder',
      type: 'input'
    },
    {
      rules: [
        {
          originValue: 'type',
          destValue: ['datetimerange', 'daterange', 'monthrange']
        }
      ],
      label: '开始占位提示文本',
      value: 'startPlaceholder',
      type: 'input'
    },
    {
      rules: [
        {
          originValue: 'type',
          destValue: ['datetimerange', 'daterange', 'monthrange']
        }
      ],
      label: '结束占位提示文本',
      value: 'endPlaceholder',
      type: 'input'
    },
    {
      rules: [
        {
          originValue: 'type',
          destValue: ['datetimerange', 'daterange', 'monthrange']
        }
      ],
      label: '分隔符',
      value: 'rangeSeparator',
      type: 'input'
    },
    {
      label: '起止日期',
      value: 'useDisabled',
      type: 'switch'
    },
    {
      rules: [
        {
          originValue: 'useDisabled',
          destValue: [true]
        }
      ],
      label: '开始日期',
      value: 'startDisabled',
      type: 'input'
    },
    {
      rules: [
        {
          originValue: 'useDisabled',
          destValue: [true]
        }
      ],
      label: '结束日期',
      value: 'endDisabled',
      type: 'input'
    },
    {
      label: '显示格式化规则',
      value: 'format',
      placeholder: 'YYYY/MM/DD',
      type: 'input'
    },
    {
      label: '数据格式化规则',
      value: 'valueFormat',
      placeholder: 'YYYY/MM/DD',
      type: 'input'
    },
    {
      label: '可清除',
      value: 'clearable',
      type: 'switch'
    },
    {
      label: '禁用',
      value: 'disabled',
      type: 'switch'
    },
    ...formItem
  ],
  switch: [
    {
      label: '禁用',
      value: 'disabled',
      type: 'switch'
    },
    {
      label: '开启的值',
      value: 'activeValue',
      type: 'input'
    },
    {
      label: '关闭的值',
      value: 'inactiveValue',
      type: 'input'
    },
    {
      label: '打开颜色',
      value: 'activeColor',
      type: 'input'
    },
    {
      label: '关闭颜色',
      value: 'inactiveColor',
      type: 'input'
    },
    {
      rules: [
        {
          originValue: 'disabled',
          destValue: [false, undefined]
        }
      ],
      label: '请求api(change)',
      value: 'api',
      type: 'input'
    },
    {
      rules: [
        {
          originValue: 'disabled',
          destValue: [false, undefined]
        }
      ],
      label: '请求类型',
      value: 'requestType',
      type: 'select',
      children: [
        {
          label: 'get',
          value: 'get'
        },
        {
          label: 'post',
          value: 'post'
        }
      ]
    },
    {
      rules: [
        {
          originValue: 'disabled',
          destValue: [false, undefined]
        }
      ],
      label: '请求参数',
      value: 'requestParams',
      type: 'textarea'
    },
    {
      use: ['column'],
      rules: [
        {
          originValue: 'disabled',
          destValue: [false, undefined]
        }
      ],
      label: '刷新table',
      value: 'refreshTable',
      type: 'switch'
    },
    {
      use: ['column'],
      label: '显示条件',
      value: 'showCondition',
      type: 'monaco'
    },
    ...formItem
  ],
  time: [
    {
      label: '占位提示文本',
      value: 'placeholder',
      type: 'input'
    },
    {
      label: '可清除',
      value: 'clearable',
      type: 'switch'
    },
    {
      label: '禁用',
      value: 'disabled',
      type: 'switch'
    },
    ...formItem
  ],
  monaco: [
    {
      label: '语言',
      value: 'language',
      type: 'select',
      children: [
        {
          label: 'json',
          value: 'json'
        },
        {
          label: 'javascript',
          value: 'javascript'
        },
        {
          label: 'mysql',
          value: 'mysql'
        },
        {
          label: 'java',
          value: 'java'
        },
        {
          label: 'python',
          value: 'python'
        },
        {
          label: 'shell',
          value: 'shell'
        }
      ]
    },
    {
      label: '宽度',
      value: 'width',
      type: 'input'
    },
    {
      label: '高度',
      value: 'height',
      type: 'input'
    },
    ...formItem
  ]
}

export default propertyTemplate
