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
    [1078, 629],
    [1096, 619],
    [1088, 644],
    [1105, 641],
  ],
  [
    [156, 201, 228],
    [156, 201, 228],
    [156, 201, 228],
    [156, 201, 228],
  ],
];

const BOMB_READY = [
  [
    [1293, 406],
    [1295, 402],
    [1296, 399],
  ],
  [
    [156, 201, 228],
    [156, 201, 228],
    [156, 201, 228],
  ],
  [
    [99, 128, 145],
    [99, 128, 145],
    [99, 128, 145],
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

const CONTACT = [
  [
    [1422, 34],
    [1440, 33],
    [1421, 54],
    [1441, 54],
  ],
  [
    [10, 140, 237],
    [10, 140, 237],
    [10, 140, 237],
    [10, 140, 237],
  ],
];

const OFFER = [
  [
    [1030, 131],
    [1050, 132],
    [1030, 155],
    [1052, 153],
  ],
  [
    [4, 66, 148],
    [4, 66, 148],
    [4, 66, 148],
    [4, 66, 148],
  ],
];

const FLASH_OFFER = [
  [
    [1072, 127],
    [1091, 126],
    [1070, 148],
    [1092, 148],
  ],
  [
    [255, 255, 255],
    [255, 255, 255],
    [255, 255, 255],
    [255, 255, 255],
  ],
];

const PLAY_BUTTON = [1328, 659];

const GO_AHEAD = [...[202, 522], ...[202, 0]];

const TURN_AROUND = [...[900, 500], ...[1400, 500]];

const BOMB_BUTTON = [1231, 391];

const RESULT_BUTTON = [125, 665];

const COLLECT_BUTTON = [746, 625];

const CLOSE_CONTACT_BUTTON = [1431, 44];

const CLOSE_OFFER_BUTTON = [1042, 143];

const CLOSE_FLASH_OFFER_BUTTON = [1081, 137];

const YES_FLASH_OFFER_BUTTON = [627, 514];

const main = async () => {
  const lastState = {};
  const state = {
    moved: false,
    turned: false,
  };

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
    const isContact = await adb.colorMatch(buf, ...CONTACT);
    const isOffer = await adb.colorMatch(buf, ...OFFER);
    const isFLashOffer = await adb.colorMatch(buf, ...FLASH_OFFER);
    const newState = {
      isHome,
      isHomeInvite,
      isGame,
      isBombReady,
      isResult,
      isCollect,
      isDONE,
      isContact,
      isOffer,
      isFLashOffer,
    };
    const isStateChanged = Object.keys(newState).some(
      key => newState[key] !== lastState[key]
    );
    if (isStateChanged) {
      console.info(newState);
      Object.assign(lastState, newState);
    }
    if (isHome) {
      state.moved = false;
      state.turned = false;
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
      } else {
        if (!state.turned) {
          state.turned = true;
          await adb.inputSwipe(...TURN_AROUND, 300);
        }
        await adb.inputSwipe(...GO_AHEAD, 750);
        await adb.inputTap(...BOMB_BUTTON);
      }
    } else {
      if (isContact) {
        await adb.inputTap(...CLOSE_CONTACT_BUTTON);
      }
      if (isOffer) {
        await adb.inputTap(...CLOSE_OFFER_BUTTON);
      }
      if (isFLashOffer) {
        await adb.inputTap(...CLOSE_FLASH_OFFER_BUTTON);
        await adb.delay(1000);
        await adb.inputTap(...YES_FLASH_OFFER_BUTTON);
      }
    }
    next(100);
  };
  loop().catch(console.error);
};

main().catch(console.error);
