import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Logout from './components/Logout';
import Home from './components/Home';
import Registration from './components/Registration';
import Profile from './components/Profile';
import CreateJobForm from './components/CreateJobForm';
import ApplyJob from './components/ApplyJob';
import JobList from './components/JobList';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />  {/* Login route */}
      <Route path="/logout" element={<Logout />} />  {/* Logout route */}
      <Route path="/home" element={<Home/>}/> {/* Home page route */}
      <Route path="/joblist" element={<JobList />} />  {/* JIb List page route */}
      <Route path="/registration" element={<Registration />} /> {/* Sign up page route */}
      <Route path="/profile" element={<Profile />} />   {/* Profile page */}
      <Route path="/createjobform" element={<CreateJobForm />} />  {/* Job creation form*/}
      <Route path="/applyjob/:id" element={<ApplyJob/>} />  {/*Apply for a job*/}
    </Routes>
  );
}

export default App;
