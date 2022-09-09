const adb = require('./adb');
const {
  HOME,
  HOME_INVITE,
  GAME,
  RESULT,
  COLLECT,
  DONE,
  CONTACT,
  OFFER,
  FLASH_OFFER,
  LEVEL_UP,
  SAVE,
  WARNING,
  WARNING_2,
  HERO,
  PLAY_BUTTON,
  GO_AHEAD,
  TURN_AROUND,
  BOMB_BUTTON,
  RESULT_BUTTON,
  COLLECT_BUTTON,
  CLOSE_CONTACT_BUTTON,
  CLOSE_OFFER_BUTTON,
  CLOSE_FLASH_OFFER_BUTTON,
  YES_FLASH_OFFER_BUTTON,
  LEVEL_UP_BUTTON,
  DONE_SAVE_BUTTON,
  WARNING_BUTTON,
  WARNING_BUTTON_2,
  HERO_BUTTON,
} = require('./auto-die.json');

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
      if (Date.now() - state.gameAt > 2800) {
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
