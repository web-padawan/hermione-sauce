const uuid = require('uuid');
const { promisify } = require('util');
const sauceConnectLauncher = require('sauce-connect-launcher');
const launchSauceConnect = promisify(sauceConnectLauncher);

module.exports = class Sauce {
  static create(config) {
    return new this(config);
  }

  constructor(config) {
    this._config = config;
    this._sauceConnectProcess = null;
  }

  async start() {
    const { username, accessKey, verbose } = this._config;

    const gridUrl = `http://${username}:${accessKey}@ondemand.saucelabs.com:80/wd/hub`;
    const tunnelIdentifier = uuid.v4();

    this._sauceConnectProcess = await launchSauceConnect({
      username,
      accessKey,
      logger: console.log,
      verbose,
      tunnelIdentifier
    });

    return { gridUrl, tunnelIdentifier };
  }

  stop() {
    return this._sauceConnectProcess.close();
  }
};
