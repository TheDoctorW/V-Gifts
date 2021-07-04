import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';

const COUNTDOWN_SECONDS = 60;
export default function ForgetPasswordDialog(props) {
    const handleClose = () => {
        props.setOpen(false);
    };
    const [timing, setTiming] = useState(false);
    const [second, setSecond] = useState(COUNTDOWN_SECONDS);
    const [email, setEmail] = useState('');
    const [error, setError] = useState({
        error: false,
        help_text: ''
    });
    useEffect(() => {
        let interval;
        if (timing) {
            interval = setInterval(() => {
                setSecond(preSecond => {
                if (preSecond <= 1) {
                    setTiming(false);
                    clearInterval(interval);
                    return COUNTDOWN_SECONDS;
                } else {
                    return preSecond - 1;
                }
                })
            }, 1000)
        }
        return () => clearInterval(interval);
  }, [timing])

  const handleSendClick = () => event => {
    setTiming(true);
    axios.post('/user/login/send_mail/', {
        email: email
    }).then(res => {
        if (res.status === 200) {
          console.log(res);
        } else {
          console.log(res);
          setError({
            error: true,
            help_text: `invalid email`
          })
        }
    })
  }

  const handleChange = () => event => {
      setEmail(event.target.value);
  }

  const handleErrorClick = () => event => {
      setError({
        error: false,
        help_text: ''
      })
  }

  return (
    <div>
      <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <form>
            <DialogTitle id="form-dialog-title">FORGET PASSWORD</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Send to your email address get a temporary password
                </DialogContentText>
                <TextField
                    error={error.error}
                    helperText={error.help_text}
                    variant="outlined"
                    margin="dense"
                    id="name"
                    label="Email Address"
                    type="email"
                    onChange={handleChange()}
                    onClick={handleErrorClick()}
                    style={{width: '75%', marginRight: '10px'}}
                />
                <Button variant="outlined" style={{marginTop: '7px'}} disabled={timing} onClick={handleSendClick()}>
                    {timing ? second : 'send'}
                </Button>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}