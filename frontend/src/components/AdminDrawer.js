import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import StoreIcon from '@material-ui/icons/Store';
import UsersDataGrid from './admin/UsersDataGrid';
import HomeIcon from '@material-ui/icons/Home';
import AdminHome from './AdminHome';
import axios from 'axios';
import AuthContext from '../AuthContext';
import Button from '@material-ui/core/Button';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import Divider from '@material-ui/core/Divider';
import ProductsManagement from './admin/ProductsManagement';
import OrdersManagement from './admin/OrdersManagement';
import AdminsManagement from './admin/AdminsManagement';
import FaceIcon from '@material-ui/icons/Face';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    display: "flex",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  logo: {
    margin: "auto",
    textAlign: 'center',
    maxWidth: "auto",
    maxHeight: '7vh',
    marginRight: "0.5rem",
  },
  title: {
    flexGrow: 1,
  },
  logoutButton: {

  }
}));



export default function AdminDrawer(props) {
  const classes = useStyles();
  const theme = useTheme();

  const token = React.useContext(AuthContext).admin;
  const profile = props.profile;


  const [display, setDisplay] = useState({
    home: true,
    products: false,
    users: false,
    orders: false,
    admins: false,
  });

  const [products, setProducts] = useState([]);
  const [updateProduct, setUpdateProduct] = useState(false);
  const [users, setUsers] = useState([]);
  const [orders, SetOrders] = useState([]);
  const [admins, setAdmins] = useState([]);

  React.useEffect((() => {
    axios.get('/product/get_all', {
      params: {
        token: "",
        page: -1,
      }
    })
    .then((response) => {
      const data = response.data["product_lst"];
      setUpdateProduct(false);
      setProducts(data);
    })
    .catch((err) => {});
    
    axios.get('admin/all_user', {
      params: {
        token,
      }
    })
    .then((response) => {
      const data = response.data;

      setUsers(data);
    })
    .catch((err) => {});

    axios.get("/admin/all_order", {
      params: {
        token,
      }
    })
    .then((response) => {
      const data = response.data;

      SetOrders(data);
    })
    .catch((err) => {});

    axios.get("/admin/all_admin", {
      params: {
        token,
      }
    })
    .then((response) => {
      const data = response.data;

      setAdmins(data);
    })
    .catch((err) => {});


  }), [token, updateProduct]);

  const renderUsers = (
    <UsersDataGrid token={token} users={users} />
  );

  const renderOrders = (
    // <OrdersDataGrid />
    <OrdersManagement token={token} orders={orders} />
  );

  const renderAdminHome = (
    <AdminHome 
      usersNum={users.length}
      ordersNum={orders.length}
      adminsNum={admins.length}
      productsNum={products.length}
      profile={profile} 
      token={token}
    />
  );

  const renderProducts = (
    <ProductsManagement token={token} products={products} setUpdateProduct={setUpdateProduct}/>
  );

  const renderAdmins = (
    <AdminsManagement token={token} admins={admins} />
  );

  const displayHome = () => {
    setDisplay({
      home: true,
      products: false,
      users: false,
      orders: false,
      admins: false,
    });
  };

  const displayUsers = () => {
    setDisplay({
      home: false,
      products: false,
      users: true,
      orders: false,
      admins: false,
    });

  };

  const displayOrders = () => {
    setDisplay({
      home: false,
      products: false,
      users: false,
      orders: true,
      admins: false,
    });
  };

  const displayProducts = () => {
    setDisplay({
      home: false,
      products: true,
      users: false,
      orders: false,
      admins: false,
    });
  }

  const displayAdmins = () => {
    setDisplay({
      home: false,
      products: false,
      users: false,
      orders: false,
      admins: true,
    });
  }

  const handleLogout = (event) => {
    axios.post('/admin/logout', { token })
      .then((response) => {
        console.log(response);
      
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_id');

        // after log out, redirect to home page
        props.history.push('/');
      }) 
      .catch((err) => {console.log(err)});
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar} elevation={0}>
        <Toolbar>
          <Typography
						style={{
							textDecoration: "none",
              fontWeight: "200",
              color: theme.palette.primary.contrastText
						}}
						color="inherit"
						component={Link}
						to={'/'}
						className={classes.title} 
						variant="h4"
						noWrap
					>
            V-Gifts | Admin Page
          </Typography>
          <Button className={classes.logoutButton} variant="contained" color="secondary" onClick={handleLogout}>
            Log out
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            <ListItem button key={"Home"} onClick={displayHome}>
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary={"Home"} />
            </ListItem>
            <ListItem button key={"Market"} onClick={displayProducts}>
              <ListItemIcon><StoreIcon /></ListItemIcon>
              <ListItemText primary={"Market"} />
            </ListItem>
            <ListItem button key={"Users"} onClick={displayUsers}>
              <ListItemIcon><FaceIcon /></ListItemIcon>
              <ListItemText primary={"Users"} />
            </ListItem>
            <ListItem button key={"Orders"} onClick={displayOrders}>
              <ListItemIcon><AttachMoneyIcon /></ListItemIcon>
              <ListItemText primary={"Orders"} />
            </ListItem>
            <Divider />
            <ListItem button key={"Admins"} onClick={displayAdmins}>
              <ListItemIcon><SupervisorAccountIcon /></ListItemIcon>
              <ListItemText primary={"Admins"} />
            </ListItem>
          </List>
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        <Box
          display="flex" 
          flexDirection="column"
          alignItems="center"
        >
          <Avatar 
            alt="Admin Avartar"
            src="/img/admin/admin-1.png"
            variant="rounded" 
            style={{
              border: `1px solid ${theme.palette.primary.contrastText}`,
              width: theme.spacing(20),
              height: theme.spacing(20),
              marginBottom: theme.spacing(5),
            }}
          />
          <Typography variant="h5">
            {`Admin: ${profile['name']}(${profile['email']})`}
          </Typography>
        </Box>
        {display.home && renderAdminHome}
        {display.products && renderProducts}
        {display.users && renderUsers}
        {display.orders && renderOrders}
        {display.admins && renderAdmins}
      </main>
    </div>
  );
}
