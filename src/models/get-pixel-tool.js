const adb = require('./adb');

const main = async () => {
  const buf = await adb.screenCapture();
  const input = [
    [1061, 611], // #499ebd

    [1072, 611], // #499ebd

    [1079, 612], // #499ebd

    [1088, 620], // #499ebd

    [1088, 603], // #499ebd
  ];
  const { points } = await adb.getPixelColor(buf, input);
  console.info(input, ',');
  console.info(points);
};

main().catch(console.error);
