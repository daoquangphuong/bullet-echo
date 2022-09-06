const adb = require('./adb');

const main = async () => {
  const buf = await adb.screenCapture();
  const input = [
    [1505, 309], // #044294
    [1531, 310], // #044294
    [1501, 341], // #044294
    [1533, 340], // #044294
  ];
  const { points } = await adb.getPixelColor(buf, input);
  console.info(input, ',');
  console.info(points);
};

main().catch(console.error);
