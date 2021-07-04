import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import StoreIcon from '@material-ui/icons/Store';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import FaceIcon from '@material-ui/icons/Face';

const iconSize = 8;

const useStyles = makeStyles((theme) => ({
  root: {

  },
  gridItem: {
    height: theme.spacing(65),
  },
  cardTitle: {
    display: "flex",
    marginBottom: theme.spacing(1),
  },
  cardIcon: {
    width: theme.spacing(iconSize),
    height: theme.spacing(iconSize),
    marginRight: theme.spacing(0.5),
  },
  cardTitleText: {
    textDecoration: "none",
    fontWeight: "200",
    color: theme.palette.primary.contrastText,
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
  }
}));


function AdminHome(props) {
    const classes = useStyles();
    const theme = useTheme();

    return (
      <div classeName={classes.root}>
        <Grid container spacing={3}>
          <Grid item md={3} xs={12}>
            <Card className={classes.gridItem} variant="outlined">
              <CardContent className={classes.cardContent}>
                <div className={classes.cardTitle}>
                  <StoreIcon className={classes.cardIcon}/>
                  <Typography variant="h3" classname={classes.cardTitleText}>
                    Market
                  </Typography>
                </div>
                <Typography variant="h5" color={theme.palette.primary.contrastText} component="p">
                  {props.productsNum} products in total
                </Typography>
              </CardContent>
            </Card>
          </Grid> 
          <Grid item md={3} xs={12}>
            <Card className={classes.gridItem} variant="outlined">
              <CardContent className={classes.cardContent}>
                <div className={classes.cardTitle}>
                  <FaceIcon className={classes.cardIcon}/>
                  <Typography
                    variant="h3"
                    classname={classes.cardTitleText}
                  >
                    Users
                  </Typography>
                </div>
                <Typography variant="h5" color={theme.palette.primary.contrastText} component="p">
                  {props.usersNum} users registered
                </Typography>
              </CardContent>
            </Card>
          </Grid> 
          <Grid item md={3} xs={12}>
            <Card className={classes.gridItem} variant="outlined">
              <CardContent className={classes.cardContent}>
                <div className={classes.cardTitle}>
                  <AttachMoneyIcon className={classes.cardIcon}/>
                  <Typography variant="h3" classname={classes.cardTitleText}>
                    Orders
                  </Typography>
                </div>
                <Typography variant="h5" color={theme.palette.primary.contrastText} component="p">
                  {props.ordersNum} orders in total
                </Typography>
              </CardContent>
            </Card>
          </Grid> 
          <Grid item md={3} xs={12}>
            <Card className={classes.gridItem}  variant="outlined">
              <CardContent className={classes.cardContent}>
                <div className={classes.cardTitle}>
                  <SupervisorAccountIcon className={classes.cardIcon}/>
                  <Typography variant="h3" classname={classes.cardTitleText}>
                    Admins
                  </Typography>
                </div>
                <Typography variant="h5" color={theme.palette.primary.contrastText} component="p">
                  {props.adminsNum} Admins in total
                </Typography>
              </CardContent>
            </Card>
          </Grid> 
        </Grid>
      </div>
    );
}

export default AdminHome;