/**
 * This function converts file to base64
 *
 * @function fileToBase64
 * @async
 * @param {object} file File from input type file
 * @returns {string} Base 64 file
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', () => resolve(reader.result));
    reader.addEventListener('error', (error) => reject(error));
  });
};

export default fileToBase64;
