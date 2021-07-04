import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import AuthContext from '../AuthContext';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  grid: {
    width: "75%",
  },
}));

export default function RegisterLastPage(props) {
  const classes = useStyles();
  const token = useContext(AuthContext).user;


  return (
    <div className={classes.root}>
      <Grid className={classes.grid} container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h3" style={{textAlign: "center"}}>
            Welcome to V-Gifts
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="outlined" 
            color="secondary"
            style={{width: "100%"}} 
            component={Link}
            to={`/profile/${token}`}
          >
            My Profile
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="contained" 
            color="primary"
            style={{width: "100%"}} 
            component={Link}
            to={`/products`}
          >
            Enter the Market
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}