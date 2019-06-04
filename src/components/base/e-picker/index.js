import http from '/src/http.js'
import util from '/src/util.js'

let app = getApp()

Component({
  props: {
    model: {},
    // 默认校验函数
    onValidate: (value) => {
      return true
    }
  },

  // 挂载方法
  didMount() {
    this.init(this.props.model)
    this.validate(this.props.model.value)
  },

  // 更新
  didUpdate(prevProps, prevData) {
    // setData后校验
    if (prevProps.model.value !== this.props.model.value) {
      this.validate(this.props.model.value)
    }
    // 搜索条件变化 重新请求选项
    if (JSON.stringify(prevProps.model.options.params) !== JSON.stringify(this.props.model.options.params)) {
      this.initPicker(this.props.model.options)
    }
  },

  methods: {
    // 获取下拉选项
    async initPicker(options) {
      if (!options.url) {
        return
      }
      let res = await http.get({
        url: options.url,
        params: { params: JSON.stringify(options.params) }
      })
      if (res.data.status === 0) {
        let array = `${this.path}.options.array`
        this.$page.$spliceData({
          [array]: [0, this.props.model.options.array.length, ...res.data.items]
        })
      }
    },

    // 输入框点击事件
    handleTap(event) { },

    // 点击选项事件
    handleChange(event) {
      let i = event.detail.value
      let value = `${this.path}.value`
      let index = `${this.path}.options.index`
      this.$page.setData({
        [value]: this.props.model.options.array[i],
        [index]: i
      })
      app.emitter.emit(`${this.props.model.formId}`, this.props.model.key)
    },

    // 补充params的属性
    init(model) {
      // 配置path
      this.path = model.sfi !== undefined ? `bizObj[${model.ci}].children[${model.sfi}][${model.sci}]` : `bizObj[${model.ci}]`
      // picker
      let picker = {
        value: '',
        label: '',
        status: '',
        disabled: false,
        necessary: false,
        placeholder: model.necessary ? '必填' : '',
        notice: model.necessary ? '不能为空' : ''
      }
      // 补全属性
      model.options = Object.assign({
        url: '',
        params: {},
        bindKey: '',
        array: [],
        index: -1,
      }, model.options)
      this.$page.setData({
        [this.path]: Object.assign(picker, model)
      })
      // 初始化完成后请求选项
      this.initPicker(model.options)
    },

    // 校验方法
    validate(value) {
      let result = ''
      if (this.props.model.necessary) {
        if (!value) {
          result = 'error'
        } else {
          result = this.props.onValidate(value) ? 'success' : 'error'
        }
      } else {
        if (!value) {
          result = ''
        } else {
          result = this.props.onValidate(value) ? 'success' : 'error'
        }
      }
      if (this.props.model.status === result) {
        return
      }
      let status = `${this.path}.status`
      this.$page.setData({
        [status]: result
      })
    }
  }
})