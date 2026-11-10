// 财务自由 · 浏览器半边
//   - 侧栏加一个「财务自由」入口，主区域是资料库页面（/finance/，iframe）
window.__ModuleLoader__.load({
  id: 'dsh-finance',
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })

    const React = require('react')
    const h = React.createElement
    const PANEL = 'finance'
    const SRC = '/finance/'

    function FinanceIcon(props) {
      const s = (props && props.size) || 18
      return h('svg', { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' },
        h('path', { d: 'M3 17l6-6 4 4 8-8' }),
        h('path', { d: 'M15 7h6v6' }))
    }

    function apply(ctx) {
      function FinancePanel() {
        return h('iframe', { src: SRC, title: '财务自由', style: { width: '100%', height: '100%', border: 0, display: 'block' } })
      }
      ctx.slots.inject('sidebar.panellist', () =>
        ctx.slots.register({ name: 'sidebar.panellist', id: PANEL, order: 6, label: () => '财务自由' }, FinanceIcon))
      ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: PANEL }, FinancePanel))
    }

    exports.isPlugin = true
    exports.inject = ['slots']
    exports.apply = apply
    return module.exports
  },
})
