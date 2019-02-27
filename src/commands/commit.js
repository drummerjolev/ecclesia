import { PythonShell } from 'python-shell';
import { ContractLibrary, StorageLibrary } from '../../index';
import { getPathTo } from '../../utils/app';

const {Command, flags} = require('@oclif/command');

class CommitCommand extends Command {
  static flags = {
    // TODO: provide descriptions
  };

  // promisifies time lock
  encrypt(time, squaringsPerSecond, vote) {
    // HACK: pass in config
    const pythonPath = '/Users/drummerjolev/.virtualenvs/ug4-time-lock/bin/python';
    const scriptPath = getPathTo('timelock/timelockpuzzle');
    return new Promise((done, reject) =>
      PythonShell.run(
        'encrypt.py',
        {
          mode: 'text',
          args: [...arguments],
          pythonPath,
          scriptPath,
        },
        (err, results) => (err ? reject(err) : done(results))
      )
    );
  }

  async run() {
    const { flags } = this.parse(CommitCommand);

    try {
      // // TODO: get as input
      // // TODO: time + squarings per second should be set by EA
      // const res = await this.encrypt(3, 76000, 'vote for Jonathan');
      // if (res.length === 1) {
      //   const [p, q, n, a, t, enc_key, enc_vote, key] = res[0].split(' ');
      //   // TODO: Save to local storage. Commit enc_key, enc_vote.
      //   // TODO: implement IPFS
      // }

      const instance = await new StorageLibrary().connectToStorage();
      this.log(instance);
    } catch (e) {
      this.log(e);
    }
  }
}

CommitCommand.description = '(3) Commitment Phase.';

module.exports = CommitCommand;
