const fs = require('fs');
const path = require('path');
const packageVersion = require('../package.json').version;

const updateBuildFile = () => {
  const buildFile = fs.readFileSync(
    path.resolve(__dirname, '../android/app/build.gradle'),
    'utf-8',
  );

  const versionCodeMatches = /versionCode ([0-9]+)/gm.exec(buildFile);
  const versionCode = +versionCodeMatches[1];
  const updatedBuildFile = buildFile
    .replace(/versionCode ([0-9]+)/gm, `versionCode ${versionCode + 1}`)
    .replace(/versionName '([0-9.]+)'/gm, `versionName '${packageVersion}'`);

  fs.writeFileSync(
    path.resolve(__dirname, '../android/app/build.gradle'),
    updatedBuildFile,
    'utf-8',
  );
};

const updateApiFile = () => {
  const compatApiFile = fs.readFileSync(
    path.resolve(__dirname, '../src/screens/home.screen.tsx'),
    'utf-8',
  );

  const updatedApiFile = compatApiFile.replace(/'([0-9.]+)'/gm, `'${packageVersion}'`);

  fs.writeFileSync(
    path.resolve(__dirname, '../src/screens/home.screen.tsx'),
    updatedApiFile,
    'utf-8',
  );
};

updateBuildFile();
updateApiFile();
