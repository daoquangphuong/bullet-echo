const adb = require('./adb');

const main = async () => {
  const buf = await adb.screenCapture();
  const input = [
    [1293, 406], // #9cc9e3

    [1295, 402], // #9cc9e4

    [1296, 399], // #9cc9e4
  ];
  const { points } = await adb.getPixelColor(buf, input);
  console.info(input);
  console.info(points);
};

main().catch(console.error);
