import Library from '../../index';

const {Command, flags} = require('@oclif/command')

class GenerateCredentialCommand extends Command {
  async run() {
    // TODO HACK: hardcoded, pass parameters as user config
    // cf: https://oclif.io/docs/base_class
    const credGenContract = await new Library(
      'localhost',
      '9545',
      '0xbc16f477608b18142d6098bb4eac28828a02297e',
    ).connectToCredentialGeneration();
    // WIP
    const acc = await credGenContract.getAccumulatorModulus();
    this.log(acc);
  }
}

GenerateCredentialCommand.description = '';

module.exports = GenerateCredentialCommand;
