'use strict';
const electron = require('electron');

const app = electron.app;

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 600,
		height: 400
	});

	win.loadURL(`file://${__dirname}/index.html`);
	win.on('closed', onClosed);

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
});


const { ipcMain } = require('electron');

const drivelist = require('drivelist');
const fs = require('fs');
const path = require("path");
const util = require('util');

ipcMain.on('api/drive/list-all', (event, item) => {
  if (item && item.isDirectory) {
    fs.readdir(item.path, (error, paths) => {
      if (error) throw error;
      let otherItems = [];
      let dirItems = [];
      paths.forEach(pathDir => {
        const fullDir = path.join(item.path, pathDir);
        try {
          const stats = fs.statSync(fullDir);
          let newItem = {
            name: pathDir,
            path: fullDir,
            isFile: stats.isFile(),
            isDirectory: stats.isDirectory(),
            isBlockDevice: stats.isBlockDevice(),
            isFIFO: stats.isFIFO(),
            isSocket: stats.isSocket()
          };
          if (newItem.isDirectory) {
            dirItems.push(newItem);
          } else {
            otherItems.push(newItem);
          }
        } catch (e) {
        }
      });
      event.sender.send('api/drive/list-all$', dirItems.concat(otherItems));
    });
  } else {
    drivelist.list((error, drives) => {
      if (error) throw error;
      const points = drives[0].mountpoints;
      const items = [];
      for (let point of points) {
        items.push({
          name: path.join(point.path, "/"),
          path: path.join(point.path, "/"),
          isDirectory: true
        });
      }
      event.sender.send('api/drive/list-all$', items);
    });
  }
})
