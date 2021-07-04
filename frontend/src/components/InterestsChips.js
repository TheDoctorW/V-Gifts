import React, { useEffect, useState } from 'react';
import CustomChip from './CustomChip';

export default function InterestsChips({
  setSelected, 
  handleAdd,
  handleRemove,
  ...props
}) {
  const [interests, setInterests] = useState(props.interests);
  // const [selected, setSelected] = useState([]);

  useEffect((() => {
    setInterests(props.interests);
    // eslint-disable-next-line
  }), []);


  return (
    <div>
      {interests.map((x) => (
        <CustomChip
          key={x} 
          label={x}
          handleAdd={handleAdd}
          handleRemove={handleRemove}
        />
      ))}
    </div>
  );
}