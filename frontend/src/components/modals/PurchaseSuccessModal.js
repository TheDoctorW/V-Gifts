import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  leftButton: {
    width: "100%",
    height: "4rem",
  },
  rightButton: {
    width: "100%",
    height: "4rem",
  }
}));

export default function PurchaseSuccessModal(props) {
  const classes = useStyles();


  const renderTitle = (type) => {
    switch(type) {
      case 1:
        return <h2>Thanks for your purchase!</h2>;
      case 2:
        return <h2>Item added to Cart!</h2>;
      default:
        return <h2>Modal</h2>
    }
  ;}

  const renderButtonRight = (type) => {
    switch(type) {
      case 1: // purchase success
        return (
          <Button
            variant="outlined"
            component={Link}
            to={{
              pathname: `/profile/${props.token}`, 
            }}
            className={classes.rightButton}
          >
            My orders history
          </Button>
        );
      case 2: // add to cart
        return (
          <Button
            variant="outlined"
            component={Link}
            to={{
              pathname: `/profile/${props.token}/cart`, 
            }}
            className={classes.rightButton}
          >
            View my cart
          </Button>
        );
      default:
        return;
    }
  }

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={props.open}
        onClose={props.handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.open}>
          <div className={classes.paper}>
            {/* <h2 id="transition-modal-title">Thanks for your purchase!</h2> */}
            {renderTitle(props.type)}
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={props.handleClose}
                  className={classes.leftButton}
                >
                  Continue Shopping
                </Button>
              </Grid>
              
              <Grid item xs={6}>
                {renderButtonRight(props.type)}
                {/* <Button
                  variant="outlined"
                  component={Link}
                  to={{
                    pathname: `/profile/${props.token}`, 
                  }}
                >
                  My orders history
                </Button> */}
              </Grid>
            </Grid>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
