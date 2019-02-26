import Library from '../../index';

const {Command, flags} = require('@oclif/command');

class GenerateCredentialCommand extends Command {
  static flags = {
    // TODO: provide descriptions
    accumulator: flags.boolean({char: 'a'}),
    modulus: flags.boolean({char: 'm'}),
    generate: flags.boolean({char: 'g'}),
  };

  async run() {
    const { flags } = this.parse(GenerateCredentialCommand);

    if (!flags.accumulator && !flags.modulus && !flags.generate) return;

    // TODO HACK: hardcoded, pass parameters as user config
    // cf: https://oclif.io/docs/base_class
    const credGenContract = await new Library(
      'localhost',
      '9545',
      '0xBc16F477608b18142d6098bB4EaC28828A02297e',
      // TODO: private key is a very unsafe HACK, remove this
      '0x6e6217fd90137eaaa253816ff040ff4ff03638de55b6d5451a2a54fed3018960',
    ).connectToCredentialGeneration();

    if (flags.accumulator) {
      const accumulator = await credGenContract.getAccumulator();
      this.log(`📦  The accumulator base is: ${accumulator}`);
    }

    if (flags.modulus) {
      const modulus = await credGenContract.getAccumulatorModulus();
      this.log(`🍴  The modulus for the accumulator is: ${modulus}`);
    }

    if (flags.generate) {
      // TODO: HACK, should be generated safely. For now, an arbitray prime.
      const votingCredential = 7151;
      // WARNING: this does not work on local `truffle develop`, known issue
      // run on testnet
      const accumulator = await credGenContract.addToAccumulator(votingCredential);
      this.log(`🎩  After adding your voting credential, the accumulator is:
        ${accumulator}`);
    }
  }
}

GenerateCredentialCommand.description = '(2) Credential Generation Phase.';

module.exports = GenerateCredentialCommand;
