import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./assets/components/login/LoginView";
import MainWindoView from "./assets/components/mainWindow/MainWindoView";

function App() {
  return (
    <React.Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/main" element={<MainWindoView />} />
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
