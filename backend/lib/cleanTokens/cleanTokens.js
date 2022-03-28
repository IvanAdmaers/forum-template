const path = require('path');

const TokenModel = require('../../models/TokenModel');

const { shouldClean, filterTokens } = require('./utills');
const { DateDifference, FileSystem } = require('../../utills');

const pathToLogFile = path.join(__dirname, 'log.json');

const cleanIncorrectRefreshTokens = async () => {
  const statistic = {
    startAt: null,
    endAt: null,
    checkedDocumentsNumber: null,
    shouldNotCleanDocumentsNumber: null,
    cleanedDocumentsNumber: null,
    totalTimeInSeconds: null,
  };

  try {
    const start = new Date();

    const tokens = await TokenModel.find().select('lastCleaning refreshTokens');

    let checkedDocumentsNumber = 0;
    let shouldNotCleanDocumentsNumber = 0;
    let cleanedDocumentsNumber = 0;

    const promises = [];

    for (let i = 0; i < tokens.length; i += 1) {
      const token = tokens[i];

      checkedDocumentsNumber += 1;

      const { lastCleaning, refreshTokens } = token;

      const should = shouldClean(lastCleaning, 3);

      if (!should) {
        shouldNotCleanDocumentsNumber += 1;

        continue;
      }

      const freshTokens = filterTokens(refreshTokens);

      token.refreshTokens = freshTokens;

      token.lastCleaning = new Date();

      promises.push(token.save());

      cleanedDocumentsNumber += 1;
    }

    await Promise.all(promises);

    const end = new Date();

    const totalTime = DateDifference.inSeconds(start, end);

    // Statistik
    statistic.startAt = start;
    statistic.endAt = end;
    statistic.checkedDocumentsNumber = checkedDocumentsNumber;
    statistic.shouldNotCleanDocumentsNumber = shouldNotCleanDocumentsNumber;
    statistic.cleanedDocumentsNumber = cleanedDocumentsNumber;
    statistic.totalTimeInSeconds = totalTime;

    console.log(
      `🟢 Function cleanIncorrectRefreshTokens completed. Incorrected tokens are cleaned in ${totalTime} seconds`
    );
  } catch (e) {
    console.log(e);

    statistic.error =
      e.message ?? 'An error happend when cleaning incorrect tokens';
  } finally {
    const start = new Date();

    await (async () => {
      const isLogFileExists = await FileSystem.checkExists(pathToLogFile);

      // Create log file
      if (!isLogFileExists) {
        const fileBody = JSON.stringify([statistic]);

        await FileSystem.writeFile(pathToLogFile, fileBody);

        return;
      }

      // Write to file
      const file = await FileSystem.readFile(pathToLogFile);
      const fileObj = JSON.parse(file);

      fileObj.push(statistic);

      const fileJSON = JSON.stringify(fileObj);

      await FileSystem.writeFile(pathToLogFile, fileJSON);
    })();

    const end = new Date();

    console.log(
      `🟢 Function cleanIncorrectRefreshTokens wrote logs in ${DateDifference.inSeconds(
        start,
        end
      )} seconds`
    );
  }
};

module.exports = cleanIncorrectRefreshTokens;
