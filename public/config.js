'use strict';
const Store = require('electron-store');


const schema = {
	alwaysOnTop: {
		type: 'boolean'
	},
	darkMode: {
		type: 'boolean',
		default: false
	},
	lastWindowState: {
		type: 'object',
		properties: {
			x: { type: 'number' },
			y: { type: 'number' },
			width: { type: 'number' },
			height: { type: 'number' },
			isMaximized: { type: 'boolean' }
		},
		default: {
			x: undefined,
			y: undefined,
			width: 600,
			height: 400,
			isMaximized: false
		}
	},
	autoHideMenuBar: {
		type: 'boolean',
		default: false
	},
	quitOnWindowClose: {
		type: 'boolean',
		default: false
	},
}
module.exports = new Store({schema});
