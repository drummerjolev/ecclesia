const { Command, flags } = require('@oclif/command');

class HelloCommand extends Command {
  async run() {
    // CLI interaction example
    const { flags } = this.parse(HelloCommand);
    const name = flags.name || 'world';
    this.log(`hello ${name} from ./src/commands/hello.js`);
  }
}

HelloCommand.description = 'Welcome to Ecclesia\'s Voter CLI 📝`';

HelloCommand.flags = {
  name: flags.string({ char: 'n', description: 'name to print' }),
};

module.exports = HelloCommand;
