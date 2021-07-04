import React from 'react';
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
import HomeIcon from '@material-ui/icons/Home';
import UserHome from './UserHome';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import AuthContext from '../AuthContext';
import OrderCard from './OrderCard';
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import ListAltIcon from '@material-ui/icons/ListAlt';
import { useHistory } from 'react-router'


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
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
  }
}));



export default function UserDrawer(props) {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();

  
  const token = React.useContext(AuthContext).user;
  const profile = props.profile;

  const [display, setDisplay] = React.useState({
    home: true,
    orders: false,
    users: false,
  });

  const [orders, setOrders] = React.useState([]);
  
  React.useEffect(() => {
    axios.get('/order/list',{
      params: {
        token: token
      }
    }).then(res => {
      console.log(res.data);
      setOrders(res.data);
    })
  }, [token])
  

  const renderUserHome = (
    <UserHome 
      token={token} 
      profile={profile}
      ordersNum={orders.length}
    />
  );


  const displayHome = () => {
    setDisplay({
      home: true,
      orders: false,
      users: false,
    });
  }


  const displayOrders = () => {
    setDisplay({
      home: false,
      orders: true,
      users: false,
    });
  }

  const handleLogout = (event) => {
    axios.post('/user/logout', { token })
      .then((response) => {
        console.log(response);
      
        localStorage.removeItem('id');
        localStorage.removeItem('token');

        // after log out, redirect to home page
        // props.history.go(0);
        history.go(0);
        // history.push('/');
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
						to={'/products'}
						className={classes.title} 
						variant="h4"
						noWrap
					>
            V-Gifts | My Profile
          </Typography>
          <Button variant="contained" color="secondary" onClick={handleLogout}>
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
            <ListItem button key={"Cart"} component={Link} to={ `/profile/${token}/cart`}>
              <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
              <ListItemText primary={"Cart"} />
            </ListItem>
            <ListItem button key={"Orders"} onClick={displayOrders}>
              <ListItemIcon><ListAltIcon /></ListItemIcon>
              <ListItemText primary={"Orders"} />
            </ListItem>
            <ListItem button key={"Logout"} onClick={handleLogout} >
              <ListItemIcon><ExitToAppIcon /></ListItemIcon>
              <ListItemText primary={"Log out"} />
            </ListItem>
          </List>
        </div>
      </Drawer>
      <main className={classes.content}>
        {/* <div className={classes.toolbar} /> */}
        <Toolbar />
        <Box
          display="flex" 
          flexDirection="column"
          alignItems="center"
        >
          <Avatar 
            alt="Admin Avartar"
            src="/img/profile/profile-1.jpg"
            variant="rounded" 
            style={{
              border: `1px solid ${theme.palette.primary.contrastText}`,
              width: theme.spacing(20),
              height: theme.spacing(20),
              marginBottom: theme.spacing(5),
            }}
          />
          {display.orders && <h1>Orders history</h1>}

        </Box>
        {display.home && renderUserHome}
        {/* {display.users && renderUsers} */}
        {display.orders && orders.map((item, index) => 
          <OrderCard key={index} {...item}/> 
        )}
      </main>
    </div>
  );
}
