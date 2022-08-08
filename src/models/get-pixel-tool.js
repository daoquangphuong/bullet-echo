const adb = require('./adb');

const main = async () => {
  const buf = await adb.screenCapture();
  const input = [
    [1152, 603], // #499ebd

    [1152, 620], // #499ebd

    [1164, 612], // #499ebd

    [1172, 602], // #499ebd

    [1173, 620], // #499ebd
  ];
  const { points } = await adb.getPixelColor(buf, input);
  console.info(input, ',');
  console.info(points);
};

main().catch(console.error);
