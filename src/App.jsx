import { useState } from "react";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Student from "./pages/Student";

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <MainLayout onNavigate={setPage}>
      {page === "home" && <Home />}
      {page === "about" && <About />}
      {page === "student" && <Student />}
    </MainLayout>
  );
}
