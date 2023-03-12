class CommandLineInterface {
  readInterface;
  commands;

  constructor() {
    this.commands = {};
    this.readInterface = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    this.readInterface.on('line', (line) => {
      const cmd = line.split(' ').at(0);
      const args = line.split(' ').slice(1)
      if (this.commands[cmd]) this.commands[cmd](...args);
    });
  }

  on(name, callback) {
    this.commands[name] = callback;
  }
}

module.exports = CommandLineInterface;