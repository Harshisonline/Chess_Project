import './App.css'
import LandingPage from './Components/LandingPage/landingPage'
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import SignUp from './Components/signUp/signUp'
import SignIn from './Components/signIn/signIn';
import Home from './Components/home/home';
import ProtectedRoute from './Components/protected';
import { AuthProvider } from './Contexts/authContext';

function App() {
  return (
    <AuthProvider>
      <Routes>
          <Route index element={
              <LandingPage/>
          } />
          <Route path={'/register'} element={
            <SignUp/>
          }/>
          <Route path={'/login'} element={
            <SignIn/>
          }/>
          <Route element={<ProtectedRoute/>}>
            <Route path={'/home'} element={
              <Home/>
            }/>
          </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
