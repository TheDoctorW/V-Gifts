import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import AuthContext from '../AuthContext';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { NOT_ENOUGH_FUND } from '../utils/ErrorCode';
import { FUND_ALERT } from '../utils/AlertInfo';


const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  media: {
    width: "auto",
    maxHeight: "20rem",
  },
  actionArea: {
    flexGrow: 1,
  },
  CardActions: {

  },
}));

export default function ProductCardNew(props) {
    const classes = useStyles();
    const theme = useTheme();
    const token = React.useContext(AuthContext).user;

    // eslint-disable-next-line
    const [id, setId] = useState(props.id);
    // eslint-disable-next-line
    const [name, setName] = useState(props.name);
    // eslint-disable-next-line
    const [price, setPrice] = useState(props.price);
    // eslint-disable-next-line
    const [rating, setRating] = useState(props.rating);
    // eslint-disable-next-line
    const [img, setImg] = useState(props.img);


    const handleAddToCart = () => {
      if (!token) {
        // alert later!
        props.handleNlModalOpen();
        return;
      }

      axios.post("/user/cart/add",
        {
          token: token,
          product_id: id,
          amount: 1,
        }
      )
      .then((response) => {
        props.setModalType(2);
        props.handlePsModalOpen();
        props.setNavbarReload(prev => prev + 1);
        // props.setNavbarReload(false);
      })
      .catch((err) => {});
    };

    const handlePurchase = () => {
      if (!token) {
        // alert later!
        props.handleNlModalOpen();
        return;
      }
  
      let info = [
        [id, 1]
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
          return;
        }
        props.setModalType(1);
        props.handlePsModalOpen();
      })
      .catch((err) => {
        console.log(err);
      }); 
    };

    return (
      <Card className={classes.root}>
        <CardActionArea
          className={classes.actionArea}
          component={Link}
          to={`/product/${id}`}
        >
          <div
            style={{
              display: "flex",
              alignItem: "center",
              justifyContent: "center"
            }}
          >
            <CardMedia
              style={{
                width: "auto",
                maxHeight: "190px"
              }}
              component="img"
              image={img}
              title="Contemplative Reptile"
            />
          </div>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {`${name.split(" ").splice(0, 15).join(" ")}`}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Grid container style={{width: "100%"}} spacing={1}>
            <Grid item xs={5}>
              <Button
                onClick={handleAddToCart}
                variant="outlined"
                size="small"
                style={{
                  // width: "9rem",
                  width: "100%",
                  height: "100%",
                  color: theme.palette.primary.contrastText,
                }}
              >
                <Typography variant="body2" style={{ cursor: 'pointer' }}>
                    <ShoppingCartIcon /> Add to Cart
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={5}>
              <Button
                onClick={handlePurchase}
                variant="outlined"
                size="small"
                style={{
                  // width: "9rem",
                  width: "100%",
                  height: "100%",
                  color: theme.palette.primary.contrastText,
                }}
              >
                <Typography variant="body2" style={{ cursor: 'pointer' }}>
                  Purchase
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="h5" style={{textAlign: "end"}}>
                ${price}
              </Typography>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
        // <div className={classes.root}>
        //     <Paper className={classes.paper}>
        //         <Grid container spacing={0}>
        //             <Grid container item xs={6} direction="column" spacing={1}>
        //                 <Grid item>
        //                   <ButtonBase
        //                     className={classes.image}
        //                     component={Link}
        //                     to={`/product/${id}`}
        //                   >
        //                       <img className={classes.img} alt="product image" src={img} />
        //                   </ButtonBase>
        //                 </Grid>
        //                 <Grid item>
        //                     <Button
        //                       onClick={handleAddToCart}
        //                       variant="outlined"
        //                       style={{
        //                         width: "9rem",
        //                         color: theme.palette.primary.contrastText,
        //                       }}
        //                     >
        //                       <Typography variant="body2" style={{ cursor: 'pointer' }}>
        //                           <ShoppingCartIcon /> Add to Cart
        //                       </Typography>
        //                     </Button>
        //                 </Grid>
        //                 <Grid item>
        //                     <Button
        //                       onClick={handlePurchase}
        //                       variant="outlined"
        //                       style={{
        //                         width: "9rem",
        //                         color: theme.palette.primary.contrastText,
        //                       }}
        //                     >
        //                       <Typography variant="body2" style={{ cursor: 'pointer' }}>
        //                           Purchase
        //                       </Typography>
        //                     </Button>
        //                 </Grid>
        //             </Grid>
        //             <Grid item xs={6} sm container>
        //                 <Grid item xs container direction="column" spacing={2}>
        //                 <Grid item xs>
        //                     <Typography gutterBottom variant="subtitle1">
        //                       {`${name.split(" ").splice(0, 15).join(" ")}`}
        //                     </Typography>
        //                     {/* <Typography variant="body2" gutterBottom>
        //                       A normal product
        //                     </Typography> */}
        //                     {/* <Typography variant="body2" color="secondary">
        //                       ID: {`${id}`}
        //                     </Typography> */}
        //                     <Rating name={`product-rating`} value={rating} readOnly/>
        //                 </Grid>

        //                 </Grid>
        //                 {/* <Grid item>
        //                   <Typography variant="subtitle1">${price}</Typography>
        //                 </Grid> */}
        //             </Grid>
        //             <Grid item xs={1}>
        //               <Typography variant="h6">${price}</Typography>
        //             </Grid>
        //         </Grid>
        //     </Paper>
        //     {/* <PurchaseSucessModal
        //       handleClose={handleModalClose}
        //       open={modalOpen}
        //       token={token}
        //     /> */}
        // </div>
    );
}
