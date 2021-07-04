import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import CheckboxList from './CheckboxList';
import ListIcon from '@material-ui/icons/List';


export default function CollapsePriceFilter () {
    const [open, setOpen] = React.useState(true);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <List>
            <ListItem button onClick={handleClick}>
                    <ListItemIcon>
                        <ListIcon />
                    </ListItemIcon>
                    <ListItemText primary="Price Filter"/>
                    {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <CheckboxList list={["Up to $25", "$100 - $200", "$200 & Above"]} />
                    </List>
            </Collapse>
            {/* <CheckboxList list={["Up to $25", "$100 - $200", "$200 & Above"]} /> */}
        </List>
    );

}