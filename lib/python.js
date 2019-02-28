import { PythonShell } from 'python-shell';
import { getPathTo } from '../utils/app';

// wraps interactions with Python processes
export default class Python {
  constructor(pythonPath, script) {
    this.pythonPath = pythonPath;
    this.scriptPath = getPathTo(script);
  }

  // encrypt uses Time Lock encryption to hide a message for a given time
  encrypt(time, squaringsPerSecond, message) {
    // promisified encryption using Python Shell
    return new Promise((done, reject) => PythonShell.run('encrypt.py',
      {
        mode: 'text',
        args: [time, squaringsPerSecond, message],
        pythonPath: this.pythonPath,
        scriptPath: this.scriptPath,
      }, (err, results) => (err ? reject(err) : done(results))));
  }
}
