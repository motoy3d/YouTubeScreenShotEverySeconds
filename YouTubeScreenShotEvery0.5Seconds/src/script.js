// スクリーンショットのサイズ TODO: オプション画面で設定できるとよい
SCREENSHOT_WIDTH = 320
SCREENSHOT_HEIGHT = 180
// 最大秒数
MAX_SECONDS = 180

window.onload = () => {
  // 読み込みが完了してないときがあるので2秒後に実行
  let timer = setInterval(() => {
    const path = location.pathname
    const trg = document.getElementById('player')
    const ui = document.getElementById('screenshot-ui')
    if (path === '/watch' && trg != null && ui == null) {
      clearInterval(timer)
      setCurrentTimeHtml()
    }
  }, 3000)
}

const setCurrentTimeHtml = () => {
  const screenshotButton = document.createElement('button')
  screenshotButton.id = 'screenshot'
  screenshotButton.textContent = '📸'
  screenshotButton.title = 'スクリーンショット'
  const outer = document.createElement('div')
  const inner = document.createElement('div')
  outer.id = 'screenshot-ui'
  inner.prepend(screenshotButton)
  outer.prepend(inner)
  document.querySelector('.ytp-right-controls').prepend(outer)
  document.getElementById('screenshot-ui').onselectstart = () => false
  document.getElementById('screenshot').onclick = () => {
    (async () => {
      const sleep = (second) => new Promise(resolve => setTimeout(resolve, second * 1000))
      for (let i = 0; i < Math.min(getVideoDuration() * 2, MAX_SECONDS * 2); i++) {
        setCurrentTime(i * 0.5) // 0.5秒ごと
        await sleep(2)
        getScreenshot()
        await sleep(1)
      }
    })()
  }
}

const getVideoDuration = () => {
  const video = document.querySelector('.video-stream')
  return video.duration
}

const setCurrentTime = (time) => {
  const video = document.querySelector('.video-stream')
  video.currentTime = time
}

const getScreenshot = () => {
  const zeroPadding = value => value < 10 ? String(`0${value}`) : String(value)
  const a = document.createElement('a')
  const canvas = document.createElement('canvas')
  const video = document.querySelector('.video-stream')
  video.pause()
  const title = (() => {
    const e = document.querySelector('#container > h1')
    if (e !== null) return e.innerText
    return ''
  })()
  const sa = ((video.currentTime % 60) % 60).toFixed(2).split('.')
  const ms = zeroPadding(Number(sa[1]))
  const s = zeroPadding(Number(sa[0]))
  const m = zeroPadding(Math.floor((video.currentTime / 60) % 60))
  const h = zeroPadding(Math.floor(video.currentTime / 3600))
  a.download = `${title} ${s}.${ms}.png`
  canvas.width = SCREENSHOT_WIDTH
  canvas.height = SCREENSHOT_HEIGHT
  canvas.getContext('2d').drawImage(
      video, 0, 0, video.videoWidth, video.videoHeight,
      0, 0, SCREENSHOT_WIDTH, SCREENSHOT_HEIGHT)
  canvas.toBlob((b) => {
    a.href = URL.createObjectURL(b)
    a.click()
  }, 'image/png')
}