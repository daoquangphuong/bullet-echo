const cp = require('child_process');

const spawn = (command, args = [], options) =>
  new Promise((resolve, reject) => {
    const ls = cp.spawn(command, args, options);
    const res = {
      ok: '',
      fail: '',
    };
    ls.stdout.on('data', data => {
      res.ok = data.toString();
    });

    ls.stderr.on('data', data => {
      res.fail = data.toString();
    });

    ls.on('close', code => {
      if (code === 0) {
        resolve(res.ok);
      } else {
        reject(
          new Error(
            [`${command} ${args.join(' ')}(${code})`, res.fail].join('\n')
          )
        );
      }
    });
  });

// const getDevices = async () => {
//   const res = await spawn('adb', ['devices']);
// };

const main = async () => {
  await spawn('adb', ['devices']);
};

main().catch(console.error);
