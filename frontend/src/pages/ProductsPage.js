import React, { useRef, useEffect, useState } from "react";
// import ProductCard from "../components/ProductCard";
import ProductCardNew from "../components/ProductCardNew";
import ProductFilter from "../components/ProductFilter";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import Box from "@material-ui/core/Box";
import NavBar from "../components/NavBar";
import axios from 'axios';
import PurchaseSucessModal from '../components/modals/PurchaseSuccessModal';
import NotLoginModal from '../components/modals/NotLoginModal';
import AuthContext from '../AuthContext';
import Chatbot from '../components/chat/Chatbot';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import { Link } from 'react-router-dom';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import { useHistory } from 'react-router'
import CustomSnackBar from '../components/CustomSnackbar';


const ERROR = 460;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  main: {
    // padding: 10,
    marginTop: "1rem",
    width: "90%",
  },
  leftContainer: {

  },
  rightContainer: {
    // overflowX: "hidden",
    // padding: 50,
  },
  pagination: {
    justifySelf: "end",
  },
  fab: {
    position: "fixed",
    bottom: 40,
    right: 20,
  },
  popper: {
    marginRight: "1rem",
  },
  recommendations: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    // height: "20rem"
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  gridListTitle: {
    color: theme.palette.secondary.contrastText,
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },

}));

const strToNumList = (str) => {
  const CATEGORIES = ["for men", "for women", "for children", "for friends", "for elder", "for relationship", "foods", "tools", "luxuries", "entertainment", "working"];
  let output = Array(11).fill(0);

  let index = CATEGORIES.indexOf(str);

  if (index >= 0) {
    output[index] = 1;
  }

  return output;
}

function ProductsPage(props) {
  const classes = useStyles();
  const history = useHistory();

  const [totalPages, setTotalPages] = useState(0);
  const [products, setProducts] = useState([]);
  const [recommendation, setRecommendation] = useState([]);
  const [result, setResult] = useState(true);
  const [navbarReload, setNavbarReload] = useState(0);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    severity: "",
    message: "",
  })

  const [infos, setInfos] = useState({
    page: 1,
    keyword: "",
    category: "",
  });

  const token = React.useContext(AuthContext).user;
  const [psModalOpen, setPsModalOpen] = useState(false);
  const [nlModalOpen, setNlModalOpen] = useState(false);

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

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  const prevKeyword = usePrevious(infos.keyword);

  const retrieveProducts = () => {
    axios.post('/product/search', {
      token: token ? token : "",
      // page: prevKeyword !== keyword ? 1 : currPage, 
      page: infos.page,
      keyword: infos.keyword,
      category: strToNumList(infos.category),
      price_range: [],
    })
    .then((response) => {
      const data = response.data;

      if (data.code === ERROR) {
        history.push('/404');
      }

      const flag = data.flag;
      if (!flag) {
        setResult(false);
      } else {
        setResult(true);
      }

      setTotalPages(data['total_pages']);
      setProducts(data['product_lst']);
      setRecommendation(data["recommendation_list"]);

      if (prevKeyword !== infos.keyword) {
        setInfos({
          ...infos,
          category: "",
          page: 1,
        })
      }
    })
  };

  // eslint-disable-next-line
  React.useEffect(retrieveProducts, [infos]);


  const handlePageChange = (event, number) => {
    setInfos({
      ...infos,
      page: number,
    })
  };


  const renderSearchTitle = (
    result ? 
      ((infos.keyword == null || infos.keyword === "") ?
        <h3 style={{textTransform: "capitalize"}}>{infos.category}</h3> : <h3>Search result of "{infos.keyword}"</h3>)
      : <h3>Sorry, no result of "{infos.keyword}". Take a look at our other products instead</h3>
  );



  const [modalType, setModalType] = useState(1);

  const handleCategory = (category) => {
    setInfos({
      keyword: "",
      category: category,
      page: 1,
    })
  };

  const setKeyword = (keyword) => {
    setInfos({
      ...infos,
      keyword: keyword,
    });
  }

  return (
    <div className={classes.root}>
      <NavBar
        className={classes.navBar} 
        setKeyword={setKeyword}
        reload={navbarReload}
      />
      <Box
        className={classes.main}
      >
        <Grid container spacing={0}>
          <Grid className={classes.leftContainer} container item xs={12} sm={2}>
            <Grid item xs={12}>
              <ProductFilter
                // categories={category}
                handleCategory={handleCategory}
              />
            </Grid>
          </Grid>

          <Grid 
            className={classes.rightContainer} 
            container item xs={12} sm={10} spacing={3}
          >
            {recommendation.length > 0 &&
              <Grid
                className={classes.recommendations}
                container
                item
                xs={12}
                spacing={2}
                style={{
                  // backgroundColor: "red"
                }}
              >
                <Grid item xs={12}>
                  <h4><ThumbUpAltIcon />Recommendations for you:</h4>
                </Grid>
                <Grid item xs={12}>
                  <GridList className={classes.gridList} cols={4.5} >
                    {recommendation.map(x => (
                      <GridListTile 
                        key={`rec-${x['product_id']}`} 
                        style={{height: "10rem"}}
                        component={Link}
                        to={`/product/${x['product_id']}`}
                      >
                        {/* <ButtonBase
                          component={Link}
                          to={`/product/${x['product_id']}`}
                        >
                        </ButtonBase> */}
                          <img
                            src={x['pic_link']}
                            alt={`product-${x['product_id']}`}
                            style={{
                              // width: "10rem",
                              height: "10rem",
                              // width: "100%",
                              // height: "100%",
                            }}
                          />
                        <GridListTileBar
                          title={x['name']}
                          classes={{
                            root: classes.titleBar,
                            title: classes.gridListTitle,
                          }}
                          // actionIcon={
                            // <ButtonGroup
                            //   className={classes.gridListTitle}
                            //   color="primary"
                            //   variant="text"
                            //   disableElevation
                            // >
                            //   <IconButton
                            //     aria-label={`cart-${x['name']}`}
                            //     component={Link}
                            //     to={`/product/${x['product_id']}`}
                            //   >
                            //     <InfoOutlinedIcon  />
                            //   </IconButton>
                            //   <IconButton
                            //     aria-label={`cart-${x['name']}`}
                            //     onClick={handleAddToCart(x['product_id'])}
                            //   >
                            //     <ShoppingCartIcon  />
                            //   </IconButton>
                            //   <Button
                            //     onClick={handlePurchase(x['product_id'])}
                            //   >
                            //     Buy
                            //   </Button>
                            // </ButtonGroup>
                          // }
                        />
                      </GridListTile>
                    ))}
                  </GridList>
                </Grid>
              </Grid>
            }
            <Grid
              className={classes.productsGrid}
              container
              item
              xs={12}
              spacing={2}
            >
              <Grid item xs={12}>
                {renderSearchTitle}
              </Grid>
              {products.map((x) =>
                <Grid key={`product-${x['product_id']}`} item xs={12} sm={4}>
                  <ProductCardNew
                    key={`product-${x['product_id']}`}
                    id={x['product_id']}
                    name={x['name']}
                    price={x['price']}
                    rating={x['rating']}
                    img={x['pic_link']}
                    handlePsModalOpen={handlePsModalOpen}
                    handlePsModalClose={handlePsModalClose}
                    handleNlModalOpen={handleNlModalOpen}
                    handleNlModalClose={handleNlModalClose}
                    setModalType={setModalType}
                    setNavbarReload={setNavbarReload}
                    setAlertOpen={setAlertOpen}
                    setAlertInfo={setAlertInfo}
                  />
                </Grid>
              )}
              {/* </Grid> */}
            </Grid>
            <Grid
              className={classes.pagination}
              item
              xs={12}
            >
              <Pagination
                count={totalPages}
                color="secondary"
                variant="outlined"
                shape="rounded"
                size="large"
                page={infos.page}
                onChange={handlePageChange}
              />
              <p>page {infos.page} of {totalPages}</p>
            </Grid>

          </Grid>
        </Grid>
      </Box>
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
      <Chatbot />
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

export default ProductsPage;
