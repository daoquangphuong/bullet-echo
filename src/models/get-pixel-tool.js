const adb = require('./adb');

const main = async () => {
  const buf = await adb.screenCapture();
  const input = [
    [1414, 48], // #0a8ced

    [1426, 40], // #0a8ced

    [1437, 47], // #0a8ced

    [1416, 60], // #0a8ced

    [1436, 60], // #0a8ced
  ];
  const { points } = await adb.getPixelColor(buf, input);
  console.info(input, ',');
  console.info(points);
};

main().catch(console.error);
