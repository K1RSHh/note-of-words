import "./App.css";
import Main from "./components/Main";
import Home from "./page/Home";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div>
      <Home />
      <Main />
      <Toaster position="bottom-left" reverseOrder={false} />
    </div>
  );
}

export default App;
