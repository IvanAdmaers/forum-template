import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { MenuItem, IconButton, Badge } from '@mui/material';
import {
  Mail as MailIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';

import Link from 'components/MyLink';

const Wrapper = ({ children, mobile }) => {
  if (mobile) {
    return <MenuItem>{children}</MenuItem>;
  }

  return children;
};

Wrapper.defaultProps = {
  mobile: PropTypes.bool,
};

Wrapper.propTypes = {
  mobile: PropTypes.bool,
  children: PropTypes.node,
};

const Notifications = forwardRef(({ mobile, count, messages }, ref) => {
  const type = !messages ? 'Notifications' : 'Messages';
  const ariaLabelType = !messages ? 'notifications' : 'messages';

  const href = !messages ? '/notifications' : '/chats';

  return (
    <Link href={href} ref={ref}>
      <Wrapper mobile={mobile}>
        <IconButton
          aria-label={`show ${count} new ${ariaLabelType}`}
          color="inherit"
          size="large">
          <Badge badgeContent={count} color="secondary">
            {!messages ? <NotificationsIcon /> : <MailIcon />}
          </Badge>
        </IconButton>
        {mobile && <p>{type}</p>}
      </Wrapper>
    </Link>
  );
});

Notifications.displayName = 'Notifications';

Notifications.defaultProps = {
  mobile: false,
  count: 0,
  messages: false,
};

Notifications.propTypes = {
  mobile: PropTypes.bool,
  count: PropTypes.number,
  messages: PropTypes.bool,
};

export default Notifications;
