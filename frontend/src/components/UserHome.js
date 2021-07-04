import React, { useEffect, useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { useHistory } from 'react-router'
import CustomSnackBar from '../components/CustomSnackbar';
import {NEGATIVE_NUM_ALERT} from '../utils/AlertInfo';
import EditProfileDialog from '../components/Dialog/EditProfileDialog';
import ChangePasswordDialog from '../components/Dialog/ChangePasswordDialog';
import AttachMoneyOutlinedIcon from '@material-ui/icons/AttachMoneyOutlined';
import ListAltIcon from '@material-ui/icons/ListAlt';
import FaceIcon from '@material-ui/icons/Face';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';

const iconSize = 8;

const useStyles = makeStyles((theme) => ({
  root: {

  },
  gridItem: {
    height: theme.spacing(65),
  },
  cardTitle: {
    display: "flex",
    alignItems: "center",
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


function UserHome(props) {
    const classes = useStyles();
    const theme = useTheme();
    const history = useHistory();

    const token = props.token;
    const [profile, setProfile] = useState(props.profile);
    const [fundToAdd, setFundToAdd] = useState(profile['fund']);
    const [cart, setCart] = useState([]);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertInfo, setAlertInfo] = useState({
      severity: "",
      message: "",
    })

    React.useEffect((() => {
      axios.get('/user/profile', { 
        params: {
          token,
        }
      })
      .then((response) => {
        const data = response.data;
  
        setProfile({
          "first_name": data["first_name"],
          "last_name": data["last_name"],
          "username": data["username"],
          "email": data["email"],
          "address": data["address"],
          "fund": data["fund"],
        });
      })
      .catch((err) => {});
    }), [token, profile]);

    const [editDialog, setEditDialog] = useState(false);
    const [PasswordDialog, setPasswordDialog] = useState(false);
    const handleFundToAddChange = (e) => {
      setFundToAdd(e.target.value);
    }

    const handleAddFund = () => {
      if (fundToAdd < 0) {
        setAlertInfo(NEGATIVE_NUM_ALERT);
        setAlertOpen(true);

        return;
      }
      axios.post("/user/profile/fund/add", {
        token: token,
        num: fundToAdd,
      }).then((response) => {
        const data = response.data;
        console.log(data);
        history.go(0);
      })
      .catch((err) => {});
    }

    useEffect((() => {
      axios.get('/user/cart/list', {
        params: {
          token,
        }
      })
      .then((response) => {
        const data = response.data;
        console.log(data);
        setCart(data);
      })
      .catch((err) => {});

      axios.get('/user/cart/list', {
        params: {
          token,
        }
      })
      .then((response) => {
        const data = response.data;
        console.log(data);
        setCart(data);
      })
      .catch((err) => {});
    }), [token]);

    const handleEditDialogOpen = () => {
      setEditDialog(true);
    }

    const handleChangePasswordDialogOpen = () => {
      setPasswordDialog(true);
    }
  

    return (
      <div classeName={classes.root}>
        <Grid container spacing={3}>
          <Grid item md={3} xs={12}>
            <Card className={classes.gridItem} variant="outlined">
              <CardContent className={classes.cardContent}>
                <div className={classes.cardTitle}>
                  <FaceIcon className={classes.cardIcon}/>
                  <Typography variant="h4" classname={classes.cardTitleText}>
                    My Details
                  </Typography>
                </div>
                <Typography variant="h5" color={theme.palette.primary.contrastText} component="p">
                  Name: {profile["first_name"]} {profile["last_name"]}
                </Typography>
                <Typography variant="h5" color={theme.palette.primary.contrastText} component="p">
                  Username: {profile["username"]}
                </Typography>
                <Typography variant="h5" color={theme.palette.primary.contrastText} component="p">
                  Email: {profile["email"]}
                </Typography>
                <Typography variant="h5" color={theme.palette.primary.contrastText} component="p">
                  Address: {profile["address"]}
                </Typography>
                <Button variant="contained"color="primary" style={{marginTop: '10px'}} onClick={handleEditDialogOpen}>EDIT PROFILE</Button>
                <Button variant="contained"color="secondary" style={{marginTop: '10px'}} onClick={handleChangePasswordDialogOpen}>CHANGE PASSWORD</Button>
              </CardContent>
            </Card>
            <EditProfileDialog profile={profile} setProfile={setProfile} open={editDialog} setOpen={setEditDialog}/>
            <ChangePasswordDialog open={PasswordDialog} setOpen={setPasswordDialog}/>
          </Grid> 

          <Grid item md={3} xs={12}>
            <Card className={classes.gridItem}  variant="outlined">
              <CardContent className={classes.cardContent}>
                <div 
                  className={classes.cardTitle}
                >
                  <AttachMoneyOutlinedIcon className={classes.cardIcon}/>
                  <Typography variant="h4" classname={classes.cardTitleText}>
                    Balance
                  </Typography>
                </div>
                <Typography variant="h5" color={theme.palette.primary.contrastText} component="p">
                  {`$${profile['fund']} left`} 
                </Typography>

                <Typography variant="h5" color={theme.palette.primary.contrastText} style={{marginTop: "1rem"}}>
                  Add Fund:
                </Typography>
                <TextField
                  id="outlined-number"
                  label="Number"
                  type="number"
                  size="small"
                  value={fundToAdd}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  style={{
                    marginBottom: "1rem",
                  }}
                  inputProps={{
                    step: 100,
                    min: 0,
                  }}
                  onChange={handleFundToAddChange}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddFund}
                >
                  Add
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card className={classes.gridItem} variant="outlined">
              <CardContent className={classes.cardContent}>
                <div className={classes.cardTitle}>
                  <ShoppingCartOutlinedIcon className={classes.cardIcon}/>
                  <Typography variant="h4" classname={classes.cardTitleText}>
                    Cart
                  </Typography>
                </div>
                <Typography variant="h5" color={theme.palette.primary.contrastText} component="p">
                  {cart.length} items in cart
                </Typography>
              </CardContent>
            </Card>
          </Grid> 
          <Grid item md={3} xs={12}>
            <Card className={classes.gridItem} variant="outlined">
              <CardContent className={classes.cardContent}>
                <div className={classes.cardTitle}>
                  <ListAltIcon className={classes.cardIcon}/>
                  <Typography variant="h4" classname={classes.cardTitleText}>
                    Orders
                  </Typography>
                </div>
                <Typography variant="h5" color={theme.palette.primary.contrastText} component="p">
                  {props.ordersNum} orders in total
                </Typography>

              </CardContent>
            </Card>
          </Grid> 
        </Grid>
        {alertOpen && 
          <CustomSnackBar 
            severity={alertInfo.severity}
            message={alertInfo.message}
            open={alertOpen}
            setOpen={setAlertOpen}
          />
        }
      </div>
    );
}

export default UserHome;