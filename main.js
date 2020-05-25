const electron = require('electron');
const url = require('url');
const path = require("path");
const { code, code2, code3 } = require('./encrypter')
const fs = require('fs');
const SimpleStore = require('./simplestore')
const {generateApprovedPassword, initDictionary, generateMnemonic} = require('./generation.js');

var test = code.encrypt("START PW LIST", "1");
console.log(test);
console.log(code.decrypt("U2FsdGVkX18H3CigDuSLgK820vylWM/KHRarqXYCOqc=","1"));

// SET ENV
process.env.NODE_ENV = 'development';

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
	//Tutorial
    const fileLocation = path.join((electron.app || electron.remote.app).getPath('userData'),'passwords.json');
	console.log(fileLocation);
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
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	Menu.setApplicationMenu(mainMenu);

    // Menu.setApplicationMenu(null);
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

ipcMain.on('password:add', function (e, username, website, userSeed) {
	//generate pass and send to mainWindow
	initDictionary();
	let password;
	if (userSeed !== null) {
		password = generateApprovedPassword(15, userSeed, [0, 1, 2, 3]);
	} else {
		password = generateApprovedPassword(15, seed.getSeed(), [0, 1, 2, 3]);
	}
	const mnemonic = generateMnemonic(password);
	console.log("Password generated");
	mainWindow.webContents.send('password:add', username, website, password, mnemonic);
	console.log("Sent contents to mainWindow");
    addWindow.close();
});

ipcMain.on("addPasswordWindow:open", function (e) {
    createAddWindow();
})

ipcMain.on('masterpass:set', function (e, mp, s) {
    masterpass = mp;
	seed = new SimpleStore({configName: "seed", key: mp, seed: s});
	mainWindow.webContents.send("create-JSON", masterpass);
	console.log("create-JSON request sent to mainWindow");
    tutorialWindow.close();
})

ipcMain.on("login", function (e, mp){
	mainWindow.webContents.send("request-JSON", mp);
	console.log("Sent a request for JSON from main.js to mainWindow.html");
	ipcMain.on("JSON", function (e, store) {
		console.log("JSON received from mainWindow");
		console.log("String to decrypt: " + store + "\npassword entered: " +
			mp + "\ndecrypt attempt:\n" + code.decrypt(store, mp));
		if ("START PW LIST" == code2.decrypt(store, mp)) {
			loginWindow.close();
			console.log("Login Success");
		//Build menu from template
		// const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
		// Menu.setApplicationMenu(mainMenu);
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