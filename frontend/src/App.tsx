import { Container } from "react-bootstrap";
import { ProvideIdentity } from "./hooks/GlobalHooks/useIdentityHook";
import LoginPage from "./components/LoginPage/LoginPage";
import MainApp from "./components/MainApp";
import { Navigate, Route, Routes } from "react-router-dom";

import GlobalModal from "./components/hoc/Modal/GlobalModal";
import { ProvideModal } from "./hooks/GlobalHooks/useModalHook";
import PagesExport from "./components/Pages/PagesExport";
import LogoutPage from "./components/LogoutPage/LogoutPage";
import SignUpPage from "./components/SignUpPage/SignUpPage";
import SignUpConfirmed from "./components/SignUpPage/SignUpConfirmed";

export interface IPage {
  component: () => JSX.Element;
  path: string;
}

function App() {
  return (
    <ProvideIdentity>
      <ProvideModal>
        <Container
          fluid
          className="p-0 d-flex justify-content-center"
          style={{ height: "100vh", backgroundColor: "#29335c" }}
        >
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="/signUp" element={<SignUpPage />} />
            <Route path="/signUpConfirmed" element={<SignUpConfirmed />} />
            {PagesExport.map((pageExports: IPage) => (
              <Route
                key={pageExports.path}
                path={`/${pageExports.path}`}
                element={
                  <MainApp>
                    {pageExports.component && <pageExports.component />}
                  </MainApp>
                }
              />
            ))}

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <GlobalModal />
        </Container>
      </ProvideModal>
    </ProvideIdentity>
  );
}

export default App;
