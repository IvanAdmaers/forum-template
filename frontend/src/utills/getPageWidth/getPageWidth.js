/**
 * This function gets page width excluding the scrollbar
 *
 * @returns {number} Page width
 */
const getPageWidth = () =>
  Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );

export default getPageWidth;
