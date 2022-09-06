const adb = require('./adb');

const main = async () => {
  const buf = await adb.screenCapture();
  const input = [
    [2306, 72], // #0a8ced
    [2321, 61], // #0a8ced
    [2335, 75], // #0a8ced
    [2336, 88], // #0a8ced
    [2305, 92], // #0a8ced
  ];
  const { points } = await adb.getPixelColor(buf, input);
  console.info(input, ',');
  console.info(points);
};

main().catch(console.error);
