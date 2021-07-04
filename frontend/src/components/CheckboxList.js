import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';



const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        // maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing(8),
    },
}));

export default function CheckboxList(props) {
  const classes = useStyles();

  const categoryList = ["for men", "for women", "for children", "for friends", "for elder", "for relationship", "foods", "tools", "luxuries", "entertainment", "working"];

  return (
    <List className={classes.root}>
      <ListItem
        key={"all-products"} 
        role={undefined} 
        button 
        onClick={() => props.handleCategory("")}
        className={classes.nested}
      >
        <ListItemText 
          id={"list-label-all"} 
          primary={"All Products"} 
          style={{
            textTransform: "capitalize",
          }}
        />
      </ListItem>
      {categoryList.map((value, index) => {
          const labelId = `list-label-${value}`;

          return (
            <ListItem
              key={value} 
              role={undefined} 
              button 
              onClick={() => props.handleCategory(value)}
              className={classes.nested}
            >
              <ListItemText 
                id={labelId} 
                primary={value} 
                style={{
                  textTransform: "capitalize",
                }}
              />
            </ListItem>
          );
      })}
    </List>
  );
}
