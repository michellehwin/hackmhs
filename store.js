const electron = require('electron');
const path = require('path');
const fs = require('fs');
const CryptoJS = require("crypto-js");

class Store {
  constructor(opts) {
    // Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
    // app.getPath('userData') will return a string of the user's app data directory path.
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    // We'll use the `configName` property to set the file name and path.join to bring it all together as a string
    this.path = path.join(userDataPath, opts.configName + '.json');
      this.data = parseDataFile(this.path);
      console.log(this.data);
      this.key = 'key';
  }
  
  // This will just return the properties on the `data` object
    getData() {
        console.log(this.data[0].user);
        let dataArr = [{
            website: this.data[0].website,
            username: this.data[0].username,
            password: code.decrypt(this.data[0].password, this.key)
        }];
        for (var i=1; i < this.data.length; i++) {
            dataArr.push({
                website: this.data[i].website,
                username: this.data[i].username,
                password: code.decrypt(this.data[i].password, this.key)
            });
        }
        return dataArr;
    }

    arrLength() {
        return this.data.length;
    }
    
    clear() {
        this.data = {};
        fs.writeFileSync(this.path, JSON.stringify(this.data));
    }
  
  // ...and this will add values
    add(site, user, pass) {
      try {          
          this.data.push({
              website: site,
              username: user,
              password: code.encrypt(pass, this.key)
          });
      } catch (error) {
          console.log("couldn't push data:\n" + error)
          this.data = [{
              website: site,
              username: user,
              password: code.encrypt(pass, this.key)
          }];
      }
      fs.writeFileSync(this.path, JSON.stringify(this.data));
      console.log(JSON.stringify(this.data));
    }
    
}

function parseDataFile(filePath) {
  // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
  // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
    try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch(error) {
    // if there was some kind of error, return defaults instead.
      console.log("Could not parse existing JSON file" + error);
      return [{}];
  }
}

let code = (function(){
    return{
      encrypt: function(messageToencrypt = '', secretkey = ''){
        var encryptedMessage = CryptoJS.AES.encrypt(messageToencrypt, secretkey);
        return encryptedMessage.toString();
      },
      decrypt: function(encryptedMessage = '', secretkey = ''){
        var decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, secretkey);
        var decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);

        return decryptedMessage;
      }
    }
})();



// exports the class
module.exports = Store;