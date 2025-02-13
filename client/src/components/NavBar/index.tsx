import "./style.css";
import { Link } from "react-router-dom";

export default function UserNavBar() {
  return (
    <header className="navBar">
     <Link to="/"> <img
        src="/public/logo-pdf.pdf_-_Copie-removebg-preview.png"
        alt="logo"
        className="logo"
      />
      </Link>
      <h1 className="titleNav">Urgence plomberie</h1>
      <Link to="/contact" className="buttonNav">
        Nous Contacter
      </Link>
    </header>
  );
}
