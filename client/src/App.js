import logo from './logo.svg';
import './App.css';
import Test from "./test";

import { useState } from 'react';

const App = () => {

  const [greeting, setGreeting] = useState(true);


  return (
    <>
      <Test name="john" greeting={greeting}/> 
      <p><button onClick={() => {setGreeting(! greeting); console.log(greeting) }}>Hey</button></p>
    </>

  );
}

export default App;
