const adb = require('./adb');

const HOME = [
  [
    [1160, 625],
    [1161, 625],
    [1162, 625],
  ],
  [
    [235, 68, 30],
    [235, 68, 29],
    [235, 67, 29],
  ],
];

const HOME_INVITE = [
  [
    [1160, 625],
    [1161, 625],
    [1162, 625],
    [1163, 625],
    [1164, 625],
    [1165, 625],
  ],
  [
    [30, 33, 102],
    [4, 12, 30],
    [13, 33, 4],
    [102, 12, 13],
    [30, 33, 102],
    [4, 12, 30],
  ],
];

const GAME = [
  [
    [231, 28],
    [231, 35],
    [231, 43],
  ],
  [
    [156, 201, 228],
    [153, 195, 221],
    [156, 201, 228],
  ],
];

const BOMB_READY = [
  [
    [1293, 410],
    [1283, 427],
  ],
  [
    [156, 200, 227],
    [156, 201, 228],
  ],
];

const RESULT = [
  [
    [50, 645],
    [51, 645],
    [52, 645],
  ],
  [
    [15, 152, 236],
    [15, 152, 236],
    [15, 152, 236],
  ],
];

const COLLECT = [
  [
    [655, 600],
    [656, 600],
    [657, 600],
  ],
  [
    [112, 205, 24],
    [112, 205, 24],
    [112, 205, 24],
  ],
];

const DONE = [[[99, 50]], [[7, 19, 61]]];

const PLAY_BUTTON = [1328, 659];

const GO_AHEAD = [...[202, 522], ...[202, 0]];

const BOMB_BUTTON = [1231, 391];

const RESULT_BUTTON = [125, 665];

const COLLECT_BUTTON = [746, 625];

const main = async () => {
  const lastState = {};

  const loop = async () => {
    const next = (time = 0) => {
      setTimeout(() => {
        loop().catch(console.error);
      }, time);
    };
    const buf = await adb.screenCapture();
    const isHome = await adb.colorMatch(buf, ...HOME);
    const isHomeInvite = await adb.colorMatch(buf, ...HOME_INVITE);
    const isGame = await adb.colorMatch(buf, ...GAME);
    const isBombReady = await adb.colorMatch(buf, ...BOMB_READY);
    const isResult = await adb.colorMatch(buf, ...RESULT);
    const isCollect = await adb.colorMatch(buf, ...COLLECT);
    const isDONE = await adb.colorMatch(buf, ...DONE);
    const newState = {
      isHome,
      isHomeInvite,
      isGame,
      isBombReady,
      isResult,
      isCollect,
      isDONE,
    };
    const isStateChanged = Object.keys(newState).some(
      key => newState[key] !== lastState[key]
    );
    if (isStateChanged) {
      console.info(newState);
      Object.assign(lastState, newState);
    }
    if (isHome) {
      if (isDONE) {
        console.info('DONE');
        return;
      }
      await adb.inputTap(...PLAY_BUTTON);
      next(100);
      return;
    }
    if (isResult) {
      await adb.inputTap(...RESULT_BUTTON);
      next(100);
      return;
    }
    if (isCollect) {
      await adb.inputTap(...COLLECT_BUTTON);
      next(100);
      return;
    }
    if (isGame) {
      if (isBombReady) {
        await adb.inputTap(...BOMB_BUTTON);
      }
      if (!isBombReady) {
        await adb.inputSwipe(...GO_AHEAD, 1750);
      }
    }
    next(100);
  };
  loop().catch(console.error);
};

main().catch(console.error);
