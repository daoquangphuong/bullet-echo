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

const LEVEL_UP = [
  [
    [832, 604],
    [1038, 605],
    [833, 658],
    [1039, 659],
  ],
  [
    [114, 206, 25],
    [103, 199, 14],
    [100, 197, 11],
    [94, 194, 4],
  ],
];

const SAVE = [
  [
    [468, 510],
    [699, 510],
    [465, 568],
    [705, 571],
  ],
  [
    [237, 71, 34],
    [235, 68, 30],
    [234, 67, 29],
    [233, 65, 26],
  ],
];

const WARNING = [
  [
    [1152, 603],
    [1152, 620],
    [1164, 612],
    [1172, 602],
    [1173, 620],
  ],
  [
    [73, 158, 189],
    [73, 158, 189],
    [73, 158, 189],
    [73, 158, 189],
    [73, 158, 189],
  ],
];

const WARNING_2 = [
  [
    [1061, 611],
    [1072, 611],
    [1079, 612],
    [1088, 620],
    [1088, 603],
  ],
  [
    [73, 158, 189],
    [73, 158, 189],
    [73, 158, 189],
    [73, 158, 189],
    [73, 158, 189],
  ],
];

const HERO = [
  [
    [1414, 48],
    [1426, 40],
    [1437, 47],
    [1416, 60],
    [1436, 60],
  ],
  [
    [10, 140, 237],
    [10, 140, 237],
    [10, 140, 237],
    [10, 140, 237],
    [10, 140, 237],
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

const LEVEL_UP_BUTTON = [934, 631];

const DONE_SAVE_BUTTON = [592, 537];

const WARNING_BUTTON = [1160, 612];

const WARNING_BUTTON_2 = [1076, 611];

const HERO_BUTTON = [53, 48];

const main = async () => {
  const lastState = {};
  const state = {
    moved: false,
    turned: false,
    gameAt: false,
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
    const isResult = await adb.colorMatch(buf, ...RESULT);
    const isCollect = await adb.colorMatch(buf, ...COLLECT);
    const isDONE = await adb.colorMatch(buf, ...DONE);
    const isContact = await adb.colorMatch(buf, ...CONTACT);
    const isOffer = await adb.colorMatch(buf, ...OFFER);
    const isFLashOffer = await adb.colorMatch(buf, ...FLASH_OFFER);
    const isLevelUp = await adb.colorMatch(buf, ...LEVEL_UP);
    const isSave = await adb.colorMatch(buf, ...SAVE);
    const isWarning = await adb.colorMatch(buf, ...WARNING);
    const isWarning2 = await adb.colorMatch(buf, ...WARNING_2);
    const isHero = await adb.colorMatch(buf, ...HERO);
    const newState = {
      isHome,
      isHomeInvite,
      isGame,
      isResult,
      isCollect,
      isDONE,
      isContact,
      isOffer,
      isFLashOffer,
      isLevelUp,
      isSave,
      isWarning,
      isWarning2,
      isHero,
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
      state.gameAt = false;
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
      state.gameAt = state.gameAt || Date.now();

      if (!state.turned) {
        state.turned = true;
        await adb.inputSwipe(...TURN_AROUND, 300);
      }
      await adb.inputSwipe(...GO_AHEAD, 750);
      if (Date.now() - state.gameAt > 4000) {
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
      if (isLevelUp) {
        await adb.inputTap(...LEVEL_UP_BUTTON);
      }
      if (isSave) {
        await adb.inputTap(...DONE_SAVE_BUTTON);
      }
      if (isWarning) {
        await adb.inputTap(...WARNING_BUTTON);
      }
      if (isWarning2) {
        await adb.inputTap(...WARNING_BUTTON_2);
      }
      if (isHero) {
        await adb.inputTap(...HERO_BUTTON);
      }
    }
    next(100);
  };
  loop().catch(console.error);
};

main().catch(console.error);
