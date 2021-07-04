import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import QuantitySelect from './QuantitySelect';
import AuthContext from '../AuthContext';
import PurchaseSucessModal from '../components/modals/PurchaseSuccessModal';
import NotLoginModal from '../components/modals/NotLoginModal';
import { FUND_ALERT } from '../utils/AlertInfo';
import { NOT_ENOUGH_FUND } from '../utils/ErrorCode';
import CustomSnackBar from './CustomSnackbar';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "Column",
    alignItems: "center",
  },
  grid: {
    width: "80%",
  },
  image: {
    width: "20rem",
    height: "20rem",
  },
  imageContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
  details: {
    display: "flex",
    flexDirection: "column",
  }
}));

export default function Product(props) {
  const classes = useStyles();
  // eslint-disable-next-line
  const theme = useTheme();
  const token = React.useContext(AuthContext).user;

  const id = props.id;
  const [infos, setInfos] = React.useState({
    id: props.id,
    name: "",
    price: 100,
    description: "",
    delivery: "",
    rating: "",
    img: "",
  });
  const [amount, setAmount] = React.useState(1);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    severity: "",
    message: "",
  });


  React.useEffect((() => {
    axios.get('/product/get_info', {
      params: {
        id,
      }
    })
      .then((response) => {
        const data = response.data;
        
        setInfos({
          name: data['name'],
          price: data['price'],
          description: data['description'],
          delivery: data['delivery'],
          rating: data['rating'],
          img: data['pic_link'],
        });
      })
      .catch((err) => {});
  }), [id]);

  const handleIncrement = () => {
    setAmount(amount + 1);
  };

  const handleDecrement = () => {
    if (amount - 1 >= 1) {
      setAmount(amount - 1);
    } else {
      setAmount(1);
    }
  };

  const [psModalOpen, setPsModalOpen] = useState(false);
  const [nlModalOpen, setNlModalOpen] = useState(false);
  const [modalType, setModalType] = useState(1);


  const handlePsModalOpen = () => {
    setPsModalOpen(true);
  };

  const handlePsModalClose = () => {
    setPsModalOpen(false);
  };
  const handleNlModalOpen = () => {
    setNlModalOpen(true);
  };

  const handleNlModalClose = () => {
    setNlModalOpen(false);
  };


  const handlePurchase = () => {
    if (!token) {
      handleNlModalOpen();
      return;
    }

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
        setAlertInfo(FUND_ALERT);
        setAlertOpen(true);
      } else {
        setModalType(1);
        handlePsModalOpen();
      }

    })
    .catch((err) => {
      console.log(err);
    });
  };

  const handleAddToCart = () => {
    if (!token) {
      handleNlModalOpen();
      return;
    }

    axios.post("/user/cart/add",
      {
        token: token,
        product_id: id,
        amount: amount,
      }
    )
    .then((response) => {
      props.setNavbarReload();
      setModalType(2);
      handlePsModalOpen();
    })
    .catch((err) => {});
  };


  return (
    <div className={classes.root}>
      <Grid
        container 
        className={classes.grid}
        spacing={5}
        direction="row"
        justify="flex-end"
      >
        <Grid
          className={classes.imageContainer}
          item 
          sm={5}
          xs={12}
        >
          <img className={classes.image} src={infos.img} alt="product"/>
        </Grid>
        <Grid
          container
          item
          sm={7}
          xs={12}
          spacing={2}
        >
          <Grid item xs={12}>
            <Typography variant="h4">
              {infos.name}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Rating 
              name={`product-rating`} 
              value={infos.rating} 
              precision={0.5} 
              readOnly
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4">
              ${infos.price}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant='body1'
            >
              {infos.description}
            </Typography>
          </Grid>
          {/* <Grid item xs={12}>
            <Typography
              variant='body1'
            >
              Delivery: ${infos.delivery}
            </Typography>
          </Grid> */}
          <Grid container item xs={12}>
            <Grid item xs={2}>
              <QuantitySelect
                amount={amount}
                handleIncrement={handleIncrement}
                handleDecrement={handleDecrement}
              />
            </Grid>
          </Grid>
          <Grid  container item xs={12}>
            <Grid item xs={3}>
              Total: ${amount * infos.price}
            </Grid>
          </Grid>

          <Grid
            container
            item
            xs={12}
            alignItems="center"
            spacing={1}
          >
            <Grid item xs={6} sm={3} >
              <Button
                variant="contained"
                color="primary"
                onClick={handlePurchase}
                style={{
                  width: "100%"
                }}
              >
                Purchase
              </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={handleAddToCart}
                style={{
                  width: "100%"
                }}
              >
                Add to Cart
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <PurchaseSucessModal
        handleClose={handlePsModalClose}
        open={psModalOpen}
        token={token}
        type={modalType}
      />
      <NotLoginModal
        handleClose={handleNlModalClose}
        open={nlModalOpen}
        token={token}
      />
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
