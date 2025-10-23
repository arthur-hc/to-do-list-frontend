import { Snackbar, Alert, Button } from '@mui/material';

interface MyToastProps {
  open: boolean;
  onClose: () => void;
  severity: 'error' | 'warning' | 'info' | 'success';
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

function MyToast({
  open,
  onClose,
  severity,
  message,
  actionLabel,
  onAction,
}: MyToastProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        action={
          actionLabel ? (
            <Button color="inherit" size="small" onClick={onAction}>
              {actionLabel}
            </Button>
          ) : null
        }
        sx={{ width: '100%', borderRadius: 4 }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default MyToast;
