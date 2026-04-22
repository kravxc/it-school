import { Outlet } from "react-router";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
function App() {
  return (
    <div className="App">
      <Header></Header>
      <Outlet />
      <Footer></Footer>
    </div>
  );
}

export default App;
