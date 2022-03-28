import PropTypes from 'prop-types';
import GoogleReCaptcha from 'react-google-recaptcha';

const publicKey = process.env.NEXT_PUBLIC_RE_CAPTCHA_2_PUBLIC_KEY;

const ReCaptcha2 = ({ hl, onChange, size, theme }) => (
  <GoogleReCaptcha
    hl={hl}
    sitekey={publicKey}
    onChange={onChange}
    size={size}
    theme={theme}
  />
);

ReCaptcha2.propTypes = {
  onChange: PropTypes.func,
  hl: PropTypes.string,
  size: PropTypes.string,
  theme: PropTypes.string,
};

ReCaptcha2.defaultProps = {
  onChange: () => null,
  hl: 'ru',
  size: 'normal',
  theme: 'light',
};

export default ReCaptcha2;
