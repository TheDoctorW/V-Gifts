import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    border: "1px solid",
    width: "23rem",
    height: "25rem",
    backgroundColor: "white",
  },
  grid: {
    width: "100%",
    height: "100%",
  },
  title: {
    backgroundColor: theme.palette.primary.main,
    paddingTop: 5,
    paddingLeft: 10,
  },
  bottom: {
    backgroundColor: theme.palette.primary.main,
    paddingTop: 10,
    paddingBottom: 10,
  }
}));

export default function Chat(props) {
  const classes = useStyles();
  const theme = useTheme();

  const [value, setValue] = React.useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };


  return (
    <div className={classes.root}>
      <Grid 
        className={classes.grid}
        container
      >
        <Grid item xs={12}>
          <Box className={classes.title}>
            <Typography
              variant="h4"
            >
              Chatbot
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <p>testing</p>
          <p>testingasdsadasdas</p>
          <p>testing</p>
          <p>testing</p>
          <p>testing</p>
        </Grid>
        <Grid 
          container
          item 
          xs={12}
          className={classes.bottom}
          justify="center" 
          alignItems="center" 
        >
          <Grid item xs={9}>
            <TextField
              value={value}
              variant="outlined"
              onChange={handleChange}
              style={{
                backgroundColor: "white",
                width: "100%",
                marginLeft: "1rem",
              }}
            />
          </Grid>
          <Grid 
            item 
            xs={3} 
            style={{
              textAlign: "center"
            }}
          >
            <IconButton
              style={{
                backgroundColor: theme.palette.secondary.main,
                border: "1px solid black",
                color: theme.palette.secondary.contrastText,
              }}
            >
              <SendIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}