import Home from "./components/Home";
import Layout from "./components/Layout";
import { ConfigProvider } from "./context/ConfigContext";

function App() {
  return (
    <ConfigProvider>
      <Layout>
        <Home />
      </Layout>
    </ConfigProvider>
  );
}

export default App;
