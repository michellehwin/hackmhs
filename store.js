const electron = require('electron');
const path = require('path');
const fs = require('fs');

class Store {
  constructor(opts) {
    // Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
    // app.getPath('userData') will return a string of the user's app data directory path.
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    // We'll use the `configName` property to set the file name and path.join to bring it all together as a string
    this.path = path.join(userDataPath, opts.configName + '.json');
    this.data = parseDataFile(this.path);
  }
  
  // This will just return the property on the `data` object
  get(website) {
    for (var i=0; i < this.data.length; i++) {
        if (this.data[i].website === website) {
            return this.data[i];
        }
    }
  }
  
    arrLength() {
        return this.data.length;
  }
  
  // ...and this will add values
  add(site, user, pass) {
      this.data.push({ website: site, username: user, password: pass });
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}

function parseDataFile(filePath) {
  // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
  // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch(error) {
    // if there was some kind of error, return the passed in defaults instead.
      return [{website: 'site', username: 'user', password: 'pass'}];
  }
}

// exports the class
module.exports = Store;