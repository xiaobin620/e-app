import util from '/src/libs/util.js'
import validate from '../mixins/validate.js'

Component({
  // 混合校验
  mixins: [validate],
  // 接收参数
  props: {
    model: {},
    // 默认校验方法
    onValidate: (value) => {
      return true
    }
  },
  // 挂载
  didMount() {
    this.init(this.props.model)
  },
  // 更新
  didUpdate(prevProps, prevData) {
    // value变化时校验
    if (prevProps.model.value !== this.props.model.value) {
      this.validate(this.props.model.value)
    }
  },

  methods: {
    // 清空
    clear() {
      if (this.props.model.disabled && !this.props.model.gps) {
        return
      }
      let value = `${this.path}.value`
      this.$page.setData({
        [value]: ''
      })
    },
    // 定位方法
    position() {
      if (this.props.model.gps === false) {
        return
      }
      dd.getLocation({
        type: 2,
        success: (res) => {
          let location = `${this.path}.location`
          let value = `${this.path}.value`
          this.$page.setData({
            [location]: res,
            [value]: res.address
          })
        },
        fail: (err) => {
          util.ddToast({ type: 'fail', text: '自动定位失败，请手动定位或输入地址' })
          console.error(err)
        }
      })
    },

    // 输入事件同步value
    handleInput: util.debounce(function(event) {
      let value = `${this.path}.value`
      this.$page.setData({
        [value]: event.detail.value
      })
    }, 500),

    // 设置焦点
    handleTap() {
      if (this.props.model.disabled && !this.props.model.value) {
        this.position()
      }
      let focus = `${this.path}.focus`
      this.$page.setData({
        [focus]: true
      })
    },

    // 手机键盘确认事件
    handleConfirm(event) { },

    // 获取焦点
    handleFocus(event) { },

    // 失去焦点
    handleBlur(event) {
      let focus = `${this.path}.focus`
      this.$page.setData({
        [focus]: false
      })
    },

    // 初始化model的属性
    init(model) {
      // 配置path
      this.path = model.path !== undefined ? model.path : ''
      if (model.sfi !== undefined) {
        this.path = `bizObj[${model.ci}].children[${model.sfi}][${model.sci}]`
      } else if (model.ci !== undefined) {
        this.path = `bizObj[${model.ci}]`
      }
      // address对象
      let address = {
        gps: true, // 能否定位
        value: '',
        label: '',
        status: '',
        focus: false,
        location: {},
        maxlength: 200,
        disabled: true,
        necessary: false,
        placeholder: model.necessary ? '必填' : '',
        notice: model.necessary ? '不能为空' : ''
      }
      // 补全属性
      this.$page.setData({
        [this.path]: Object.assign(address, model)
      })
      // 有默认值时不主动定位
      if (model.value) {
        return
      }
      // 定位
      this.position()
    }
  }
})