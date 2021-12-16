import logo from './logo.svg';
import './App.css';
import { Routes, Route} from "react-router-dom";
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/login/Login';

function App() {
  return (
    <>
      <Routes>
        <Route path = "/test" element = {<Test />} />;
        <Route path = "/dash" element = {<Dashboard />} />;
        <Route path = "/login" element = {<Login />} />;
      </Routes>
    </>
  );
}

function Test() {
  return <h1>Route /test works</h1>;
}

export default App;
