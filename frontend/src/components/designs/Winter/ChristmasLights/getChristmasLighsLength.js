const lightWidth = 12;
const marginBetweenItems = 20 + 20;
const lengthOfFirstHiddenItems = 1;
const additionalItemsLength = lengthOfFirstHiddenItems + 1;

const getChristmasLighsLength = (totalWidth) => {
  const full = Math.ceil(totalWidth / (lightWidth + marginBetweenItems));

  const total = full + additionalItemsLength;

  return total;
};

export default getChristmasLighsLength;
