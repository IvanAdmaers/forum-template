import { SnackbarProvider } from 'notistack';

export const testingWithNotistack = (children, maxSnack = 3) => (
  <SnackbarProvider maxSnack={maxSnack}>{children}</SnackbarProvider>
);
