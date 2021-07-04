import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { Container } from '@material-ui/core';
import axios from 'axios';
import AuthContext from '../../AuthContext';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: '40px'
  },
  grid: {
    width: "75%",
  },
  margin: {
      marginRight: '30px',
      marginTop: '20px'
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditProfileDialog(props) {
  const classes = useStyles();
  const token = React.useContext(AuthContext).user;
  const handleClose = () => {
    props.setOpen(false);
  };

  const [infos, setInfos] = useState({
    fname: "",
    lname: "",
    address: "",
    city: "",
    country: ""
  });

  const handleChange = name => event => {
    setInfos({
      ...infos,
      [name]: event.target.value
    });
  };

  const handleSubmit = () => event => {
    event.preventDefault();
    axios.post('/user/profile/edit', {...infos, token}).then(res => {
        if (res.status === 200) {
            props.setProfile({...infos})
            console.log(res);
        }
    })
  }

  return (
    <div>
      <Dialog fullScreen open={props.open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              EDIT PROFILE
            </Typography>
          </Toolbar>
        </AppBar>
        <form onSubmit={handleSubmit()}>
            <Container className={classes.container}>
                <Grid container className={classes.grid} item xs={12} spacing={1}>
                    <Grid item xs={6}>
                    <TextField
                        className={classes.margin}
                        label="First name"
                        placeholder="Enter First Name Here.."
                        id="first_name"
                        name="first_name"
                        onChange={handleChange('fname')}
                        variant="outlined"
                        fullWidth
                        required
                    />
                    </Grid>
                    <Grid item xs={6}>
                    <TextField
                        className={classes.margin}
                        label="Last name"
                        placeholder="Enter Last Name Here.."
                        name="last_name"
                        onChange={handleChange('lname')}
                        variant="outlined"
                        fullWidth
                        required
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                        className={classes.margin}
                        label="Address"
                        placeholder="Enter your Address Here.."
                        name="address"
                        onChange={handleChange('address')}
                        variant="outlined"
                        fullWidth
                        required
                    />
                    </Grid>
                    <Grid item xs={6}>
                    <TextField
                    className={classes.margin}
                        label="City"
                        placeholder="Enter City Name Here.."
                        name="city"
                        onChange={handleChange('city')}
                        variant="outlined"
                        fullWidth
                        required
                    />
                    </Grid>
                    <Grid item xs={6}>
                    <TextField
                    className={classes.margin}
                        label="Country"
                        placeholder="Select Country Name Here.."
                        name="country"
                        onChange={handleChange('country')}
                        variant="outlined"
                        fullWidth
                        required
                    />
                    </Grid>
                    <Grid item xs={4}>
                        <Button
                            variant="contained"
                            color="primary"
                            style={{width: "80%", marginLeft: '680px', marginTop: '20px'}}
                            type="submit"
                        >
                            Update
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </form>
      </Dialog>
    </div>
  );
}