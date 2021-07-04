import React from 'react';
import NavBarHome from '../components/NavBarHome';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  intro: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "90vh",
    width: "100%",
    boxShadow: 'none',
  },
  joinButton: {
    marginRight: "1rem",
  },
}));

function HomePage(props) {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <div className={classes.root}>
      <NavBarHome className={classes.nav}/>
      <Box
        className={classes.intro}
        style={{
          // backgroundColor: theme.palette.secondary.main,
          backgroundImage: `url(/img/home/home-2.jpg)`,
          backgroundSize: 'cover',
        }}
      >
        <Typography
          component="h1" 
          variant="h2" 
          align="center" 
          style={{
            color: theme.palette.primary.contrastText
          }} 
          gutterBottom>
          Welcome to <b>V-Gifts</b>
        </Typography>
        <Typography 
          variant="h3" 
          align="center" 
          style={{
            color: theme.palette.primary.contrastText
          }} 
          paragraph>
          Join us today and receive $2000! 
        </Typography>
        <Box
          display="flex"
          style={{
            marginTop: "2rem"
          }}
        >
          <Button
            color='primary'
            variant="contained"
            className={classes.joinButton}
            component={Link}
            to={'/register'}
          >
            Join
          </Button>
          <Button
            color='secondary'
            variant='outlined'
            component={Link}
            to={'/products'}
          >
            Browse the market
          </Button>
        </Box>
        <Typography
          style={{
            color: theme.palette.primary.contrastText,
            marginTop: "0.5rem",
          }} 
        >
          Already a member? Log in <b>
            <Link to="./login" style={{color: theme.palette.primary.contrastText}}>
              Here
            </Link>
          </b>
        </Typography>
      </Box>
    </div>
  );
}

// function HomePage(props) {
//     return (
// 		<div className="App">
// 			<main>
// 				<h1 id="website-name" className="mt-3">V-Gifts</h1>
// 				<div className="d-flex justify-content-end w-100 mt-3" id="register-login">
// 					<a href="/register"><button type="button" className="btn btn-primary me-2">Register</button></a>
// 					<a href="/login"><button type="button" className="btn btn-primary me-4">Log in</button></a>
// 				</div>
// 				<div id="introCarousel" className="carousel slide"  data-bs-ride="carousel">
// 					<div className="carousel-indicators">
// 						<button type="button" data-bs-target="#introCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
// 						<button type="button" data-bs-target="#introCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
// 						<button type="button" data-bs-target="#introCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
// 					</div>
// 					<div className="carousel-inner">
// 						<div className="carousel-item active">
// 							<img src="img/intro/intro-1.jpeg" className="d-block w-100 img-fluid" alt="..." />
// 							<div className="container">
// 								<div className="carousel-caption text-start">
// 								<h1>
// 									Looking for a gift for your special one?
// 								</h1>
// 								<h2>Explore our range of gits </h2>
// 								<p><a className="btn btn-lg btn-primary" href="/products">Browse the Market</a></p>
// 								</div>
// 							</div>
// 						</div>
// 						<div className="carousel-item w-100">
// 							<img src="img/intro/intro-2.jpeg" className="d-block w-100 img-fluid" alt="..." />
// 						<div className="container">
// 							<div className="carousel-caption">
// 								<h1>Don't know want to purchase?</h1>
// 								<h2>Sign up today and talk to our <b>GiftBot</b> and receive a customized gift idea.</h2>
// 								<p><a className="btn btn-lg btn-primary" href="/register">Sign up today</a></p>
// 							</div>
// 						</div>
// 						</div>
// 						<div className="carousel-item w-100">
// 							<img src="img/intro/intro-3.jpeg" className="d-block w-100 img-fluid" alt="..." />
// 							<div className="container">
// 								<div className="carousel-caption text-end">
// 									<h1>Already has a account?</h1>
// 									<p>Log in now and continue your exploration</p>
// 									<p><a className="btn btn-lg btn-primary" href="/login">Log in</a></p>
// 								</div>
// 							</div>
// 						</div>
// 					</div>
// 					<button className="carousel-control-prev" type="button" data-bs-target="#introCarousel"  data-bs-slide="prev">
// 						<span className="carousel-control-prev-icon" aria-hidden="true"></span>
// 						<span className="visually-hidden">Previous</span>
// 					</button>
// 					<button className="carousel-control-next" type="button" data-bs-target="#introCarousel"  data-bs-slide="next">
// 						<span className="carousel-control-next-icon" aria-hidden="true"></span>
// 						<span className="visually-hidden">Next</span>
// 					</button>
// 				</div>
// 			</main>

// 		</div>
//     );
// }

export default HomePage;