const adb = require('./adb');

const main = async () => {
  const buf = await adb.screenCapture();
  const input = [
    [468, 510], // #ed4722

    [699, 510], // #eb441e

    [465, 568], // #ea431d

    [705, 571], // #e9411a
  ];
  const { points } = await adb.getPixelColor(buf, input);
  console.info(input, ',');
  console.info(points);
};

main().catch(console.error);
