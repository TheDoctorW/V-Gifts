import React from "react";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

function QuantitySelect(props) {
  return (
    <ButtonGroup color="secondary" variant="contained" disableElevation style={{width: "100%"}}>
      <Button onClick={props.handleDecrement}>-</Button>
      <Button
        color="primary"
      >
        {props.amount}
      </Button>
      <Button onClick={props.handleIncrement}>+</Button>
    </ButtonGroup>
  );
}

export default QuantitySelect;