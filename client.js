window.__ModuleLoader__.load({
  id: 'dsh-today',
  factory: (require) => {
    const module = { exports: {} }
    const React = require('react')
    const h = React.createElement

    const css = [
      /* Match dsh-mobile-plus `.mp-trigger`: one quiet 36px logo on the Settings row. */
      '.dsh-today{position:relative;flex:none;display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border:none;border-radius:50%;padding:0;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;transition:background-color 120ms ease,color 120ms ease,box-shadow 120ms ease}',
      '[class*="_footArea"]:has(.dsh-today-wide){flex-direction:row;align-items:center;gap:4px}',
      '[class*="_footArea"]:has(.dsh-today-wide) [class*="_settingsArea"]{flex:1 1 auto;width:auto;min-width:0}',
      '[class*="_footArea"]:has(.dsh-today-wide) [class*="_footerActions"]{order:2;flex:none;width:auto;align-items:center;justify-content:flex-end}',
      '.dsh-today:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}',
      '.dsh-today:active:not(:disabled){background:var(--dsw-alias-interactive-bg-active)}',
      '.dsh-today:focus-visible{outline:none;box-shadow:0 0 0 2px var(--dsw-alias-bg-layer-2),0 0 0 4px var(--dsw-alias-brand-primary)}',
      '.dsh-today:disabled{opacity:.5;cursor:default}',
      '.dsh-today svg{display:block;flex:none}',
      '.dsh-today-err{position:absolute;left:8px;right:8px;bottom:48px;padding:6px 8px;border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-state-error-primary);font-size:12px;line-height:18px;box-shadow:var(--dsw-shadow-lv2)}',
      '@media (prefers-reduced-motion: reduce){.dsh-today{transition:none}}',
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

    /** Calendar with today's cell filled — no label, same stroke language as the phone logo. */
    function IconToday({ size = 18 }) {
      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 16 16',
        fill: 'none',
        'aria-hidden': 'true',
      },
        h('rect', { x: 2.5, y: 3.5, width: 11, height: 10, rx: 1.5, stroke: 'currentColor', strokeWidth: 1.25 }),
        h('path', { d: 'M2.5 6.5h11', stroke: 'currentColor', strokeWidth: 1.25 }),
        h('path', { d: 'M5.5 2.5v2M10.5 2.5v2', stroke: 'currentColor', strokeWidth: 1.25, strokeLinecap: 'round' }),
        h('rect', { x: 6.25, y: 8.5, width: 3.5, height: 3.5, rx: 0.6, fill: 'currentColor' }))
    }

    function TodayButton({ wide, workspaces }) {
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
          title: busy ? '正在打开今天的工作区' : '打开今天的工作区',
          'aria-label': busy ? '正在打开今天的工作区' : '打开今天的工作区',
          onClick: () => { void openToday() },
        }, h(IconToday, { size: 18 })),
        error ? h('p', { className: 'dsh-today-err', role: 'alert' }, [error]) : null)
    }

    const inject = ['slots', 'workspaces']

    function apply(ctx) {
      ctx.slots.inject('sidebar.footer.action', () => {
        let dispose
        try {
          dispose = ctx.slots.register({ name: 'sidebar.footer.action', id: 'dsh-today' }, (props) =>
            h(TodayButton, { wide: props && props.wide, workspaces: ctx.workspaces }))
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
