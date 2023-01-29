import { BrowserRouter ,Route,Routes} from "react-router-dom";
import Home from './pages/Home';
import Profile from './pages/Profile';
import Offers from './pages/Offers';
import ForgotPassword from './pages/ForgotPassword';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Header from "./components/Header";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/profile" element={<PrivateRoute/>}>
            <Route path="/profile" element={<Profile></Profile>}></Route>
          </Route>
          <Route path="/sign-in" element={<SignIn></SignIn>}></Route>
          <Route path="/sign-up" element={<SignUp></SignUp>}></Route>
          <Route path="/forgot-password" element={<ForgotPassword></ForgotPassword>}></Route>
          <Route path="/offers" element={<Offers></Offers>}></Route>
          <Route path="/create-listing" element={<CreateListing></CreateListing>}></Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer position="bottom-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark"/>
    </>
  );
}

export default App;
