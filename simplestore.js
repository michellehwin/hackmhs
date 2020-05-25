const electron = require('electron');
const path = require('path');
const fs = require('fs');
const {code, code2} = require('./encrypter');

class SimpleStore {
  constructor(opts) {
    // Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
    // app.getPath('userData') will return a string of the user's app data directory path.
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    // We'll use the `configName` property to set the file name and path.join to bring it all together as a string
    this.path = path.join(userDataPath, opts.configName + '.json');
    this.data = parseDataFile(this.path, opts.key, opts.seed);
	this.key = opts.key;
	this.seed = opts.seed;
    }
    
    getSeed() {
        return this.seed;
    }
}
function parseDataFile(filePath, userKey, seed) {
  // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
  // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
    try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch(error) {
    // if there was some kind of error, return defaults instead.
        let first = code.encrypt(seed, userKey);
	    fs.writeFileSync(filePath, JSON.stringify([{seed: first}]));
        return JSON.parse(fs.readFileSync(filePath));
  }
}

module.exports = SimpleStore;