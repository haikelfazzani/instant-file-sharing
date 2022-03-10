import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import App from './App';

import './styles/index.css';
import './styles/Text.css';
import './styles/Animation.css';
import './styles/Spacing.css';
import './styles/Color.css';

ReactDOM.render(
  <React.StrictMode>
    <Router><App /></Router>
  </React.StrictMode>,
  document.getElementById('root')
);

