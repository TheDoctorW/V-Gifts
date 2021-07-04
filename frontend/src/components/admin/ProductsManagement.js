import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import { DataGrid } from '@material-ui/data-grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { Grid } from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';
import DoneIcon from '@material-ui/icons/Done';
import CustomSnackBar from '../CustomSnackbar';
import {
  EDIT_PRODUCT_SUCCESS_ALERT as EDIT_ALERT,
  ADD_PRODUCT_SUCCESS_ALERT as ADD_ALERT,
  IMG_EMPTY_ALERT,
  NEGATIVE_NUM_ALERT
} from '../../utils/AlertInfo';
const useStyles = makeStyles((theme) => ({
  form: {
    marginTop: "2rem",
  },
}));

export default function ProductsManagement(props) {
  const classes = useStyles();
  const token = props.token;
  const [products, setProducts] = useState([]);
  const [reloadProducts, setReloadProducts] = useState(false);
  const [csv, setCsv] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    description: "",
    delivery: 0,
    img: null,
  });
  const [selectedProduct, setSelectedProduct] = useState({
    id: 0,
    name: "",
    price: 0,
    description: "",
    delivery: 0,
    img: null,
  });

  // const [isNewUploaded, setIsNewUploaded] = useState(false);
  // const [isSelectedUploaded, setIsSelectedUploaded] = useState(false);
  // const [isCsvUploaded, setIsCsvUploaded] = useState(false);
  const [selectionModel, setSelectionModel] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    severity: "",
    message: "",
  })

  const columns = [
    { field: 'id', headerName: 'Product ID', width: 150},
    { field: "name", headerName: 'Product Name', width: 350 },
    { field: "price", headerName: 'Price', width: 180 },
    { field: "rating", headerName: 'Rating', width: 250 },
    // { field: "pic_link", headerName: 'Amount', width: 100 },
  ];

  const rows = products.map(x => {
    return {
      "id": x["product_id"],
      "name": x["name"],
      "price": `$${x["price"]}`,
      "rating": `${x["rating"]}/5`,
    };
  });

  const handleNewProductChange = name => event => {
    setNewProduct({
      ...newProduct,
      [name]: event.target.value
    });
  };

  const handleSelectedProductChange = name => event => {
    setSelectedProduct({
      ...selectedProduct,
      [name]: event.target.value
    });
  };

  const handleAddProduct = (event) => {
    event.preventDefault();
    if (newProduct.price < 0) {
      setAlertInfo(NEGATIVE_NUM_ALERT);
      setAlertOpen(true);
      return;
    } else if (newProduct.img === null) {
      setAlertInfo(IMG_EMPTY_ALERT);
      setAlertOpen(true);
      return;
    }

    let formData = new FormData();
    formData.append('token', token);
    formData.append('file', newProduct.img);
    formData.append('name', newProduct.name);
    formData.append('delivery', newProduct.delivery);
    formData.append('description', newProduct.description);
    formData.append('price', newProduct.price);

    axios.post("/product/new", 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    .then((response) => {
      const data = response.data;
      props.setUpdateProduct(true);
      setAlertInfo(ADD_ALERT);
      setAlertOpen(true);

      console.log(data);
      setReloadProducts(true);
    })
    .catch((err) => {});
  };

  const handleEditProduct = (event) => {
    event.preventDefault();

    if (selectedProduct.price < 0) {
      setAlertInfo(NEGATIVE_NUM_ALERT);
      setAlertOpen(true);
      return;
    } 
    let formData = new FormData();
    formData.append('token', token);
    formData.append('file', selectedProduct.img);
    formData.append('id', selectedProduct.id);
    formData.append('name', selectedProduct.name);
    formData.append('delivery', selectedProduct.delivery);
    formData.append('description', selectedProduct.description);
    formData.append('price', selectedProduct.price);

    console.log(formData);

    axios.post("/product/edit", 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    .then((response) => {
      const data = response.data;

      setAlertInfo(EDIT_ALERT);
      setAlertOpen(true);

      console.log(data);
      setReloadProducts(true);
    })
    .catch((err) => {});
  }

  const handleNewFileUpload = (event) => {
    setNewProduct({
      ...newProduct,
      img: event.target.files[0],
    });
    // setIsNewUploaded(true);
  }

  const handleSelectedFileUpload = (event) => {
    // console.log("uploaded!");
    console.log(event.target.files[0]);
    setSelectedProduct({
      ...selectedProduct,
      img: event.target.files[0],
    });
    console.log(event.target.files[0].type.replace(/(.*)\//g, ''));
    // setIsSelectedUploaded(true);
  }


  // reload products when database changed
  useEffect((() => {
    axios.get('/product/get_all', {
      params: {
        token: "",
        page: -1,
      }
    })
    .then((response) => {
      const data = response.data["product_lst"];
      setReloadProducts(false);
      setProducts(data);
    })
    .catch((err) => {});
  }), [reloadProducts]);

  // load products based on current selection
  useEffect((() => {
    if (selectionModel.length !== 0) {    
      axios.get('/product/get_info', {
          params: {
            id: parseInt(selectionModel),
          }
        })
      .then((response) => {
        const data = response.data;
        
        setSelectedProduct({
          id: data['id'],
          name: data['name'],
          price: data['price'],
          description: data['description'],
          delivery: data['delivery'],
          // rating: data['rating'],
          // img: data['pic_link'],
        });
      })
      .catch((err) => {});
    }
  }), [selectionModel]);

  const handleCsvChange = (event) => {
    console.log(event.target.files[0]);
    setCsv(event.target.files[0]);
  }
  
  const handleCsvSubmit = (event) => {
    event.preventDefault();
    let formData = new FormData();
    formData.append('token', token);
    formData.append('file', csv);
    axios.post('/product/import_csv', 
      formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => {
      if (res.status === 200) {
        setAlertInfo({
          severity: "Success",
          message: res.data.status,
        });
        props.setUpdateProduct(true);
        setAlertOpen(true);
        setReloadProducts(true);
      }
    }).catch((err) => {});
  }
  return (
    <div style={{width: '100%'}}>
      <Typography variant="h5">Products in the system</Typography>
      <DataGrid
        rows={rows} 
        columns={columns} 
        pageSize={5} 
        // checkboxSelection 
        autoHeight
        selectionModel={selectionModel}
        hideFooterSelectedRowCount
        onSelectionModelChange={(selection) => {
          const newSelectionModel = selection.selectionModel;

          if (newSelectionModel.length > 1) {
            const selectionSet = new Set(selectionModel);
            const result = newSelectionModel.filter(
              (s) => !selectionSet.has(s)
            );

            setSelectionModel(result);
          } else {
            setSelectionModel(newSelectionModel);
          }
        }}
      />
      <Grid container>
        <Grid container item xs={6}>
          <form className={classes.form} onSubmit={handleAddProduct}>
            <Grid
              container
              spacing={2}
              xs={12}
            >
              <Grid item xs={12}>
                <Typography variant="h5" style={{marginBottom: "1rem"}}>
                  Add a New Product
                </Typography>
              </Grid>
              <Grid
                container
                item
                xs={12}
                spacing={2}
              >
                <Grid item xs={5}>
                  <TextField
                    required
                    id="product-name"
                    label="Product Name"
                    placeholder="Product Name"
                    variant="outlined"
                    onChange={handleNewProductChange('name')}
                    InputLabelProps={{shrink: true}}
                    style={{
                      marginRight: "1rem",
                      width: "100%",
                    }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    required
                    id="product-price"
                    label="Price"
                    placeholder="Product Price"
                    type="number"
                    variant="outlined"
                    onChange={handleNewProductChange('price')}
                    inputProps={{
                      step: 1,
                      min: 0,
                    }}
                    value={newProduct.price}
                    style={{
                      width: "100%",
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    required
                    id="product-delivery"
                    label="Delivery Days"
                    placeholder="Delivery Days"
                    type="number"
                    variant="outlined"
                    onChange={handleNewProductChange('delivery')}
                    inputProps={{
                      step: 1,
                      min: 0,
                    }}
                    value={newProduct.delivery}
                    style={{
                      width: "100%",
                    }}
                  />
                </Grid>
              </Grid>
              <Grid
                container
                item
                xs={12}
                spacing={2}
              >
                <Grid item xs={10}>
                  <TextField
                    required
                    id="product-description"
                    label="Description"
                    placeholder="Product Description"
                    variant="outlined"
                    onChange={handleNewProductChange('description')}
                    style={{
                      marginRight: "1rem",
                      width: "100%",
                    }}
                    multiline
                    rows={4}
                    rowsMax={4}
                  />
                </Grid>
              </Grid>
              <Grid
                container
                item
                xs={12}
                spacing={2}
              >
                <Grid item xs={5}>
                  { newProduct.img == null &&
                    <Button
                      variant="contained"
                      component="label"
                      color="primary"
                      style={{
                        width: "100%"
                      }}
                    >
                      <ImageIcon />Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleNewFileUpload}
                      />
                    </Button>
                  }
                  { newProduct.img != null &&
                    <Button
                      variant="contained"
                      component="label"
                      color="primary"
                      style={{
                        width: "100%"
                      }}
                    >
                      <DoneIcon />Image Uploaded
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleNewFileUpload}
                      />
                    </Button>
                  }
                </Grid>
                <Grid item xs={5}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    style={{
                      width: "100%",
                    }}
                  >
                    Add New Product
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Grid>
        <Grid container item xs={6}>
          <form className={classes.form} onSubmit={handleEditProduct}>
            <Grid
              container
              spacing={2}
            >
            <Grid item xs={12}>
              <Typography variant="h5" style={{marginBottom: "1rem"}}>
                Edit an Existed Product (Current Selected: id-{selectionModel})
              </Typography>
            </Grid>
              <Grid
                container
                item
                xs={12}
                spacing={2}
              >
                <Grid item xs={5}>
                  <TextField
                    required
                    id="product-name"
                    label="Name"
                    placeholder="Product Name"
                    variant="outlined"
                    onChange={handleSelectedProductChange('name')}
                    InputLabelProps={{shrink: true}}
                    style={{
                      marginRight: "1rem",
                      width: "100%",
                    }}
                    value={selectedProduct.name}
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    required
                    id="product-price"
                    label="Price"
                    // placeholder="Product Price"
                    type="number"
                    variant="outlined"
                    onChange={handleSelectedProductChange('price')}
                    inputProps={{
                      step: 1,
                      min: 0,
                    }}
                    style={{
                      width: "100%",
                    }}
                    value={selectedProduct.price}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    required
                    id="selected-product-delivery"
                    label="Delivery Days"
                    // placeholder="Product Price"
                    type="number"
                    variant="outlined"
                    onChange={handleSelectedProductChange('delivery')}
                    inputProps={{
                      step: 1,
                      min: 0,
                    }}
                    value={selectedProduct.delivery}
                    InputLabelProps={{shrink: true}}
                    style={{
                      width: "100%",
                    }}
                  />
                </Grid>
              </Grid>
              <Grid
                container
                item
                xs={12}
                spacing={2}
              >
                <Grid item xs={10}>
                  <TextField
                    required
                    id="product-description"
                    label="Description"
                    // placeholder="Product Description"
                    variant="outlined"
                    onChange={handleSelectedProductChange('description')}
                    style={{
                      marginRight: "1rem",
                      width: "100%",
                    }}
                    multiline
                    rows={4}
                    rowsMax={4}
                    value={selectedProduct.description}
                  />
                </Grid>
              </Grid>
              <Grid
                container
                item
                xs={12}
                spacing={2}
              >
                <Grid item xs={5}>
                  { selectedProduct.img == null &&
                    <Button
                      variant="contained"
                      component="label"
                      color="primary"
                      style={{
                        width: "100%"
                      }}
                    >
                      <ImageIcon />Upload New Image
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleSelectedFileUpload}
                      />
                    </Button>
                  }
                  { selectedProduct.img != null &&
                    <Button
                      variant="contained"
                      component="label"
                      color="primary"
                      style={{
                        width: "100%"
                      }}
                    >
                      <DoneIcon />Image Uploaded
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleSelectedFileUpload}
                      />
                    </Button>
                  }
                </Grid>
                <Grid item xs={5}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    style={{
                      width: "100%",
                    }}
                  >
                    Confirm Edit
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Grid>
          <Grid item xs={10}>
          <form onSubmit={handleCsvSubmit}>
            <Typography variant="h5" style={{marginBottom: "1rem", marginTop: "20px"}}>
                Import CSV File
              </Typography>
            
            <Grid item xs={4}>
                <Button
                  variant="contained"
                  component="label"
                  color="primary"
                  style={{
                    width: "100%"
                  }}
                >
                  {csv == null ? "Upload a CSV file" : "CSV Uploaded"}
                  <input
                    type="file"
                    accept=".csv"
                    hidden
                    onChange={handleCsvChange}
                  />
                </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  style={{
                    width: "100%",
                    marginTop: "20px"
                  }}
                >Submit
              </Button>
            </Grid>
            </form>
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

