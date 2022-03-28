const mainTemplate = require('./templates/main');

class EmailTemplates {
  /**
   * This method gets mail email template
   *
   * @param {string} subject - Email subject
   * @param {string} body - Email HTML body
   * @param {string} [type=service] - Email type (e.g. service, ads, promotion and so on)
   * @returns {string} Email HTML
   */
  main(subject = '', body = '', type = 'service') {
    return mainTemplate(subject, body, type);
  }
}

module.exports = new EmailTemplates();
