import React, { useState } from 'react';
import Typography from "@material-ui/core/Typography";
import {
  DataGrid
} from "@material-ui/data-grid";
import moment from 'moment';
import Button from "@material-ui/core/Button";
import axios from 'axios';
import { Grid, TextField } from '@material-ui/core';
import {
  UPDATE_ORDER_STATE_ALERT as UPDATE_ALERT,
  INVALID_ORDER_ID
} from '../../utils/AlertInfo';
import { INVALID_ID } from '../../utils/ErrorCode';
import CustomSnackBar from '../CustomSnackbar';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

export default function OrdersManagement(props) {
  const [orders, setOrders] = useState(props.orders);
  const token = props.token;
  const [info, setInfo] = useState({
    orderId: '',
    orderState: ''
  })
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    severity: "",
    message: "",
  }) 

  const handleSubmit = () => event =>{
    event.preventDefault();
    axios.post("/order/statechange", {
      token,
      id: info.orderId,
      state: info.orderState
    }).then(res => {
      if(res.status === 200) {
        console.log(res);
        setAlertInfo(UPDATE_ALERT);
        setAlertOpen(true);
        axios.get("/admin/all_order", {
          params: {
            token,
          }
        })
        .then((response) => {
          const data = response.data;
          setOrders(data);
        })
      } 
      else if (res.status === INVALID_ID) {
        setAlertInfo(INVALID_ORDER_ID);
        setAlertOpen(true);
      }
    })
  }

  const handleChange = (name) => event => {
    setInfo({
      ...info,
      [name]: event.target.value
    });
  }

  const columns = [
    { field: 'id', headerName: 'Order ID', width: 120},
    { field: 'order_state', headerName: 'State', width: 150},
    { field: 'user_id', headerName: 'User ID', width: 100 },
    { field: 'product_id', headerName: 'Product ID', width: 150 },
    { field: 'product_name', headerName: 'Product Name', width: 250 },
    { field: 'amount', headerName: 'Amount', width: 100 },
    { field: 'cost', headerName: 'Cost', width: 100 },
    { field: 'purchase_date', headerName: 'Purchase Date', width: 150 }    
  ];

  const rows = orders.map(x => {
    return {
      "id": x['order_id'],
      "order_state": x['state_in_text'],
      "user_id": x['user_id'],
      "product_id": x['product_id'],
      "product_name": x['product_name'],
      "amount": x['amount'],
      "cost": x['cost'],
      "purchase_date": moment(parseFloat( x['purchase_date']*1000)).format("YYYY-MM-DD HH:mm:ss"),
    };
  });

  return (
    <div style={{ width: '100%'}}>
      <Typography variant="h5">Orders in the system</Typography>
      <DataGrid 
        rows={rows} 
        columns={columns} 
        pageSize={7} 
        autoHeight
        // checkboxSelection 
      />
      <form onSubmit={handleSubmit()}>
            <Grid
              container
              spacing={2}
              xs={12}
            >
              <Grid item xs={12}>
                <Typography variant="h5" style={{marginBottom: "1rem", marginTop: "20px"}}>
                  Update Order State
                </Typography>
              </Grid>
              <Grid item xs={2}>
                  <TextField
                    required
                    label="Order Id"
                    placeholder="Order Id"
                    variant="outlined"
                    onChange={handleChange('orderId')}
                    InputLabelProps={{shrink: true}}
                    style={{
                      marginRight: "1rem",
                      width: "100%",
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <FormControl variant="outlined" style={{
                      width: "100%",
                    }}>
                    <InputLabel id="demo-simple-select-label">State Code</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={info.orderState}
                      onChange={handleChange('orderState')}
                      >
                      <MenuItem value={'0'}>Just purchase</MenuItem>
                      <MenuItem value={'1'}>Delivering</MenuItem>
                      <MenuItem value={'2'}>Done</MenuItem>
                      <MenuItem value={'3'}>Cancelled / Refunded</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    style={{
                      width: "100%",
                      height: "50px"
                    }}
                  >
                    Update State
                  </Button>
                </Grid>
            </Grid>
      </form>
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