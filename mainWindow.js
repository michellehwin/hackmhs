const electron = require('electron');
const { ipcRenderer } = electron;
const Store = require('./store.js');

var store;

const passContainer = document.getElementById("passList");
document.getElementById("add-password").addEventListener("click", function(){
    ipcRenderer.send("addPasswordWindow:open");
})

console.log("Main window loaded");

ipcRenderer.on("create-JSON", function (e, mp, s) {
    console.log("create-JSON request received");
    console.log("userinput" + mp);
    store = new Store({ configName: 'passwords', key: mp, seed: s});
    console.log("store object created " + store.getData());
});

ipcRenderer.on("request-JSON", function (e, mp) {
    store = new Store({ configName: 'passwords', key: mp });
    console.log(store);
    console.log("Sent JSON to main.js:\n" + store.getCheck());
    ipcRenderer.send("JSON", store.getCheck());
    dataAdd(store);
});


function dataAdd(store) {
    for (var i=0; i < store.arrLength(); i++) {
        createDiv(
            store.getData()[i].username,
            store.getData()[i].website, 
            store.getData()[i].password,
            store.getData()[i].mnemonic
        );
        console.log("Div created with: " + store.getData()[i].username + " "
        + store.getData()[i].website + " " + store.getData()[i].password + " " + store.getData()[i].mnemonic);
    }
};

ipcRenderer.on('password:add', function(e,username, website, password, mnemonic){
    //create div that contains ul of username, site, and password
    const div = document.createElement('div');
    div.className = "row m-3";
    const ul = document.createElement('ul');
    ul.className = "pt-3"
    const usernameText = document.createTextNode("Username: " + username);
    const websiteText = document.createTextNode(website);
    const passwordText = document.createTextNode("Your password: " + password);
    const mnemonicText = document.createTextNode(mnemonic);
    const usernameLI = document.createElement("li");
    const websiteh3 = document.createElement("h3")
    const websiteLI = document.createElement("li");
    const mnemonicLI = document.createElement("li");
    const passwordLI = document.createElement("li");
    usernameLI.appendChild(usernameText);
    websiteh3.appendChild(websiteText);
    websiteLI.appendChild(websiteh3);
    mnemonicLI.appendChild(mnemonicText);
    passwordLI.appendChild(passwordText);
    ul.appendChild(websiteLI);
    ul.appendChild(usernameLI);
    ul.appendChild(passwordLI);
    ul.appendChild(mnemonicLI);
    div.appendChild(ul);
    passContainer.appendChild(div);            
    store.add(website, username, password, mnemonic);
});

ipcRenderer.on('password:clear', function(){
    passContainer.innerHTML = '';
    store.clear();
});

function createDiv(username, website, password, mnemonic){
    //create div that contains ul of username, site, and password
    const div = document.createElement('div');
    div.className = "row m-3";
    const ul = document.createElement('ul');
    ul.className = "pt-3";
    const usernameText = document.createTextNode("Username: " + username);
    const websiteText = document.createTextNode(website);
    const passwordText = document.createTextNode("Your password: " + password);
    const mnemonicText = document.createTextNode(mnemonic);
    const usernameLI = document.createElement("li");
    const websiteh3 = document.createElement("h3")
    const websiteLI = document.createElement("li");
    const mnemonicLI = document.createElement("li");
    const passwordLI = document.createElement("li");
    usernameLI.appendChild(usernameText);
    websiteh3.appendChild(websiteText);
    websiteLI.appendChild(websiteh3);
    mnemonicLI.appendChild(mnemonicText);
    passwordLI.appendChild(passwordText);
    ul.appendChild(websiteLI);
    ul.appendChild(usernameLI);
    ul.appendChild(passwordLI);
    ul.appendChild(mnemonicLI);
    div.appendChild(ul);
    passContainer.appendChild(div);            
}

//Remove Item FIXTHIS
// ul.addEventListener('dblclick', removeItem);

function removeItem(e) {
    e.target.remove();
}
