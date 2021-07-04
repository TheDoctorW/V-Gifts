import React, { useState } from 'react';
import Chip from '@material-ui/core/Chip';

const SELECTED = "secondary";
const UNSELECTED = "default";

export default function CustomChip(props) {
  const [color, setColor] = useState(UNSELECTED);

  const handleClick = (name) => {
    switch (color) {
      case UNSELECTED:
        // add an interest: unselected -> selected
        setColor(SELECTED);
        props.handleAdd(name);

        break;
      case SELECTED:
        // remove an interest: selected -> unselected
        setColor(UNSELECTED);
        props.handleRemove(name);

        break;
      default:
        break;
    }
  };

  return (
    <Chip 
      label={props.label}
      color={color}
      style={{
        marginRight: "1rem",
        marginBottom: "0.5rem",
      }}
      onClick={() => handleClick(props.label)}
    />
  );
}