import './App.css';
import { Routes, Route } from "react-router";
import Login from "./routes/login";
import Admin from "./routes/admin";
import Dashboard from "./routes/dashboard";
import RedirectTo from "./routes/index";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import UnprotectedRoutes from "./routes/UnprotectedRoutes";
import Register from "./routes/register";
import Header from "./component/header/header";
import EditTask from "./routes/editTasks";

function App() {
  return (
      <Header>
        <Routes >
          <Route element={<UnprotectedRoutes />}>
            <Route path="/" element={<RedirectTo path="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<RedirectTo path="/login" />} />
          </Route>
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<RedirectTo path="/dashboard" />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/user/:userId" element={<Dashboard />} />
            <Route path="/tasks/:taskId/edit" element={<EditTask />} />
            <Route path="/tasks/:taskId/edit/:userId" element={<EditTask />} />
            <Route path="*" element={<RedirectTo path="/dashboard" />} />
          </Route>
        </Routes>
      </Header>
  );
}

export default App;
