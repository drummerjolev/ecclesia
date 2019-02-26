const path = require('path');

// appends file string to Node directory path
export const getPathTo = (fileLocation) => {
  const utilsDir = path.dirname(require.main.filename);
  const lastIndex = utilsDir.lastIndexOf('/');
  const appDir = utilsDir.substring(0, lastIndex);
  return path.join(appDir, fileLocation);
};
