import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

const CustomDialog = ({
  title, text, isOpen, onAccept, onCancel,
}) => (
  <Dialog
    open={isOpen}
    onClose={onCancel}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">{text}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button variant="outlined" onClick={onCancel}>
        Cancelar
      </Button>
      <Button color="error" variant="outlined" onClick={onAccept} autoFocus>
        Aceptar
      </Button>
    </DialogActions>
  </Dialog>
);

export default CustomDialog;
