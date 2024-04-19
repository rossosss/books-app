import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import Books from "./pages/Books";
// import Add from "./pages/Add";
// import Update from "./pages/Update";
import Test from "./pages/Test";
import Auth from "./pages/Auth";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Books />} />
          <Route path="/add" element={<Test action="add" />} />
          <Route path="/update/:id" element={<Test action="update" />} />
          <Route path="/login" element={<Auth type="login" />} />
          <Route path="/register" element={<Auth type="register" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;