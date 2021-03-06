const electron = require('electron');
const path = require('path');
const fs = require('fs');
const {code, code2} = require('./encrypter');

class Store {
	constructor(opts) {
		// Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
		// app.getPath('userData') will return a string of the user's app data directory path.
		const userDataPath = (electron.app || electron.remote.app).getPath('userData');
		// We'll use the `configName` property to set the file name and path.join to bring it all together as a string
		this.path = path.join(userDataPath, opts.configName + '.json');
		this.data = parseDataFile(this.path, opts.key);
		this.key = opts.key;
	}
  
	getCheck(){
		return this.data[0].item;
	}
	getSeed(){
		return this.data[1].seed;
	}
  // This will just return the properties on the `data` object
	getData() {
		let dataArr = [];
		for (var i=1; i < this.data.length; i++) {
			dataArr.push({
				website: this.data[i].website,
				username: this.data[i].username,
				password: code2.decrypt(this.data[i].password, this.key),
				mnemonic: code2.decrypt(this.data[i].mnemonic, this.key)
			});
		}	
		return dataArr;
	}
	
	remove(website, uname) {
		for (var i = 1; i < this.data.length; i++) {
			if ((website == this.data[i].website) && (uname == this.data[i].username)) {
				this.data.splice(i, 1);
				break;
			}
		}
		fs.writeFileSync(this.path, JSON.stringify(this.data));
	}

	arrLength() {
        return this.data.length;
    }
    
    clear() {
        this.data = [{"item": this.data[0].item}];
        fs.writeFileSync(this.path, JSON.stringify(this.data));
    }
  
    // ...and this will add values
    add(site, user, pass, mnemonic) {
      try {          
          this.data.push({
              website: site,
              username: user,
			  password: code.encrypt(pass, this.key),
			  mnemonic: code.encrypt(mnemonic, this.key)
          });
      } catch (error) {
          // this.data = [{
          //     website: site,
          //     username: user,
          //     password: code.encrypt(pass, this.key)
          // }];
      }
      fs.writeFileSync(this.path, JSON.stringify(this.data));
    }
    
}

function parseDataFile(filePath, userKey) {
  // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
  // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
    try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch(error) {
    // if there was some kind of error, return defaults instead.
		let first = code.encrypt("START PW LIST", userKey);
	    fs.writeFileSync(filePath, JSON.stringify([{item: first}]));
        return JSON.parse(fs.readFileSync(filePath));
  }
}

module.exports = Store;