import { PythonShell } from 'python-shell';
import { ContractLibrary, StorageLibrary } from '../../index';
import { getPathTo } from '../../utils/app';

const {Command, flags} = require('@oclif/command');
import cli from 'cli-ux';

class CommitCommand extends Command {
  static flags = {
    // TODO: provide descriptions
    isOpen: flags.boolean({char: 's'}),
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

  // procedure for vote boolean flag -v
  async runVote(contract) {
    // records choice
    const choice = await cli.prompt('Who do you want to vote for?');
    let instance;

    try {
      // Time Lock
      cli.action.start(`🔒  Locking your vote`);
      // TODO: time + squarings per second should be set by EA
      const res = await this.encrypt(3, 76000, choice);
      if (res.length !== 1) {
        throw `incorrect return value with length ${res.length}`;
      }
      cli.action.stop()
      const [p, q, n, a, t, enc_key, enc_vote, key] = res[0].split(' ');

      // TODO: Save all values to local storage for phase 4
      // we assume the order of this tuple is given
      const valuesToCommit = [enc_key, enc_vote].join(' ');

      // Store on IPFS
      cli.action.start(`📦  Storing your locked vote on IPFS`);
      instance = await new StorageLibrary().connectToStorage();
      const writtenValues = await instance.write('vote', valuesToCommit);
      const retrievedValues = await instance.read(writtenValues.hash);
      if (valuesToCommit !== retrievedValues) {
        throw `vote could not be stored on IPFS`;
      }
      cli.action.stop()

      // store IPFS hash on contract
      cli.action.start('📨  Submitting vote to EA')
      const submitVote = await contract.vote(writtenValues.hash);
      cli.action.stop()
      this.log(`🎉  Success! You have successfully voted.`);
    } catch (e) {
      // TODO: better error handling
      this.log(e);
    }

    // unblock CLI by stopping IPFS instance, no matter what the outcome
    // TODO: better check if .stop() is an available method
    if (instance) await instance.stop();
  }

  async run() {
    const { flags } = this.parse(CommitCommand);

    if (!flags.vote && !flags.isOpen) return;

    const commitmentContract = await new ContractLibrary(
      'localhost',
      '9545',
      '0xbc16f477608b18142d6098bb4eac28828a02297e',
      // TODO: private key is a very unsafe HACK, remove this
      '6e6217fd90137eaaa253816ff040ff4ff03638de55b6d5451a2a54fed3018960',
    ).connectToCommitment();

    if (flags.isOpen) {
      // TODO: wrap with try/catch
      const open = await commitmentContract.isOpen();
      if (!!open) {
        this.log(
          `🎉  The commitment phase is open. Go ahead and vote!`
        );
      } else {
        this.log('😔  The commitment phase is not currently open.');
      }
    }

    if (flags.vote) this.runVote(commitmentContract);
  }
}

CommitCommand.description = '(3) Commitment Phase.';

module.exports = CommitCommand;
