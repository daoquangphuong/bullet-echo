const adb = require('./adb');

const main = async () => {
  const buf = await adb.screenCapture();
  const input = [
    [1698, 192], // #ffffff

    [1726, 196], // #ffffff

    [1697, 223], // #ffffff

    [1726, 223], // #ffffff
  ];
  const { points } = await adb.getPixelColor(buf, input);
  console.info(input, ',');
  console.info(points);
};

main().catch(console.error);
