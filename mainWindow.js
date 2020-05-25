const electron = require('electron');
const {ipcRenderer} = electron;
const Store = require('./store.js');
var store;

console.log("Main window loaded");
store = new Store({ configName: 'passwords'});

ipcRenderer.on("create-JSON", function (e, mp) {
    console.log("create-JSON request received");
    store = new Store({ configName: 'passwords', key: mp });
    console.log("store object created" + store.getData());
    dataAdd(store);
});

ipcRenderer.on("request-JSON", function (e) {
    console.log(store);
    console.log("Sent JSON to main.js" + store.getCheck());
    ipcRenderer.send("JSON", store.getCheck());
});



document.getElementById("add-password").addEventListener("click", function(){
    ipcRenderer.send("addPasswordWindow:open");
})

const passContainer = document.getElementById("passList");

function dataAdd(store) {
    console.log(store.arrLength());
    for (var i=1; i < store.arrLength(); i++) {
        createDiv(
            store.getData()[i].username,
            store.getData()[i].website, 
            store.getData()[i].password
        );
    }
};

ipcRenderer.on('password:add', function(e,username, website, password){
    //create div that contains ul of username, site, and password
    const div = document.createElement('div');
    div.className = "row m-3";
    const ul = document.createElement('ul');
    ul.className = "pt-3"
    const usernameText = document.createTextNode("Username: " + username);
    const websiteText = document.createTextNode(website);
    const passwordText = document.createTextNode("Your password: " + password);
    const usernameLI = document.createElement("li");
    const websiteh3 = document.createElement("h3")
    const websiteLI = document.createElement("li");
    const passwordLI = document.createElement("li");
    usernameLI.appendChild(usernameText);
    websiteh3.appendChild(websiteText);
    websiteLI.appendChild(websiteh3);
    passwordLI.appendChild(passwordText);
    ul.appendChild(websiteLI);
    ul.appendChild(usernameLI);
    ul.appendChild(passwordLI);
    div.appendChild(ul);
    passContainer.appendChild(div);            
    store.add(website, username, password);
});

ipcRenderer.on('password:clear', function(){
    passContainer.innerHTML = '';
    store.clear();
});

function createDiv(username, website, password){
    //create div that contains ul of username, site, and password
    const div = document.createElement('div');
    div.className = "row m-3";
    const ul = document.createElement('ul');
    ul.className = "pt-3";
    const usernameText = document.createTextNode("Username: " + username);
    const websiteText = document.createTextNode(website);
    const passwordText = document.createTextNode("Your password: " + password);
    const usernameLI = document.createElement("li");
    const websiteh3 = document.createElement("h3");
    const websiteLI = document.createElement("li");
    const passwordLI = document.createElement("li");
    usernameLI.appendChild(usernameText);
    websiteh3.appendChild(websiteText);
    websiteLI.appendChild(websiteh3);
    passwordLI.appendChild(passwordText);
    ul.appendChild(websiteLI);
    ul.appendChild(usernameLI);
    ul.appendChild(passwordLI);
    div.appendChild(ul);
    passContainer.appendChild(div);            
}

//Remove Item FIXTHIS
// ul.addEventListener('dblclick', removeItem);

function removeItem(e) {
    e.target.remove();
}
