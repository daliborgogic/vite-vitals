export const transformer = options => ({
  apply: 'post',
  transform({ code, isBuild }) {
    if (!isBuild) return code

    return code.replace('</body>', `<script defer type="module">
  const KEY = 'ga:user'
  const UID = (localStorage[KEY] = localStorage[KEY] || Math.random() + '.' + Math.random())
  const onError = err => console.error('[vite vitals] ', err) 
  const onDebug = (label, payload) => console.log('[vite vitals] ', label, payload) 

  function sendToAnalytics (fullPath, metric) {
    const { name, delta, id, entries } = metric
    const opts = {
      ec: '${options.eventCategory || 'Vite Vitals'}',
      ea: name,
      dh: document.location.hostname,
      el: id,
      ev: parseInt(delta),
      dp: fullPath,
      ni: true
    }
    
    if (name === 'TTFB') opts.ev = parseInt(delta - entries[0].requestStart)
    
    const args = { tid: '${options.trackingID}', cid: UID, ...opts }
    const obj = { t: 'event', ...args, ...opts, z: Date.now() }

    const blob = new Blob([new URLSearchParams(obj).toString()], {
      type: 'application/x-www-form-urlencoded'
    })

    const url = 'https://www.google-analytics.com/collect?v=1'
    
    const debug = ${options.debug}
    
    if (debug) onDebug(name, JSON.stringify(obj, null, 2))
      
    ;(navigator.sendBeacon && navigator.sendBeacon(url, blob)) ||
      fetch(url, { 
        body: blob,
        method: 'POST', 
        credentials: 'omit',
        keepalive: true 
      })
  }
  async function webVitals (fullPath) {
    try {
      const { getCLS, getFID, getLCP, getTTFB, getFCP } = await import('https://unpkg.com/web-vitals@0.2.4/dist/web-vitals.es5.min.js?module')
      getFID(metric => sendToAnalytics(fullPath, metric))
      getTTFB(metric => sendToAnalytics(fullPath, metric))
      getLCP(metric => sendToAnalytics(fullPath, metric))
      getCLS(metric => sendToAnalytics(fullPath, metric))
      getFCP(metric => sendToAnalytics(fullPath, metric))
    } catch (err) {
      onError(err)
    }
  }
  webVitals(document.location.pathname + document.location.search)
</script></body>`)
  }
})

export default function (opts) {
  return { 
    indexHtmlTransforms: [transformer(opts)]
  }
}