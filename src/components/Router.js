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
    window.addEventListener('hashchange', setRoute);
    console.log('Event Listener set in place!');
    // ummounnt
    return () => window.removeEventListener('hashchange', setRoute);
  }, []);

  function setRoute() {
    const location = window.location.href.split('/');
    const pathName = location[location.length - 1];
    setCurrent(pathName ? pathName : 'home');
    console.log({current});
  }
  
  return (
    <HashRouter>
      <Nav current={current} setCurrent={setCurrent} />
      <Routes>
        <Route exact path="/" element={<Public />} />
        <Route exact path="/protected" element={<Protected />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route element={<Public />} />
      </Routes>
    </HashRouter>
  );
}

export default Router;
