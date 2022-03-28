class Config {
  constructor() {
    this._accessTokenExpiresTime = 1 * 60000; // 1 minute in ms
    this._refreshTokenExpiresTime = 30 * 24 * 60 * 60 * 1000; // 30 days in ms
    this._confirmationTokenExpiresTime = 1 * 60 * 60 * 1000; // 1 hour in ms
    this._resetPasswordTokenExpiresTime = 5 * 60000; // 5 minutes in ms
    this._socketRequestTokenExpiresTime = 15 * 1000; // 15 seconds in ms
  }
}

module.exports = Config;
