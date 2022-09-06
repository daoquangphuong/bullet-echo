const adb = require('./adb');

const main = async () => {
  const buf = await adb.screenCapture();
  const input = [
    [206, 47], // #0a8ced
    [187, 70], // #0a8ced
    [208, 91], // #0a8ced
  ];
  const { points } = await adb.getPixelColor(buf, input);
  console.info(input, ',');
  console.info(points);
};

main().catch(console.error);
