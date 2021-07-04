import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import AuthContext from '../../AuthContext';
import CustomSnackBar from '../CustomSnackbar';
import { CHANGE_PASSWORD_ALERT as PASSWORD_ALERT } from '../../utils/AlertInfo';
export default function ChangePasswordDialog(props) {
  const token = React.useContext(AuthContext).user;
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    severity: "",
    message: "",
  })

  const handleClose = () => {
    props.setOpen(false);
  };

  const [infos, setInfos] = useState({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
  });

  const handleChange = name => event => {
    setInfos({
      ...infos,
      [name]: event.target.value
    });
  };
  
  const [error, setError] = useState({
      error: false,
      help_text: ''
  })

  const handleErrorClick = () => event => {
      setError({
        error: false,
        help_text: ''
      })
  }
  const handleSubmit = () => event => {
    event.preventDefault();
    if (infos.confirmPassword !== infos.newPassword) {
        setError({
            error: true,
            help_text: 'Confirm Password not match New Password'
        })
    } else {
        axios.post('/user/profile/password/change', {
            old_password: infos.oldPassword,
            new_password: infos.newPassword,
            token
        }).then(res => {
            if (res.status === 200) {
                setAlertInfo(PASSWORD_ALERT);
                setAlertOpen(true);
            } else {
                setError({
                    error: true,
                    help_text: 'Old Password is not correct'
                })
            }
        })
    }
  }

  return (
    <div>
      <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Change Password</DialogTitle>
        <form onSubmit={handleSubmit()}>
            <DialogContent>
            <TextField
                error={error.error}
                helperText={error.help_text}
                autoFocus
                variant="outlined"
                margin="dense"
                label="Old Password"
                type="password"
                onChange={handleChange('oldPassword')}
                onClick={handleErrorClick()}
                fullWidth
                required
            />
            <TextField
                error={error.error}
                helperText={error.help_text}
                style={{marginTop: '20px'}}
                autoFocus
                variant="outlined"
                margin="dense"
                label="New Password"
                type="password"
                onChange={handleChange('newPassword')}
                onClick={handleErrorClick()}
                fullWidth
                required
            />
            <TextField
                error={error.error}
                helperText={error.help_text}
                style={{marginTop: '20px'}}
                autoFocus
                variant="outlined"
                margin="dense"
                label="Confirm New Password"
                type="password"
                onChange={handleChange('confirmPassword')}
                onClick={handleErrorClick()}
                fullWidth
                required
            />
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="primary">
                Close
            </Button>
            <Button type='submit' color="primary">
                Confirm
            </Button>
            </DialogActions>
        </form>
        {alertOpen && 
        <CustomSnackBar 
          severity={alertInfo.severity}
          message={alertInfo.message}
          open={alertOpen}
          setOpen={setAlertOpen}
        />
      }
      </Dialog>
    </div>
  );
}
