import Header from "./Header";   // only if you actually have this file
import Navbar from "./Navbar";   // corrected path
import Footer from "./Footer";   // corrected path

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar /> {/* or Header if you have a Header wrapper */}
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
