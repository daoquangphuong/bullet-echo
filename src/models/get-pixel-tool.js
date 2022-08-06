const adb = require('./adb');

const main = async () => {
  const buf = await adb.screenCapture();
  const input = [[99, 50]];
  const { points } = await adb.getPixelColor(buf, input);
  console.info(input);
  console.info(points);
};

main().catch(console.error);
