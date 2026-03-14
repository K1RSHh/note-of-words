import "./App.css";
import Main from "./components/Main";
import Home from "./page/Home";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import useWordStore from "./store/WordStore";

function App() {
  const initAuth = useWordStore((state) => state.initAuth);

  useEffect(() => {
    const unsubscribe = initAuth();

    return () => unsubscribe();
  }, [initAuth]);
  return (
    <div className="m-auto">
      <Home />
      <Main />
      <Toaster position="bottom-left" reverseOrder={false} />
    </div>
  );
}

export default App;
