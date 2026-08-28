window.__ModuleLoader__.load({
  id: 'dsh-today',
  factory: (require) => {
    const module = { exports: {} }
    const React = require('react')
    const h = React.createElement

    const css = [
      '.dsh-today{appearance:none;display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:32px;padding:0 10px;border:none;border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:13px;line-height:20px;cursor:pointer}',
      '.dsh-today:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}',
      '.dsh-today:disabled{opacity:.55;cursor:default}',
      '.dsh-today-icon{display:block;flex:none}',
      '.dsh-today-wide{width:100%;justify-content:flex-start;padding:6px 10px}',
      '.dsh-today-err{position:absolute;left:8px;right:8px;bottom:48px;padding:6px 8px;border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-state-error-primary);font-size:12px;line-height:18px;box-shadow:var(--dsw-shadow-lv2)}',
    ].join('')

    if (typeof document !== 'undefined') {
      const id = 'dsh-today/ui.css'
      let tag = document.querySelector('style[data-plugin-css=' + JSON.stringify(id) + ']')
      if (tag === null) {
        tag = document.createElement('style')
        tag.dataset.plugin = 'dsh-today'
        tag.dataset.pluginCss = id
        document.head.appendChild(tag)
      }
      tag.textContent = css
    }

    function IconCalendar({ size = 16 }) {
      return h('svg', {
        className: 'dsh-today-icon',
        width: size,
        height: size,
        viewBox: '0 0 16 16',
        fill: 'none',
        'aria-hidden': 'true',
      },
        h('rect', { x: 2.5, y: 3.5, width: 11, height: 10, rx: 1.5, stroke: 'currentColor', strokeWidth: 1.25 }),
        h('path', { d: 'M2.5 6.5h11', stroke: 'currentColor', strokeWidth: 1.25 }),
        h('path', { d: 'M5.5 2.5v2M10.5 2.5v2', stroke: 'currentColor', strokeWidth: 1.25, strokeLinecap: 'round' }))
    }

    function TodayButton({ wide, workspaces, sessions }) {
      const [busy, setBusy] = React.useState(false)
      const [error, setError] = React.useState('')

      async function openToday() {
        if (busy) return
        setBusy(true)
        setError('')
        try {
          const res = await fetch('/dsh-today/open', { method: 'POST', credentials: 'same-origin' })
          const data = await res.json()
          if (!res.ok || !data || data.ok !== true || typeof data.path !== 'string') {
            throw new Error((data && data.error) || '无法创建今天的工作区')
          }
          const workspace = await workspaces.create({ path: data.path })
          workspaces.startSession(workspace.workspaceId)
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err))
        } finally {
          setBusy(false)
        }
      }

      return h('div', { style: { display: 'contents' } },
        h('button', {
          type: 'button',
          className: wide === false ? 'dsh-today' : 'dsh-today dsh-today-wide',
          disabled: busy,
          title: '打开今天的工作区（dshspace/days/当天日期）',
          'aria-label': '今天',
          onClick: () => { void openToday() },
        },
          h(IconCalendar, { size: 16 }),
          wide === false ? null : (busy ? '打开中…' : '今天')),
        error ? h('p', { className: 'dsh-today-err', role: 'alert' }, [error]) : null)
    }

    const inject = ['slots', 'workspaces', 'sessions']

    function apply(ctx) {
      ctx.slots.inject('sidebar.footer.action', () => {
        let dispose
        try {
          dispose = ctx.slots.register({ name: 'sidebar.footer.action', id: 'dsh-today' }, (props) =>
            h(TodayButton, { wide: props && props.wide, workspaces: ctx.workspaces, sessions: ctx.sessions }))
        } catch {
          dispose = undefined
        }
        return () => { if (dispose) dispose() }
      })
    }

    module.exports.apply = apply
    module.exports.inject = inject
    return module.exports
  },
})
