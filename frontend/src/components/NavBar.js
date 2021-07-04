import React, { useEffect, useState, useContext } from "react";
import { fade, makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import AuthContext from '../AuthContext';
import axios from "axios";


const useStyles = makeStyles((theme) => ({
  grow: {
    // flexGrow: 1,
    width: "100%",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
		marginRight: theme.spacing(2),
  },
	marketButton: {
		marginRight: theme.spacing(2),
	},
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.45),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.55),
    },
    // marginRight: theme.spacing(20),
    marginLeft: 0,
    minWidth: "10rem",
    flexGrow: 1,
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
    // width: "50rem",
    width: "100%",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
  sectionDesktop: {
    display: 'flex',
  },
  toolBar: {
    minHeight: "10vh",
    display: "flex",
    alignItems: "center",
  },
  logo: {
    margin: "auto",
    textAlign: 'center',
    maxWidth: "auto",
    maxHeight: '7vh',
    marginRight: "0.5rem",
  },
}));

export default function NavBar(props) {
  const token = useContext(AuthContext).user;

  const classes = useStyles();
  const theme = useTheme();

  const [searchInput, setSearchInput] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const handleSearchChange = event => {
    setSearchInput(event.target.value);
  }

  const handleSearch = () => {
    // history.push(`/products?keyword=${searchInput}`);
    props.setKeyword(searchInput);
  };

  const NotLoggedIn = (
    <Button
      component={Link}
      to={'/login'}
      variant="outlined"
    >
      Login/Register
    </Button>
  );

  const LoggedInProfile = (
    <div>
      <IconButton
        aria-label="cart"
        color="inherit"
        component={Link}
        to={ `/profile/${token}/cart`}
      >
        <Badge badgeContent={cartCount} color="secondary">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
      <Button
        component={Link}
        to={`/profile/${token}`}
        edge="end"
        aria-label="account of current user"
        color="inherit"
        className={classes.logo}
      >
        <AccountCircle />
        Account
      </Button>
    </div>
  );

  useEffect(((() => {
    if (token) {
      axios.get("/user/get_cart_number", {
        params: {
          token: token,
        }
      })
      .then((response) => {
        const data = response.data;
        setCartCount(data["cart_product_num"]);
      })
      .catch((err) => {});
    }
  })), [props.reload, token]);



  return (
    <div className={classes.grow}>
      <AppBar position="static" style={{boxShadow: 'none'}}>
        <Toolbar className={classes.toolBar}>
          <Link
            to={'/products'}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <img
              className={classes.logo}
              src="/img/logo/logo-1.png"
              alt="V-Gifts logo"
            />
            <Typography
              style={{
                textDecoration: "none",
                fontWeight: "200",
                color: theme.palette.primary.contrastText
              }}
              color="inherit"
              className={classes.title} 
              variant="h4"
              noWrap
            >
              V-Gifts
            </Typography>
          </Link>
					{/* <Button
						className={classes.marketButton}
						component={Link}
						to={{
              pathname: '/products',
            }}
						style={{color: theme.palette.primary.contrastText}}
						variant="outlined"
					>
            Market
					</Button> */}
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
              onChange={handleSearchChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          </div>
          <div style={{flexGrow: "0.1"}} />
          <div className={classes.sectionDesktop}>
            {token ? LoggedInProfile : NotLoggedIn}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
