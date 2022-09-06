const adb = require('./adb');

const main = async () => {
  const buf = await adb.screenCapture();
  const input = [
    [263, 65], // #07133d
    [264, 86], // #07133d
    [263, 105], // #07133d
  ];
  const { points } = await adb.getPixelColor(buf, input);
  console.info(input, ',');
  console.info(points);
};

main().catch(console.error);
