const electron = require('electron');
const path = require('path');
const fs = require('fs');
const code = require('./encrypter');
const CryptoJS = require("crypto-js");

class Store {
  constructor(opts) {
    // Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
    // app.getPath('userData') will return a string of the user's app data directory path.
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    // We'll use the `configName` property to set the file name and path.join to bring it all together as a string
    this.path = path.join(userDataPath, opts.configName + '.json');
    this.data = parseDataFile(this.path, opts.key);
	  this.key = opts.key;
	  console.log(this.data);
  }
  
  getCheck(){
	  console.log(this.data[0].item);
      return this.data[0].item;
  }
  // This will just return the properties on the `data` object
  getData() {
    let dataArr = [];
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
		console.log(this.data);
        return this.data.length;
    }
    
    clear() {
        this.data = [{"item": "START PASSWORD LIST"}];
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
          // this.data = [{
          //     website: site,
          //     username: user,
          //     password: code.encrypt(pass, this.key)
          // }];
      }
      fs.writeFileSync(this.path, JSON.stringify(this.data));
      console.log(JSON.stringify(this.data));
    }
    
}

function parseDataFile(filePath, userKey) {
  // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
  // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
    try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch(error) {
    // if there was some kind of error, return defaults instead.
		console.log("Could not parse existing JSON file\n" + error);
		let first = code.encrypt("START PW LIST", userKey);
		console.log(first);
	    fs.writeFileSync(filePath, JSON.stringify([{ item: first}]));
        console.log("New JSON file created");
        return JSON.parse(fs.readFileSync(filePath));
  }
}

module.exports = Store;