class Converter {
  /**
   * This method converts milliseconds to minutes
   *
   * @param {number} milliseconds - Milliseconds
   * @returns {number} Minutes
   */
  millisecondsToMinutes(milliseconds = 0) {
    return milliseconds / 1000 / 60;
  }
}

module.exports = new Converter();
