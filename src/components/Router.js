import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from "react-router-dom";
import Nav from './Nav';
import Public from './Public';
import Profile from './Profile';
import Protected from './Protected';

const Router = () => {
  const [current, setCurrent] = useState('home');
  useEffect(() => {
    // mount
    setRoute();
    window.addEventListener('haschange', setRoute);
    // ummounnt
    return () => window.removeEventListener('haschange', setRoute);
  }, []);

  function setRoute() {
    const location = window.location.href.split('/');
    const pathName = location[location.length - 1];
    setCurrent(pathName ? pathName : 'home');
  }

  return (
    <HashRouter>
      <Nav current={current} />
      <Routes>
        <Route exact path="/" component={Public} />
        <Route exact path="/protected" component={Protected} />
        <Route exact path="/profile" component={Profile} />
        <Route component={Public} />
      </Routes>
    </HashRouter>
  );
}

export default Router;
