const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const { axiosFetch } = require('./models/axios');
const config = require('./config');

const ROOT = config.isDEV ? path.resolve(__dirname, '../dest') : config.cwd;

const GIT_ENDPOINT = `https://github.com/daoquangphuong/bullet-echo/tree/master/dest`;
const GIT_RAW_ENDPOINT = `https://raw.githubusercontent.com/daoquangphuong/bullet-echo/master/dest`;

const getCurrentVersion = async () => {
  try {
    if (!fs.existsSync(path.resolve(ROOT, 'package.json'))) {
      return `0.0.0`;
    }
    const packageJson = fs.readFileSync(
      path.resolve(ROOT, 'package.json'),
      'utf8'
    );
    const json = JSON.parse(packageJson);
    const { version } = json;
    return version;
  } catch (e) {
    console.error(e);
    return `0.0.0`;
  }
};

const getGitFolder = async () => {
  const folders = [''];
  const fileList = [];

  return new Promise((resolve, reject) => {
    const loop = async () => {
      const folder = folders.shift();
      if (folder === undefined) {
        resolve(fileList);
        return;
      }
      const { data } = await axiosFetch({
        url: `${GIT_ENDPOINT}${folder}`,
        method: 'GET',
        responseType: 'text',
        transformResponse: [res => res],
      });
      const fileMatches = data.match(
        /"\/daoquangphuong\/bullet-echo\/(tree|blob)\/master\/dest\/(.+?)"/g
      );
      fileMatches.forEach(item => {
        const match = item.match(
          /"\/daoquangphuong\/bullet-echo\/(tree|blob)\/master\/dest\/(.+?)"/
        );
        const fileInfo = { isDir: match[1] === 'tree', value: match[2] };
        if (fileInfo.isDir) {
          folders.push(`/${fileInfo.value}`);
        } else {
          fileList.push(fileInfo.value);
        }
      });
      loop().catch(reject);
    };

    loop().catch(reject);
  });
};

const getGitFile = async filePath => {
  const { data } = await axiosFetch({
    url: `${GIT_RAW_ENDPOINT}/${filePath}`,
    method: 'GET',
    responseType: 'text',
    transformResponse: [res => res],
  });
  return data;
};

const getNextVersion = async () => {
  try {
    const packageJson = await getGitFile('package.json');
    const json = JSON.parse(packageJson);
    const { version } = json;
    return version;
  } catch (e) {
    console.error(e);
    return `0.0.0`;
  }
};

const updateFile = async fileName => {
  const fileContent = await getGitFile(fileName);
  const pathList = fileName.split('/');
  pathList.pop();
  if (pathList.length) {
    await fsExtra.ensureDir(path.resolve(ROOT, pathList.join('/')));
  }
  fs.writeFileSync(path.resolve(ROOT, fileName), fileContent, 'utf8');
};

const checkHasNewVersion = (currentVer, nextVer) => {
  const c = currentVer.split('.');
  const n = nextVer.split('.');
  while (c.length < n.length) {
    c.push('0');
  }
  while (n.length < c.length) {
    n.push('0');
  }
  return n.some((v, k) => v > c[k]);
};

const check = async () => {
  const currentVer = await getCurrentVersion();
  const nextVer = await getNextVersion();
  const hasNewVersion = checkHasNewVersion(currentVer, nextVer);
  if (!hasNewVersion) {
    return;
  }
  console.info(`Has New Version ${nextVer}`);
  console.info('Updating...');
  console.info('Please wait...');
  const folder = await getGitFolder();
  let seq = Promise.resolve();
  folder.forEach((fileName, idx) => {
    seq = seq.then(async () => {
      console.info(`${idx + 1}/${folder.length} Updating ${fileName}`);
      await updateFile(fileName);
    });
  });

  await seq;
};

module.exports = {
  getCurrentVersion,
  getNextVersion,
  check,
};
