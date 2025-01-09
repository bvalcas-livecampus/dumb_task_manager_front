import './App.css';
import { Routes, Route } from "react-router";
import Login from "./routes/login";
import Admin from "./routes/admin";
import Dashboard from "./routes/dashboard";
import RedirectToLogin from "./routes/index";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import UnprotectedRoutes from "./routes/UnprotectedRoutes";
import Register from "./routes/register";
import Header from "./component/header/header";

function App() {
  return (
      <Header>
        <Routes >
          <Route element={<UnprotectedRoutes />}>
            <Route path="/" element={<RedirectToLogin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route element={<ProtectedRoutes />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </Header>
  );
}

export default App;
