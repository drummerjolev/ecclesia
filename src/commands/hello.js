import { default as Lib } from '../../index';

const { Command, flags } = require('@oclif/command');

class HelloCommand extends Command {
  async run() {
    // CLI interaction example
    // const { flags } = this.parse(HelloCommand);
    // const name = flags.name || 'world';
    // this.log(`hello ${name} from ./src/commands/hello.js`);

    // TODO: hardcoded, pass parameters
    // hack, hardcoded
    const ecclesiaLib = await Lib(
      'localhost',
      '9545',
      '0xbc16f477608b18142d6098bb4eac28828a02297e',
    );
    // TODO: async, how to properly init ecclesiaLib?
    ecclesiaLib.isOpen();
  }
}

HelloCommand.description = 'Welcome to Ecclesia\'s Voter CLI 📝`';

HelloCommand.flags = {
  name: flags.string({ char: 'n', description: 'name to print' }),
};

module.exports = HelloCommand;
