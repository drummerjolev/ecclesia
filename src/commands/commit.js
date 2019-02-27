import { PythonShell } from 'python-shell';
import { ContractLibrary, StorageLibrary } from '../../index';
import { getPathTo } from '../../utils/app';

const {Command, flags} = require('@oclif/command');
import cli from 'cli-ux';

class CommitCommand extends Command {
  static flags = {
    // TODO: provide descriptions
    vote: flags.boolean({char: 'v'}),
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

    if (flags.vote) {
      // records choice
      // TODO: improve this to use multiple choice?
      const choice = await cli.prompt('Who do you want to vote for?');
      let instance;

      try {
        this.log(`Locking your vote...`);

        // TODO: time + squarings per second should be set by EA
        const res = await this.encrypt(3, 76000, choice);
        if (res.length !== 1) {
          throw `incorrect return value with length ${res.length}`;
        }
        const [p, q, n, a, t, enc_key, enc_vote, key] = res[0].split(' ');
        this.log('🔒  Your vote was successfully locked until the end of the voting period.');

        // TODO: Save all values to local storage for phase 4
        // we assume the order of this tuple is given
        const valuesToCommit = [enc_key, enc_vote].join(' ');

        this.log(`Storing your locked vote on IPFS...`);
        // store on IPFS
        instance = await new StorageLibrary().connectToStorage();
        const writtenValues = await instance.write('vote', valuesToCommit);
        const retrievedValues = await instance.read(writtenValues.hash);
        if (valuesToCommit !== retrievedValues) {
          throw `vote could not be stored on IPFS`;
        }

        // TODO: add save to contract

        this.log(`🎉  Success! You have successfully completed this phase.`);
      } catch (e) {
        // TODO: better error handling
        this.log(e);
      }

      // unblock CLI by stopping IPFS instance, no matter what the outcome
      if (instance) await instance.stop();
    }

  }
}

CommitCommand.description = '(3) Commitment Phase.';

module.exports = CommitCommand;
