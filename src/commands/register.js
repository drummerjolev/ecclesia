import { default as Lib } from '../../index';

const {Command, flags} = require('@oclif/command');

class RegisterCommand extends Command {
  static flags = {
    // TODO: provide descriptions
    isOpen: flags.boolean({char: 's'}),
    hashFunction: flags.boolean({char: 'h'}),
    ellipticCurve: flags.boolean({char: 'c'}),
  };

  async run() {
    const { flags } = this.parse(RegisterCommand);

    if (!flags.isOpen && !flags.hashFunction && !flags.ellipticCurve) return;

    // TODO HACK: hardcoded, pass parameters as user config
    const ecclesiaLib = await Lib(
      'localhost',
      '9545',
      '0xbc16f477608b18142d6098bb4eac28828a02297e',
    );

    if (flags.isOpen) {
      // TODO: wrap with try/catch
      const open = await ecclesiaLib.isOpen();
      if (!!open) {
        this.log(
          `🎉  The registration phase is open. Proceed to the EA to submit your
          credentials.`
        );
      } else {
        this.log('😔  The registration is not currently open.');
      }
    }

    if (flags.hashFunction) {
      // TODO: wrap with try/catch
      const hashF = await ecclesiaLib.getHashFunction();
      this.log(`The Hash Function for signing messages is ${hashF}.`);
    }

    if (flags.ellipticCurve) {
      // TODO: wrap with try/catch
      const curve = await ecclesiaLib.getEllipticCurve();
      this.log(`The Elliptic Curve for signing messages is ${curve}.`);
    }
  }
}

RegisterCommand.description = 'Registration Phase';

module.exports = RegisterCommand;
