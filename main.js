const electron = require('electron');
const url = require('url');
const path = require("path");
const { code, code2, code3 } = require('./encrypter')
const fs = require('fs');
const SimpleStore = require('./simplestore')
const {generateApprovedPassword, initDictionary, generateMnemonic} = require('./generation.js');

// SET ENV
process.env.NODE_ENV = 'dev';

const{app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;
let tutorialWindow;
let masterpass = '';
let seed;

// Listen for app to be ready
app.on('ready', function () {
	mainWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true
		}
	});
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'mainWindow.html'),
		protocol: "file:",
		slashes: true
	}));
	mainWindow.on('closed', function () {
		app.quit();
	});
	mainWindow.webContents.on('new-window', function(e, url) {
		e.preventDefault();
		require('electron').shell.openExternal(url);
	});
	//Tutorial
    const fileLocation = path.join((electron.app || electron.remote.app).getPath('userData'),'passwords.json');
	if (!fs.existsSync(fileLocation)) {
        // Running for the first time.
        tutorialWindow = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true
            }
        });
        tutorialWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'tutorial.html'),
            protocol:"file:",
            slashes:true
        }));
        tutorialWindow.on('close', function () {
            tutorialWindow = null;
        })
	} else {
		loginWindow = new BrowserWindow({
			webPreferences: {
				nodeIntegration: true
			}
		});
		loginWindow.loadURL(url.format({
			pathname: path.join(__dirname, 'masterpass.html'),
			protocol: "file:",
			slashes: true
		}));
		loginWindow.on('close', function () {
            loginWindow = null;
        })
	}

    Menu.setApplicationMenu(null);
});

// Handle create add window
function createAddWindow() {
    //Create a window
    addWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 500,
        height: 400,
        title: 'Add Password'
	});
    // Load html into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol:"file:",
        slashes:true
    }));
    // Garbage collection handle
    addWindow.on('close', function () {
        addWindow = null;
        try {
            mainWindow.webContents.send('data:add', store);
        } catch (error){}
	})

}

ipcMain.on('password:add', function (e, username, website, userSeed, userPass) {
	//generate pass and send to mainWindow
	initDictionary();
	let password;
	if (userPass == '') { 
		if (userSeed !== null) {
			password = generateApprovedPassword(15, userSeed, [0, 1, 2, 3]);
		} else {
			password = generateApprovedPassword(15, seed.getSeed(), [0, 1, 2, 3]);
			}
	} else {
		password = userPass;
	}
	const mnemonic = generateMnemonic(password);
	if (mnemonic == -1) {
		mnemonic = '';
	}
	mainWindow.webContents.send('password:add', username, website, password, mnemonic);
    addWindow.close();
});

ipcMain.on("addPasswordWindow:open", function (e) {
    createAddWindow();
})

ipcMain.on('masterpass:set', function (e, mp, s) {
    masterpass = mp;
	seed = new SimpleStore({configName: "seed", key: mp, seed: s});
	mainWindow.webContents.send("create-JSON", masterpass);
    tutorialWindow.close();
})

ipcMain.on("login", function (e, mp){
	mainWindow.webContents.send("request-JSON", mp);
	ipcMain.on("JSON", function (e, store) {
		if ("START PW LIST" == code2.decrypt(store, mp)) {
			loginWindow.close();
		// Build menu from template
		const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
		Menu.setApplicationMenu(mainMenu);
    	}
	});
});

//Create menu template
const mainMenuTemplate = [
    {
    label:'File',
    submenu:[
        {
            label: 'Add Password',
            accelerator: process.platform == 'darwin' ? 'Command + N' : 'Ctrl+N',
            click() {
                createAddWindow();
            }
        },
        {
            label: 'Clear Passwords',

            accelerator: process.platform == 'darwin' ? 'Command + D' : 'Ctrl+D',
            click() {
                mainWindow.webContents.send('password:clear')
            }
        },
        {
            label: 'Quit',
            accelerator: process.platform == 'darwin' ? 'Command + Q' : 'Ctrl+Q',
            click() {
                app.quit();
            }
        }
    ]
    }
];

// If mac, add empty object to menu
if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

// Add dev tools items if not in production
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push(
        {
            label: 'Developer Tools',
            submenu: [
                {
                    label: 'Toggle DevTools', 
                    accelerator: process.platform == 'darwin' ? 'Command + I' : 'Ctrl+I',
                    click(item, focusedWindow) {
                        focusedWindow.toggleDevTools();
                    }
                },
                {
                    role: 'reload'
                }
            ]
        }
    )
}