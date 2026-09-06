const { app, BrowserWindow } = require('electron')
const path = require('node:path')

const isDevelopment = !app.isPackaged

function createWindow() {
  const window = new BrowserWindow({
    width: 900,
    height: 680,
    minWidth: 640,
    minHeight: 480,
    title: 'NoteDrop',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  window.loadURL(
    isDevelopment
      ? 'http://localhost:5173'
      : `file://${path.join(__dirname, '../dist/index.html')}`,
  )
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
