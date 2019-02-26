import Library from '../../index';

import { getPathTo } from '../../utils/app';

import { PythonShell } from 'python-shell';
const {Command, flags} = require('@oclif/command');

class CommitCommand extends Command {
  static flags = {
    // TODO: provide descriptions
  };

  encrypt(args) {
    // HACK: pass in config
    const pythonPath = '/Users/drummerjolev/.virtualenvs/ug4-time-lock/bin/python';
    const scriptPath = getPathTo('timelock/timelockpuzzle');
    return new Promise((done, reject) =>
      PythonShell.run(
        'encrypt.py',
        {
          mode: 'text',
          args,
          pythonPath,
          scriptPath,
        },
        (err, results) => (err ? reject(err) : done(results))
      )
    );
  }

  async run() {
    const { flags } = this.parse(CommitCommand);

    // TODO: get as input
    const args = ['3', '76000', 'this is a vote for Jonathan'];

    try {
      const res = await this.encrypt(args);
      this.log('results: %j', res);
    } catch (e) {
      this.log(e);
    }
  }
}

CommitCommand.description = '(3) Commitment Phase.';

module.exports = CommitCommand;
