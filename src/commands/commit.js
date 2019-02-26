import Library from '../../index';

const {Command, flags} = require('@oclif/command');

class CommitCommand extends Command {
  static flags = {
    // TODO: provide descriptions
  };

  async run() {
    const { flags } = this.parse(CommitCommand);
  }
}

CommitCommand.description = '(3) Commitment Phase.';

module.exports = CommitCommand;
