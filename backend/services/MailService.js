const nodemailer = require('nodemailer');

const ConfirmationCode = require('../models/ConfirmationCodesModel');
const ConfirmationCodesService = require('./ConfirmationCodesService');

const EmailTemplates = require('../lib/EmailTemplates');

const Config = require('./Config');

const { converter, toObjectId } = require('../utills');

const getMailTextFromHTML = (HTML = '') =>
  `The letter may not be displayed correctly. ${HTML.replace(
    /<\/p>/g,
    '\n'
  ).replace(
    /<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[\^'">\s]+))?)+\s*|\s*)\/?>/g,
    ''
  )}`;

class MailService extends Config {
  constructor() {
    super('_confirmationTokenExpiresTime _resetPasswordTokenExpiresTime');

    this.__confirmationTokenTime = converter.millisecondsToMinutes(
      this._confirmationTokenExpiresTime
    );
    this.__resetPasswordTokenTime = converter.millisecondsToMinutes(
      this._resetPasswordTokenExpiresTime
    );
    this._transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE,
      host: process.env.SMTP_HOST,
      port: +process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  /**
   * This method sends confirmation email mail
   *
   * @async
   * @param {string} to - User email
   * @param {string} subject - Mail subject
   * @param {string} HTML - Mail HTML
   * @param {string} text - Mail text
   * @returns {Promise<Object>} Sended mail data
   */
  async _sendMail(to = '', subject = '', HTML = '', text = '') {
    const mailText = !text ? getMailTextFromHTML(HTML) : text;

    const data = await this._transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html: HTML,
      text: mailText,
    });

    return data;
  }

  /**
   * This method sends confirmation mail
   *
   * @async
   * @param {string} to - User email
   * @param {string} link - Confirmation link
   * @returns {Promise<boolean>} True if everything good
   */
  async sendConfirmationMail(to = '', link = '') {
    const subject = 'Account activation';
    const mailPlainText = `To activate an account on ${process.env.CLIENT_URL} follow this link - ${link}. The link is valid for ${this.__confirmationTokenTime} minutes.`;
    const mailHTMLContent = `To activate an account on <a href="${process.env.CLIENT_URL}">${process.env.CLIENT_URL}</a> follow <a href="${link}">this link</a>. The link is valid for ${this.__confirmationTokenTime} minutes.`;

    const HTML = EmailTemplates.main(subject, mailHTMLContent, 'service');

    await this._sendMail(to, subject, HTML, mailPlainText);

    return true;
  }

  /**
   * This method sends reset password mail
   *
   * @async
   * @param {string} to - User email
   * @param {string} link - Confirmation link
   * @returns {Promise<boolean>} True if everything good
   */
  async sendResetPasswordMail(to = '', link = '') {
    const clientUrl = process.env.CLIENT_URL;
    const subject = 'Password recovery';
    const mailPlainText = `There was a request to recover the account password at ${clientUrl}. If you sent the request, follow the link - ${link}. The link is valid for ${this.__resetPasswordTokenTime} minutes. If you have not made a request, urgently change the password on the mail and account ${clientUrl}.`;
    const mailHTML = `There was a request to reset the account password at <a href="${clientUrl}">${clientUrl}</a>. If you submitted the request, go to <a href="${link}">this link</a>. The link is valid for ${this.__resetPasswordTokenTime} minutes. If you have not made a request, urgently change the password on the mail and account <a href="${clientUrl}">${clientUrl}</a>.`;

    const HTML = EmailTemplates.main(subject, mailHTML, 'service');

    await this._sendMail(to, subject, HTML, mailPlainText);

    return true;
  }

  /**
   * This method creates new email confirmation
   *
   * @async
   * @param {string} userId - User id
   * @param {string} code - Confirmation code
   * @returns {Promise<boolean>} True if everything good
   */
  async createEmailConfirmation(userId = '', code = '') {
    // const document = await ConfirmationCode.findOne({
    //   userId: Types.ObjectId(userId),
    // });

    // const date = Date.now();

    // const confirmationObject = {
    //   code,
    //   type: 'email',
    //   isConfirmed: false,
    //   date,
    //   lastMailRequest: date,
    // };

    // // Create a new document
    // if (!document) {
    //   const newConfirmationCode = new ConfirmationCode({
    //     userId: Types.ObjectId(userId),
    //     confirmations: [confirmationObject],
    //   });

    //   const { _id } = await newConfirmationCode.save();

    //   await UserService.connectWithDocument(userId, _id, 'emailConfirations');

    //   return true;
    // }
    // // Document already exists
    // document.confirmations.push(confirmationObject);

    // await document.save();

    await ConfirmationCodesService.addEmailConfirmationCode(userId, code);

    return true;
  }

  /**
   * This method does email confirmation
   *
   * @async
   * @param {string} userId - User id
   * @param {string} code - Confirmation code
   * @returns {Promise<object>} Error field if error
   */
  async emailConfirmation(userId = '', code = '') {
    const confirmationDocument = await ConfirmationCode.findOne({
      user: toObjectId(userId),
    });

    const confirmations = confirmationDocument.emailConfirmations.filter(
      ({ type }) => type === 'email'
    );

    const lastIndex = confirmations.length - 1;

    const { isConfirmed, code: confirmationCode } = confirmations[lastIndex];

    if (isConfirmed) {
      return { error: 'Email already confirmed' };
    }

    if (confirmationCode !== code) {
      return { error: 'Verification code did not match' };
    }

    // Make confirmation
    confirmationDocument.emailConfirmations[lastIndex] = {
      ...confirmations[lastIndex].toObject(),
      isConfirmed: true,
      confirmedAt: Date.now(),
    };

    await confirmationDocument.save();

    return { error: null };
  }
}

module.exports = new MailService();
