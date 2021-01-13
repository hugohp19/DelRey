//import logo from './logo.svg';
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/navbar.jsx';
import { AppContextProvider } from './context/AppContext';

function App() {
  return (
    // <AppContextProvider>
    //   <BrowserRouter>
    <div>
        <Navbar />
          <div className="App">
            <h1 style={{backgroundColor: 'blue'}}>Hello World!</h1>
          </div>
          </div>
    //     {/* </Switch>
    //   </BrowserRouter>
    // </AppContextProvider> */}
  );
}

export default App;
