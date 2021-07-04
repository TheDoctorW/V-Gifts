import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AuthContext from '../../AuthContext';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button'
import axios from 'axios';
import { NOT_ENOUGH_FUND } from '../../utils/ErrorCode';
import { FUND_ALERT, THANKS_ALERT } from '../../utils/AlertInfo';


const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 5,
    overflow: "hidden",
    // height: "10rem",
    width: "100%",
  },
  grid: {
    //height: "10rem",
  },
  img: {
    //width: "10rem",
    height: "10rem",
    maxWidth: "100%",
    // margin: 10,
    padding: 10,
  },
}));

function CartProductCard(props) {
  const classes = useStyles();
  const theme = useTheme();
	const token = React.useContext(AuthContext).user;
  const item = props.item;

  // eslint-disable-next-line
  const [id, setID] = useState(item["product_id"]);
  // eslint-disable-next-line
  const [img, setImg] = useState(item["pic_link"]);
  // eslint-disable-next-line
  const [name, setName] = useState(item["product_name"]);
  const [amount, setAmount] = useState(item["amount"]);

  const handleDecrement = () => {
    if (amount - 1 <= 0) {
      setAmount(0);
    } else {
      setAmount(amount - 1);
    }

    axios.post("/user/cart/change", {
      token: token,
      "product_id": id,
      amount: amount-1,
    })
    .then((response) => {
      props.setReload(prev => prev + 1);
    })
    .catch((err) => {});
  };

  const handleIncrement = () => {
    setAmount(amount + 1);

    axios.post("/user/cart/change", {
      token: token,
      "product_id": id,
      amount: amount+1,
    })
    .then((response) => {
      // props.handleTotalPaymentChange(price);
      props.setReload(prev => prev + 1);

    })
    .catch((err) => {});
  };

  const handlePurchase = () => {
    let info = [
      [id, amount]
    ];

    let payload = {
      token: token,
      list: info,
    };

    axios({
      url: "/order/new",
      method: "post",
      data: payload,
    })
    .then(response => {
      const data = response.data;

      if (data.code === NOT_ENOUGH_FUND) {
        props.setAlertInfo(FUND_ALERT);
        props.setAlertOpen(true);

      } else {
        // reload
        props.setAlertInfo(THANKS_ALERT);
        props.setAlertOpen(true);
        props.setReload(prev => prev + 1);
      }
    })
    .catch((err) => {
      console.log(err);
    });
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
        spacing={2}
        alignItems="center"
      >
        <Grid item xs={3}>
          <img className={classes.img} src={img} 
            // style={{
            //   border: `1px solid ${theme.palette.primary.contrastText}`
            // }}
            alt=""
          />
        </Grid>
        
        <Grid item xs={3}>
          {name}
        </Grid>
        <Grid item xs={2}>
          <p>Quantity: {amount}</p>
          <p>{`Item price: $${item.price}`}</p>
          <p>{`Total price: $${item.cost}`}</p>
        </Grid>
        <Grid container item xs={4} justify="flex-end">
          <Grid item xs={12}>
              <ButtonGroup>
                <IconButton color="secondary" onClick={handleDecrement} >
                  <RemoveCircleOutlineIcon />
                </IconButton>
                <IconButton color="secondary" onClick={handleIncrement} >
                  <AddCircleOutlineIcon />
                </IconButton>
                <Button variant="contained" color="primary" onClick={handlePurchase}>
                  Buy
                </Button>
              </ButtonGroup>
          </Grid>
        </Grid>
        <div>
        </div>
      </Grid>
    </div>
  );
}

export default CartProductCard;