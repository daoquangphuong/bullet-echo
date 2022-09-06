const cp = require('child_process');
const { KEY_EVENT } = require('../constants');

const config = {
  sdk: 25,
};

const RGBAtoRGB = (r, g, b, a, r2 = 0, g2 = 0, b2 = 0) => {
  const r3 = Math.round((1 - a) * r2 + a * r);
  const g3 = Math.round((1 - a) * g2 + a * g);
  const b3 = Math.round((1 - a) * b2 + a * b);
  return [r3, g3, b3];
};

const spawn = (command, args = [], options = {}) => {
  const { type = 'string' } = options;
  return new Promise((resolve, reject) => {
    const ls = cp.spawn(command, args, options);
    const res = {
      length: 0,
      ok: type === 'string' ? '' : [],
      fail: '',
    };
    ls.stdout.on('data', data => {
      if (options.onData) {
        options.onData(data);
      }
      res.length += data.length;
      if (type === 'string') {
        res.ok += data;
      } else {
        res.ok.push(data);
      }
    });

    ls.stderr.on('data', data => {
      res.fail += data;
    });

    ls.on('close', code => {
      if (code === 0) {
        if (type === 'string') {
          resolve(res.ok);
        } else {
          const buf = Buffer.allocUnsafe(res.length);
          let pos = 0;
          res.ok.forEach(chunk => {
            buf.fill(chunk, pos, pos + chunk.length);
            pos += chunk.length;
          });
          resolve(buf);
        }
      } else {
        reject(
          new Error(
            [`${command} ${args.join(' ')}(${code})`, res.fail].join('\n')
          )
        );
      }
    });
  });
};

const getSDK = async () => {
  const res = await spawn('adb', ['shell', 'getprop', 'ro.build.version.sdk']);
  return parseInt(res, 10);
};

const getDevices = async () => {
  const res = await spawn('adb', ['devices']);
  const devices = res.split('\n');
  devices.shift();
  return devices.filter(Boolean).map(device => {
    const parts = device.split('\t');
    return {
      name: parts[0],
      type: parts[1],
    };
  });
};

const getWindowSize = async () => {
  const res = await spawn('adb', ['shell', 'wm', 'size']);
  const lines = res.split('\n');
  const size = item => {
    if (!item) {
      return null;
    }
    const [width, height] = item
      .split(':')[1]
      .split('x')
      .map(i => i.trim());
    return {
      width: Math.max(width, height),
      height: Math.min(width, height),
    };
  };
  const result = {
    physical: size(lines[0]),
    override: size(lines[1]),
  };
  result.size = result.override || result.physical;
  return result;
};

const getEvents = async onData => {
  await spawn('adb', ['shell', 'getevent'], {
    onData,
  });
};

const sendText = async (text, options = { ...config }) => {
  await spawn('adb', [
    'shell',
    `input keyboard text '${
      options.sdk > 23 ? text : text.replace(/\s/g, '%s')
    }'`,
  ]);
};

const sendEvent = async event => {
  await spawn('adb', ['shell', 'input', 'keyevent', event]);
};

const inputTap = async (x = 0, y = 0) => {
  await spawn('adb', ['shell', 'input', 'tap', x, y]);
};

const inputSwipe = async (x1 = 0, y1 = 0, x2 = 0, y2 = 0, duration = 3000) => {
  await spawn('adb', ['shell', 'input', 'swipe', x1, y1, x2, y2, duration]);
};

// http://ktnr74.blogspot.com/2013/06/emulating-touchscreen-interaction-with.html
const inputSwipeHold = async (x1 = 0, y1 = 0, x2 = 0, y2 = 0, time = 3000) => {
  const commands = [
    [3, 57, 0],
    [3, 53, x1],
    [3, 54, y1],
    [3, 48, 5],
    [3, 53, x2],
    [3, 54, y2],
    [3, 58, time],
    [0, 57, -1],
    [0, 2, 0],
    [0, 0, 0],
  ];
  let seq = Promise.resolve();
  commands.forEach(command => {
    seq = seq.then(async () => {
      await spawn('adb', [
        'shell',
        'sendevent',
        '/dev/input/event2',
        ...command,
      ]);
    });
  });
  await seq;
};

const screenCapture = async (type = 'buffer', format = '') => {
  // console.time('screenCapture');
  const res = await spawn('adb', ['shell', 'screencap', format], {
    type,
  });
  // console.timeEnd('screenCapture');
  // fs.writeFileSync(path.resolve(__dirname, 'text.png'), res);
  return res;
};

const getPixelColor = async (buf, points = []) => {
  const width = buf.readUInt32LE(0);
  const height = buf.readUInt32LE(4);
  const format = buf.readUInt32LE(8);
  if (format !== 1) {
    throw new Error('Wrong pixel format');
  }

  return {
    length: buf.length,
    width,
    height,
    format,
    points: points.map(([x, y]) => {
      const offset = y * width * 4 + x * 4 + 12;
      const pixelBuf = buf.slice(offset, offset + 4);
      return RGBAtoRGB(
        pixelBuf.readUint8(0),
        pixelBuf.readUint8(1),
        pixelBuf.readUint8(2),
        pixelBuf.readUint8(3) / 255
      );
    }),
  };
};

const colorMatch = async (buf, input, ...samples) => {
  const { points } = await getPixelColor(buf, input);
  let dif = 0;
  return samples.some(sample => {
    points.forEach((rgb, idx) => {
      dif += Math.abs(rgb[0] - sample[idx][0]);
      dif += Math.abs(rgb[1] - sample[idx][1]);
      dif += Math.abs(rgb[2] - sample[idx][2]);
    });
    return Math.floor(dif / sample.length) < 3;
  });
};

const delay = async time => {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
};

module.exports = {
  KEY_EVENT,
  config,
  getSDK,
  getDevices,
  getWindowSize,
  getEvents,
  sendText,
  sendEvent,
  inputTap,
  inputSwipe,
  inputSwipeHold,
  screenCapture,
  getPixelColor,
  colorMatch,
  delay,
};
