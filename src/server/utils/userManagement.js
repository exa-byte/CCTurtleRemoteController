const fs = require('fs');

function getDateDiffString(date1, date2) {
  let diff = date1 - date2;
  const rtf1 = new Intl.RelativeTimeFormat('en', { style: 'narrow' });

  const diff_sec = diff / 1000;

  // if diff is smaller than one minute output in seconds
  if (-diff_sec < 60)
    return rtf1.format(parseInt(diff_sec), 'second');
  else if (-diff_sec < 60 * 60)
    return rtf1.format(parseInt(diff_sec / 60), 'minute');
  else if (-diff_sec < 24 * 60 * 60)
    return rtf1.format(parseInt(diff_sec / 60 / 60), 'hour');
  else
    return rtf1.format(parseInt(diff_sec / 60 / 60 / 24), 'day');
}

class UserManagement {
  users = {}
  saveFile;

  constructor() {
    this.saveFile = "./src/server/saved/users.json";
    this.load();
  }

  _createUser(ip) {
    this.users[ip] = {
      actionCount: 0,
    };
  }
  updateLastActive(ip) {
    if (!this.users[ip]) this._createUser(ip);
    this.users[ip].lastActive = Date.now();
  }
  validateUsername(username) {
    // min of 3 characters, max of 16
    if (username.length < 3 || username.length > 16) return 'username length must be >= 3 and <= 16';
    // allow only letters and numbers
    if (!/^[A-Za-z0-9]*$/.test(username)) return 'only a-Z and 0-9 characters allowed';
    return true;
  }
  setUsername(ip, username) {
    // check for username allowed characters
    const result = this.validateUsername(username)
    if (result !== true) return result;

    // check if it already exists
    for (const [_, v] of Object.entries(this.users))
      if (username === v.username)
        return 'username already taken';

    this.users[ip].username = username;
    return true;
  }
  getUsername(ip) {
    if (!this.users[ip]) return false;
    return this.users[ip].username;
  }
  getUserDataList() {
    return this.users;
  }
  getUserDataString() {
    let list = []
    for (const [ip, user] of Object.entries(this.users)) {
      let el = Object.assign({}, user);
      el.ip = ip;
      list.push(el)
    }
    list.sort((a, b) => (a.lastActive > b.lastActive) ? 1 : -1)
    let str = "";
    for (const user of list) {
      const usernameStr = user.username ? `\t, username: ${user.username}` : "";
      str += `{ '${user.ip}': { lastActive: ${getDateDiffString(user.lastActive, Date.now())}\t, actionCount: ${user.actionCount}${usernameStr} } }\n`;
    }
    return str;
  }
  save() {
    fs.mkdirSync('./src/server/saved', { recursive: true }, (err) => { if (err) throw err; });
    fs.writeFileSync(this.saveFile, JSON.stringify(this.users));
  }
  load() {
    try {
      this.users = JSON.parse(fs.readFileSync(this.saveFile, 'utf8'));
    }
    catch { }
  }
}

module.exports = UserManagement;