import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function HomeLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}
