const adb = require('./adb');

const main = async () => {
  const buf = await adb.screenCapture();
  const input = [
    [1072, 127], // #ffffff

    [1091, 126], // #ffffff

    [1070, 148], // #ffffff

    [1092, 148], // #ffffff
  ];
  const { points } = await adb.getPixelColor(buf, input);
  console.info(input, ',');
  console.info(points);
};

main().catch(console.error);
