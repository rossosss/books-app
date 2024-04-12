import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import Books from "./pages/Books";
// import Add from "./pages/Add";
// import Update from "./pages/Update";
import Test from "./pages/Test";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Books />} />
          <Route path="/add" element={<Test action="add" />} />
          <Route path="/update/:id" element={<Test action="update" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;