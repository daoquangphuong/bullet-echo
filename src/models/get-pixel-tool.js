const adb = require('./adb');

const main = async () => {
  const buf = await adb.screenCapture();
  const input = [
    [2314, 52], // #0a8ced
    [2343, 52], // #0a8ced
    [2313, 85], // #0a8ced
    [2341, 83], // #0a8ced
  ];
  const { points } = await adb.getPixelColor(buf, input);
  console.info(input, ',');
  console.info(points);
};

main().catch(console.error);
