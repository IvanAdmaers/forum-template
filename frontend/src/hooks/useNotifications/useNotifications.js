import { useCallback } from 'react';
import { useSnackbar } from 'notistack';

const useNotifications = () => {
  const { enqueueSnackbar } = useSnackbar();

  const createNotification = useCallback(
    (message = '', variant = 'default', options = {}) => {
      const defaultProps = {
        variant,
        autoHideDuration: 2000,
        ...options,
      };

      enqueueSnackbar(message, defaultProps);
    },
    [enqueueSnackbar]
  );

  return createNotification;
};

export default useNotifications;
