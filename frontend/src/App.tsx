
// App.css
import "@mantine/core/styles.css";
import "./App.css";
import Footer from './components/footer';
import ComponentsDemoPage from "./pages/ComponentsDemo";
import FeltBackground from "./components/layout/FeltBackground";
import LoginRegisterPage from "./pages/LoginRegister";
import Header from "./components/header";
import { Container } from "@mantine/core";
import { useState } from "react";
import HomePage from "./pages/Home";
import SettingsPage from "./pages/settings/index";
import { ToastContainer } from "react-toastify";
import GamePage from "./pages/Game";
import SideMenu from "./components/SideMenu";
import useUserProfile from "./hooks/useUserProfile";

function App() {
  const rootElement = document.getElementById("root")!;
  const page = rootElement.getAttribute("data-page") || "home";
  const username = rootElement.getAttribute("data-username") || "";
  // const userId = rootElement.getAttribute("data-user-id") || "";
  // const userSecretKey = rootElement.getAttribute("data-user-secret-key") || "";

  const [drawerOpened, setDrawerOpened] = useState(false);

  let mainContent = <></>;
  const csrfToken = rootElement.getAttribute("data-csrf-token") || "";
  const title = rootElement.getAttribute("data-title") || "";
  const gameId = rootElement.getAttribute("data-game-id") || undefined;
  const section = rootElement.getAttribute("data-section") || undefined;

  const userProfile = useUserProfile();

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
    case "game":
      mainContent = <GamePage {...{ gameId, title, section, csrfToken, userProfile }} />;
      break;
    default:
      // Render default content or redirect
      mainContent = <HomePage {...{ userProfile }} />;
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

      <SideMenu drawerOpened={drawerOpened} setDrawerOpened={setDrawerOpened} />

      <ToastContainer />

      <Footer />
    </>
  )
}

export default App
