//@ts-check
const electron = require('electron')
const fs = require('fs');
const pug = require('pug')
const setupPug = require('electron-pug');
const locals = {};
const protocol = electron.protocol;

const app = electron.app
const BrowserWindow = electron.BrowserWindow

async function createWindow () {

  try {
    let pug = await setupPug({pretty: true}, locals)
    pug.on('error', err => console.error('electron-pug error', err))
  } catch (err) {
    // Could not initiate 'electron-pug'
  }
 

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadURL(`file://${__dirname}/views/index.pug`);
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
