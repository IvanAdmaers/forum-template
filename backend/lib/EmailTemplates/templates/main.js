const clientURL = process.env.CLIENT_URL;

const main = (subject = '', body = '', type = '') => `
<!DOCTYPE html
  PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Email</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin: 0; padding: 0;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc;">
      <tr>
        <td align="center" bgcolor="#3f51b5" style="padding: 40px 0 30px 0;">
          <img src="https://i.ibb.co/s3tRG2b/logo.png" alt="Logo" width="104"
            height="104" style="display: block;" />
        </td>
      </tr>
      <tr>
        <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
                <b>${subject}</b>
              </td>
            </tr>
            <tr>
              <td
                style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                ${body}
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td bgcolor="#3f51b5" style="padding: 30px 30px 30px 30px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 10px;">
                Name &copy; ${new Date().getFullYear()}<br />
                You can <a href="${clientURL}/email/unsubscribe?type=${type}" style="color: #ffffff;">
                <font color="#ffffff">unsubscribe</font>
                </a> from this mailing list
              </td>
              <td align="right">
                <table border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                      <a href="https://validator.w3.org/">
                      <img src="http://www.w3.org/Icons/valid-xhtml10" alt="Valid XHTML 1.0 Transitional" height="31"
                        width="88" />
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

module.exports = main;
