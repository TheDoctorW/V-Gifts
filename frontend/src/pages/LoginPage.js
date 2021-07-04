import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ForgetPasswordDialog from '../components/Dialog/ForgetPasswordDialog';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';

const ERROR = 465;
const INCORRECT_USERNAME = 464;

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" to="/">
        V-Gift
            </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    // backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundImage: `url(/img/home/home-1.jpg)`,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  adminButton: {
    position: "fixed",
    bottom: 0,
    // left: 10,
    marginLeft: "1rem",
    marginBottom: "1rem",
  }
}));

function LoginPage({ setAuth, ...props }) {
  const [infos, setInfos] = React.useState({
    account_name: "",
    password: "",
    showPassword: false,
  });

  const handleChange = name => event => {
    setInfos({
      ...infos,
      [name]: event.target.value
    });
  };

  const [state, setState] = React.useState({
    error: false,
    help_text: ""
  });

  const handle_error = () => event => {
    setState({
      error: false,
      help_text: ""
    });
  };


  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post('user/login', { ...infos })
      .then((response) => {
        const data = response.data;
        console.log(data.code);
        if (data.code === ERROR) {
          setState({
            error: true,
            help_text: "Invalid account name/Password error"
          });
        } else if (data.code === INCORRECT_USERNAME) {
          setState({
            error: true,
            help_text: "Invalid account name"
          });
        }
        else {
          // mark the user as signed-in in local storage, it will be removed when it is logged out
          setAuth(data.token, data.user_id);

          // direct the user to the market page
          props.history.push('/products');
        }

      })

  }
  const [openDialog, setOpenDialog] = useState(false);
  const handleForgetPassword = () => event => {
    setOpenDialog(true);
  }

  const classes = useStyles();
  const theme = useTheme();

  const handleClickShowPassword = () => {
    setInfos({ ...infos, showPassword: !infos.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
                  </Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              error={state.error}
              helperText={state.help_text}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Account Name"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleChange('account_name')}
              onClick={handle_error()}
            />
            <OutlinedInput
              type={infos.showPassword ? 'text' : 'password'}
              value={infos.password}
              error={state.error}
              helperText={state.help_text}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              // type="password"
              placeholder="Password"
              id="password"
              autoComplete="current-password"
              onChange={handleChange('password')}
              onClick={handle_error()}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {infos.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link button variant="body2" color={theme.palette.secondary.contrastText} onClick={handleForgetPassword()}>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/register" variant="body2" color={theme.palette.primary.contrastText}>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
        <Button
          className={classes.adminButton}
          color='secondary'
          variant='outlined'
          component={Link}
          to={'/admin/login'}
        >
          Admin Login
        </Button>
      </Grid>
      <ForgetPasswordDialog open={openDialog} setOpen={setOpenDialog}/>
    </Grid>
  );
}

export default LoginPage;
