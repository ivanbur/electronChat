const electron             = require('electron');
const {app, BrowserWindow} = electron;
const ipc                  = electron.ipcRenderer;
const path                 = require('path');
require('electron-reload')(__dirname); // allows it reload autmoatically when you make changes

console.log('testing');

var mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1080,
		height: 840,
		webPreferences: {
			nodeIntegration: true
		},
		useContentSize: true
	});

	mainWindow.loadFile('./templates/index.html');

	console.log(mainWindow.getSize());

	mainWindow.on('close', function() {
		mainWindow = null;
		console.log('window closed');
	})
}

app.on('ready', createWindow);

app.on('window-all-closed', function() {
	if (process.platform != 'darwin') { // darwin means mac
		app.quit();
	}
})

function testClick() {
	console.log('button clicked');
}

