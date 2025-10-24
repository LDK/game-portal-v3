
// App.css
import "@mantine/core/styles.css";
import "./App.css";
import Footer from './components/footer';
import ComponentsDemoPage from "./pages/ComponentsDemo";
import FeltBackground from "./components/FeltBackground";
import LoginRegisterPage from "./pages/LoginRegister";
import Header from "./components/header";
import { Container, Drawer } from "@mantine/core";
import { useState } from "react";
import HomePage from "./pages/Home";
import SettingsPage from "./pages/settings/index";
import { ToastContainer } from "react-toastify";

function App() {
  const rootElement = document.getElementById("root")!;
  const page = rootElement.getAttribute("data-page") || "home";
  const username = rootElement.getAttribute("data-username") || "";
  // const userId = rootElement.getAttribute("data-user-id") || "";
  // const userSecretKey = rootElement.getAttribute("data-user-secret-key") || "";

  const [drawerOpened, setDrawerOpened] = useState(false);

  let mainContent = <></>;
  const csrfToken = rootElement.getAttribute("data-csrf-token") || "";

  switch (page) {
    case "login":
      mainContent = <LoginRegisterPage csrfToken={csrfToken} />;
      break;
    case "components":
      mainContent = <ComponentsDemoPage />;
      break;
    case "settings":
      mainContent = <SettingsPage csrfToken={csrfToken} />;
      break;
    default:
      // Render default content or redirect
      mainContent = <HomePage />;
      break;
  }

  return (
    <>
      <Header 
        hideLogin={page === 'login'}
        username={username}
        menuClick={() => setDrawerOpened(true)}
      />
      <FeltBackground colorLevel={8} pb="72px" pt="72px">
        <Container>
          {mainContent}
        </Container>
      </FeltBackground>
      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        title="Menu"
        padding="md"
        position="right"
        size="md"
      >
        <p>Now you've gone and opened the drawer!</p>
      </Drawer>
      <ToastContainer />
      <Footer />
    </>
  )
}

export default App
