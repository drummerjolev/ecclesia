import Library from '../../index';

const {Command, flags} = require('@oclif/command');

class GenerateCredentialCommand extends Command {
  static flags = {
    // TODO: provide descriptions
    accumulator: flags.boolean({char: 'a'}),
    modulus: flags.boolean({char: 'm'}),
  };

  async run() {
    const { flags } = this.parse(GenerateCredentialCommand);

    if (!flags.accumulator && !flags.modulus) return;

    // TODO HACK: hardcoded, pass parameters as user config
    // cf: https://oclif.io/docs/base_class
    const credGenContract = await new Library(
      'localhost',
      '9545',
      '0xbc16f477608b18142d6098bb4eac28828a02297e',
    ).connectToCredentialGeneration();

    if (flags.accumulator) {
      const accumulator = await credGenContract.getAccumulator();
      this.log(`📦  The accumulator is: ${accumulator}`);
    }

    if (flags.modulus) {
      const modulus = await credGenContract.getAccumulatorModulus();
      this.log(`🍴  The modulus for the accumulator is: ${modulus}`);
    }

    // TODO: generate voting credential, dummy?
    // TODO: lookup 'test modular exponentiation' for adding to acc
  }
}

GenerateCredentialCommand.description = '';

module.exports = GenerateCredentialCommand;
