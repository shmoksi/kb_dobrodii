import React from 'react';
import { Route } from 'react-router-dom';
import Home from '../../pages/home';
import AddItem from '../../pages/addItem';
// import Auth from '../../pages/auth';
import Main from '../../components/Main';
const App = () => (
  <Main>
    {/*<Auth/>*/}
    <Route exact path="/" component={Home} />
    <Route exact path="/add-item" component={AddItem} />
  </Main>
);

export default App;
