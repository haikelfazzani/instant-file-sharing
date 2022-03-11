import React, { createContext, useState } from 'react';

const GContext = createContext();
const token = localStorage.getItem('token');

const initState = {
  roomCreator :{}

}

function GlobalStore (props) {
  const [gstate, setGState] = useState(initState);
  return (<GContext.Provider value={{ gstate, setGState }}>{props.children}</GContext.Provider>);
}

export { GContext, GlobalStore };