import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  loginButton: {
    marginRight: theme.spacing(2),
    // width: "5rem",
  },
  registerButton: {
    //width: "5rem",
  },
  toolBar: {
    minHeight: "10vh",
  },
  logo: {
    margin: "auto",
    textAlign: 'center',
    maxWidth: "auto",
    maxHeight: '7vh',
    marginRight: "0.5rem",
  },
}));

export default function ButtonAppBar() {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <div className={classes.root}>
      <AppBar
        position="static" 
        style={{
          boxShadow: 'none',
          backgroundColor: theme.palette.primary.main,
        }}
      >
        <Toolbar className={classes.toolBar} >
          <img 
            className={classes.logo} 
            src="img/logo/logo-1.png" 
            alt="V-Gifts logo"
          />
          <Typography
						style={{
							textDecoration: "none",
              fontWeight: "200",
              color: theme.palette.primary.contrastText
						}}
						color="inherit"
						component={Link}
						to={'/'}
						className={classes.title} 
						variant="h4"
						noWrap
					>
            V-Gifts
          </Typography>

          <Button 
            className={classes.loginButton} 
            color="inherit" 
            variant="outlined"
            component={Link}
            to={"/login"}
          >
            Log in
          </Button>
          <Button 
            className={classes.registerButton} 
            color="inherit" 
            variant="outlined"
            component={Link}
            to={"/register"}
          >
            Register
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
