'use strict';
const path = require('path');
const url = require('url')
const { app, BrowserWindow, Menu, ipcMain, dialog, globalShortcut } = require('electron');
const {autoUpdater} = require('electron-updater');
const { is } = require('electron-util');
const unhandled = require('electron-unhandled');
const debug = require('electron-debug');
const contextMenu = require('electron-context-menu');
const config = require('./config');
const menu = require('./menu');
const voxelizerIconPath = require('./constants');
const fs = require('fs');

unhandled();
debug();
contextMenu();

app.setAppUserModelId('com.andrestorhaug.voxelizer');

 if (!is.development) {
 	const FOUR_HOURS = 1000 * 60 * 60 * 4;
 	setInterval(() => {
 		autoUpdater.checkForUpdates();
 	}, FOUR_HOURS);

 	autoUpdater.checkForUpdates();
 }

// Prevent window from being garbage collected
let mainWindow;
let isQuitting = false;

const installExtensions = async () => {
	const installer = require('electron-devtools-installer');
	const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
	const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

	return Promise.all(
		extensions.map(name => installer.default(installer[name], forceDownload))
	).catch(console.log);
};

const createMainWindow = async () => {
	if (is.development) {
		await installExtensions();
	}

	const lastWindowState = config.get('lastWindowState');
	const isDarkMode = config.get('darkMode');

	const win = new BrowserWindow({
		title: app.name,
		show: false,
		x: lastWindowState.x,
		y: lastWindowState.y,
		width: lastWindowState.width,
		height: lastWindowState.height,
		icon: is.linux ? voxelizerIconPath : undefined,
		minWidth: 600,
		minHeight: 400,
		alwaysOnTop: config.get('alwaysOnTop'),
		//titleBarStyle: 'hiddenInset',
		autoHideMenuBar: config.get('autoHideMenuBar'),
		darkTheme: isDarkMode,

		webPreferences: {
			nodeIntegration: false, // is default value after Electron v5
			contextIsolation: true, // protect against prototype pollution
			enableRemoteModule: false, // turn off remote
			preload: __dirname + '/preload.js'
		}
	});

	win.on('ready-to-show', () => {
		win.show();
	});

	win.on('closed', () => {
		// Dereference the window
		// For multiple windows store them in an array
		mainWindow = undefined;
	});

	//await win.loadFile(path.join(__dirname, 'index.html'));
	await win.loadURL(
		process.env.ELECTRON_START_URL ||
		url.format({
			pathname: path.join(__dirname, 'index.html'),
			protocol: 'file:',
			slashes: true
		})
	)

	win.on('close', event => {
		if (config.get('quitOnWindowClose')) {
			app.quit();
			return;
		}

		// Workaround for https://github.com/electron/electron/issues/20263
		// Closing the app window when on full screen leaves a black screen
		// Exit fullscreen before closing
		if (is.macos && mainWindow.isFullScreen()) {
			mainWindow.once('leave-full-screen', () => {
				mainWindow.hide();
			});
			mainWindow.setFullScreen(false);
		}

		if (!isQuitting) {
			event.preventDefault();

			// Workaround for https://github.com/electron/electron/issues/10023
			win.blur();
			if (is.macos) {
				// On macOS we're using `app.hide()` in order to focus the previous window correctly
				app.hide();
			} else {
				win.hide();
			}
		}
	});

	win.on('resize', () => {
		const { isMaximized } = config.get('lastWindowState');
		config.set('lastWindowState', { ...win.getNormalBounds(), isMaximized });
	});

	win.on('maximize', () => {
		config.set('lastWindowState.isMaximized', true);
	});

	win.on('unmaximize', () => {
		config.set('lastWindowState.isMaximized', false);
	});


	// Disable browser window reloading
	win.on('focus', () => {
		globalShortcut.registerAll(['CommandOrControl+R','F5'], () => {})
	});
	win.on('blur', () => {
		globalShortcut.unregisterAll()
	});

	return win;
};

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
	app.quit();
}

app.on('second-instance', () => {
	if (mainWindow) {
		if (mainWindow.isMinimized()) {
			mainWindow.restore();
		}

		mainWindow.show();
	}
});

app.on('window-all-closed', () => {
	if (!is.macos) {
		app.quit();
	}
});

app.on('activate', async () => {
	if (!mainWindow) {
		mainWindow = await createMainWindow();
	}
});

app.on('before-quit', () => {
	isQuitting = true;

	// Checking whether the window exists to work around an Electron race issue:
	// https://github.com/sindresorhus/caprine/issues/809
	if (mainWindow) {
		const { isMaximized } = config.get('lastWindowState');
		config.set('lastWindowState', { ...mainWindow.getNormalBounds(), isMaximized });
	}
});

(async () => {
	await app.whenReady();
	Menu.setApplicationMenu(menu);
	mainWindow = await createMainWindow();
	//const favoriteAnimal = config.get('favoriteAnimal');
	//mainWindow.webContents.executeJavaScript(`document.querySelector('header p').textContent = 'Your favorite animal is ${favoriteAnimal}'`);

})();


ipcMain.handle('APP_GET_LOCALE', (event, ...args) => {
	let locale = app.getLocale();
	return locale;
});

ipcMain.on('APP_ALERT', (event, title, message) => {
	dialog.showMessageBox(mainWindow, {
		title: title,
		buttons: ['Dismiss'],
		type: 'warning',
		message: message,
	});
});

ipcMain.on('APP_SAVE_FILE', (event, data, type) => {

	let filters = [{
		name: "voxels",
		extensions: [type]
	}]

	dialog.showSaveDialog(mainWindow, { filters }).then((result) => {

		let filename = result.filePath;
		fs.writeFile(filename, data, (err) => {
			if (err) {
				dialog.showMessageBox(mainWindow, {
					title: 'File exporting error',
					buttons: ['Dismiss'],
					type: 'error',
					message: 'The file was not sucessfully exported.',
				});
				return;
			}
		});
	}).catch(err => {
		dialog.showMessageBox(mainWindow, {
			type: 'error',
			message: err,
		});
	});
});
