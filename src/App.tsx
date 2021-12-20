import './App.css';
import { Routes, Route} from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import LoginComponent from './components/login/LoginComponent';
import { useState } from 'react';
import SessionUser from './models/SessionUser';

function App() {

  let [authUser, setAuthUser] = useState(undefined as SessionUser | undefined);
  
  return (
    <>
      <Routes>
        <Route path = "/test" element = {<Test />} />;
        <Route path = "/dash" element = {<Dashboard />} />;
        <Route path = "/login" element = {<LoginComponent />} />;
      
      </Routes>
    </>
  );
}

function Test() {
  return <h1>Route /test works</h1>;
}

export default App;
