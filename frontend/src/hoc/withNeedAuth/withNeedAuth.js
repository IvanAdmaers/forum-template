import { useState } from 'react';

import NeedAuthPopup from 'components/Popups/NeedAuthPopup';

const withNeedAuth = (WrappedComponent) => {
  const NeedAuth = (props) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
      <WrappedComponent
        openPopup={handleOpen}
        popupElement={<NeedAuthPopup open={open} onClose={handleClose} />}
        {...props}
      />
    );
  };

  return NeedAuth;
};

export default withNeedAuth;
