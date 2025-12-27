import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />
      {}
      <main className="flex-grow pt-16 px-4">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;