import React, { useEffect, useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import axios from 'axios';
import AuthContext from '../AuthContext';
import { Link } from 'react-router-dom';
import ButtonBase from '@material-ui/core/ButtonBase';
import { Button } from '@material-ui/core';
import {
  UPDATE_RECEIVE_ALERT as RECEIVE_ALERT,
  UPDATE_REFUND_ALERT as REFUND_ALERT
} from '../utils/AlertInfo';
import CustomSnackBar from './CustomSnackbar';

const useStyles = makeStyles((theme) => ({
    root: {
      margin: 5,
      borderRadius: 5,
      overflow: "hidden",
      width: "100%",
    },
    grid: {
      //height: "10rem",
    },
    img: {
      //width: "10rem",
      height: "10rem",
      width: "10rem",
      // maxWidth: "100%",
      // margin: 10,
      padding: 10,
    },
  }));

export default function OrderCard(props) {
    const classes = useStyles();
    const theme = useTheme();
    const token = React.useContext(AuthContext).user;
    const date = moment(parseFloat(props.purchase_date*1000)).format("YYYY-MM-DD HH:mm:ss");
    const [rating, setRating] = useState({
      disabled: props.rating === 0 ? false:true,
      value: props.rating
    });

    const [orderState, setOrderState] = useState(props.state_in_text);
    const [displayReceive, setDisplayReceive] = useState(false);
    const [displayRefund, setDisplayRefund] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertInfo, setAlertInfo] = useState({
      severity: "",
      message: "",
    })
    // eslint-disable-next-line
    useEffect(() => {
      if (props.state_in_text === 'Delivering') {
        setDisplayReceive(true);
      }
      if (props.state_in_text === 'Just purchase') {
        setDisplayRefund(true);
      }
    })
    
    const handleReceive = () => event => {
      axios.post('/order/receive', {
        token,
        order_id: props.order_id
      }).then(res => {
        if (res.status === 200) {
          setAlertInfo(RECEIVE_ALERT);
          setAlertOpen(true);
          setDisplayReceive(false);
          setOrderState('Done');
        }
      })
    }
    const handleRefund = () => event => {
      axios.post('/order/refund', {
        token,
        order_id: props.order_id
      }).then(res => {
        if(res.status === 200) {
          console.log(res);
          setAlertInfo(REFUND_ALERT);
          setAlertOpen(true);
          setOrderState('Cancelled / Refunded');
        }
      })
    }
  
    const handleChange = () => event => {
      console.log(event.target.value);
      console.log(props.order_id);
      console.log(token);
      
      axios.post('/order/rate',{
        "token": `${token}`,
        "order_id": parseInt(props.order_id),
        "rating": parseInt(event.target.value)
      }).then(res => {
        console.log(res);
      })
      
      setRating({
        disabled: true,
        value: event.target.value
      })
    }

    return (
        <div
      className={classes.root}
      style={{
        border: `1px solid ${theme.palette.primary.contrastText}`
      }}
    >
      <Grid
        className={classes.grid}
        container 
        spacing={3}
        alignItems="center"
      >
        <Grid item xs={2}>
          <ButtonBase
            className={classes.image}
            component={Link}
            to={`/product/${props.product_id}`}
          >
            <img className={classes.img} src={props.pic_link} alt='props.product_id' />
          </ButtonBase>
        </Grid>

        <Grid item xs={3}>
          {props.product_name}
        </Grid>
        <Grid item xs={1}>
          <p>Quantity: {props.amount}</p>
          <p>${props.cost}</p>
        </Grid>
        <Grid item xs={2}>
            <p>{date}</p>
            <p>{`State: ${orderState}`}</p>
        </Grid>
        <Grid item xs={2}>
          <Box component="fieldset" mb={3} borderColor="transparent">
            <Rating
              onChange={handleChange()}
              disabled={rating.disabled}
              value={rating.value}
              precision={0.5}
              emptyIcon={<StarBorderIcon fontSize="inherit" />}
            />
          </Box>
        </Grid>
        <Grid item xs={2}>
          {displayReceive && <Button variant="contained" color="primary" style={{marginBottom: '20px', width: '70%'}} onClick={handleReceive()}>Received</Button>}
          {displayRefund && <Button variant="contained" color="secondary" style={{marginBottom: '20px', width: '70%'}} onClick={handleRefund()}>Refund</Button>}
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