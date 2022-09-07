const adb = require('./adb');

const main = async () => {
  const buf = await adb.screenCapture();
  const input = [
    [864, 766], // #ed4722
    [1193, 769], // #eb441e
    [854, 847], // #ea431d
    [1179, 850], // #e9411b
    [1315, 764], // #72ce19
    [1639, 769], // #67c70e
    [1314, 849], // #64c50b
    [1633, 848], // #5ec205
  ];
  const { points } = await adb.getPixelColor(buf, input);
  console.info(input, ',');
  console.info(points);
};

main().catch(console.error);
