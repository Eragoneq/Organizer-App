const electron = require('electron')
const fs = require('fs')
const ElectronViewRenderer = require('electron-view-renderer')
const pug = require('pug')

const app = electron.app
const BrowserWindow = electron.BrowserWindow

const viewRenderer = new ElectronViewRenderer({
    viewPath: 'views',
    viewProtcolName: 'view',
    useAssets: true,
    assetsPath: 'assets',
    assetsProtocolName: 'asset',
})

viewRenderer.add('pug', {
extension: '.pug',
viewPath: 'views',
rendererAction: (filePath, viewData, callback) => {
    pug.renderFile(filePath, viewData, (error, html) => {
    if (error) {
        if (error.file) error.message += `\n\nERROR @(${error.file}:${error.line}:${error.column})`
        throw new Error(error)
    }

    callback(html)
    })
}
})

viewRenderer.use('pug')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  const viewOptions = {date: new Date().getDay()}
  viewRenderer.load(win, 'index', viewOptions)

  win.webContents.openDevTools()
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
