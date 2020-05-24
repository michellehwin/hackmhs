const electron = require('electron');
const url = require('url');
const path = require("path");
const generateApprovedPassword = require('./generation.js');

// SET ENV
process.env.NODE_ENV = 'development';

const{app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;
let tutorialWindow;
let masterpass = '1234';
let auth = false;

// Listen for app to be ready
app.on('ready', function () {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'masterpass.html'),
        protocol: "file:",
        slashes: true
    }));
    mainWindow.on('closed', function () {
        app.quit();
    });
    //Tutorial
    if (masterpass == '') {
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
        height: 300,
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
        mainWindow.webContents.send('data:add', store);
    })
}

ipcMain.on('password:add', function (e, username, website) {
    //generate pass and send to mainWindow
    const password = generateApprovedPassword(10, 'placeholder', [0, 1, 2]);
    mainWindow.webContents.send('password:add', username, website, password);
    addWindow.close();
});

ipcMain.on('masterpass:set', function (e, mp) {
    masterpass = mp;
    tutorialWindow.close();
})

ipcMain.on("login", function(e, mp){
    if (mp == masterpass) {
        console.log(true);
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'mainWindow.html'),
            protocol: "file:",
            slashes: true
        }));
        //Build menu from template
        const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
        Menu.setApplicationMenu(mainMenu);
        console.log("logged in");
    }
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
