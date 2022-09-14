const adb = require('./adb');

const main = async () => {
  const buf = await adb.screenCapture();
  const input = [
    [900, 663], // #ee4823
    [1150, 669], // #eb441e
    [1242, 671], // #71ce19
    [1489, 673], // #67c70e
    [899, 762], // #ea431d
    [1154, 759], // #e9411a
    [1242, 761], // #63c509
    [1499, 766], // #5dc103
  ];
  const { points } = await adb.getPixelColor(buf, input);
  console.info(input, ',');
  console.info(points);
};

main().catch(console.error);
