const adb = require('./adb');

const main = async () => {
  const buf = await adb.screenCapture();
  const input = [
    [1078, 629], // #9cc9e4

    [1096, 619], // #9cc9e4

    [1088, 644], // #9cc9e4

    [1105, 641], // #9cc9e4
  ];
  const { points } = await adb.getPixelColor(buf, input);
  console.info(input);
  console.info(points);
};

main().catch(console.error);
