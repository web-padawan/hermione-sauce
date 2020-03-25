const Sauce = require('./lib/sauce');

function expandCredentials(opts) {
  if (!opts.username) {
    opts.username = process.env.SAUCE_USERNAME;
  }
  if (!opts.accessKey) {
    opts.accessKey = process.env.SAUCE_ACCESS_KEY;
  }
  if (!opts.username || !opts.accessKey) {
    throw Error('Missing Sauce credentials. Did you forget to set SAUCE_USERNAME and/or SAUCE_ACCESS_KEY?');
  }
}

module.exports = (hermione, opts) => {
  expandCredentials(opts);

  const sauce = Sauce.create(opts);

  hermione.on(hermione.events.RUNNER_START, async() => {
    const { gridUrl, tunnelIdentifier } = await sauce.start();

    hermione.config.getBrowserIds().forEach(browserId => {
      const browser = hermione.config.forBrowser(browserId);
      browser.gridUrl = gridUrl;
      browser.desiredCapabilities['tunnel-identifier'] = tunnelIdentifier;
    });
  });

  hermione.on(hermione.events.RUNNER_END, () => {
    sauce.stop();
  });
}
