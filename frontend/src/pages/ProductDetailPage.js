import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Product from '../components/Product';
// import axios from 'axios';

export default function ProductDetailPage(props) {
  const id = props.match.params.id;
  const [navbarReload, setNavbarReload] = useState(0);

  return (
    <div>
      <NavBar reload={navbarReload}/>
      <Product id={id} setNavbarReload={() => setNavbarReload(prev => prev + 1)}/>
    </div>
  );
}