const adb = require('./adb');

const main = async () => {
  const buf = await adb.screenCapture();
  const input = [
    [832, 604], // #72ce19

    [1038, 605], // #67c70e

    [833, 658], // #64c50b

    [1039, 659], // #5ec204
  ];
  const { points } = await adb.getPixelColor(buf, input);
  console.info(input, ',');
  console.info(points);
};

main().catch(console.error);
