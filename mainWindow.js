const electron = require('electron');
const { ipcRenderer } = electron;
const Store = require('./store.js');

var store;

const passContainer = document.getElementById("passList");
document.getElementById("add-password").addEventListener("click", function(){
    ipcRenderer.send("addPasswordWindow:open");
    document.getElementById("add-password").disabled = true;
})


ipcRenderer.on("create-JSON", function (e, mp, s) {
    store = new Store({ configName: 'passwords', key: mp, seed: s });
    document.getElementById("add-password").disabled = false;
});

ipcRenderer.on("request-JSON", function (e, mp) {
    store = new Store({ configName: 'passwords', key: mp });
    document.getElementById("add-password").disabled = false;
    ipcRenderer.send("JSON", store.getCheck());
    dataAdd(store);
});


function dataAdd(store) {
    for (var i=0; i < store.arrLength()-1; i++) {
        createDiv(
            store.getData()[i].username,
            store.getData()[i].website, 
            store.getData()[i].password,
            store.getData()[i].mnemonic
        );
    }
};

ipcRenderer.on('password:add', function(e,username, website, password, mnemonic){
    //create div that contains ul of username, site, and password
    document.getElementById("add-password").disabled = false;
    createDiv(username, website, password, mnemonic);
    store.add(website, username, password, mnemonic);

});

ipcRenderer.on('password:clear', function(){
    passContainer.innerHTML = '';
    store.clear();
});

function createDiv(username, website, password, mnemonic){
    //create div that contains ul of username, site, and password
    const div = document.createElement('div');
    div.className = "passRow row m-3";
    const ul = document.createElement('ul');
    ul.className = "pt-3 pl-4 mr-2";
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
    usernameLI.id = "username"
    websiteh3.appendChild(websiteText);
    websiteLI.appendChild(websiteh3);
    mnemonicLI.appendChild(mnemonicText);
    passwordLI.appendChild(passwordText);
    ul.appendChild(websiteLI);
    ul.appendChild(usernameLI);
    ul.appendChild(passwordLI);
    ul.appendChild(mnemonicLI);
    const x = document.createElement('img');
    x.src = 'x.png'
    x.className = "x";
    x.addEventListener("click", function(){
        x.parentNode.parentNode.removeChild(this.parentNode);
        const removeWebsite = x.parentNode.querySelector('ul').querySelector('h3').textContent;
        let removeUser = x.parentNode.querySelector('ul').querySelectorAll('li');
        store.remove(removeWebsite, removeUser[1].textContent.substring(10,));
    });
    div.appendChild(x);
    div.appendChild(ul);
    passContainer.appendChild(div);            
}

//Remove Item FIXTHIS
// ul.addEventListener('dblclick', removeItem);

// function removeItem(e) {
//     console.log(e);
//     e.target.remove();
// }
