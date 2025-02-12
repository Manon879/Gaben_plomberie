import "./style.css";
import { Link } from "react-router-dom";

export default function UserNavBar() {
  return (
    <header className="navBar">
      <img
        src="/public/logo-pdf.pdf_-_Copie-removebg-preview.png"
        alt="logo"
        className="logo"
      />
      <h1 className="titleNav">Dépannage 24h/24h</h1>
      <Link to="/contact" className="buttonNav">
        Nous Contacter
      </Link>
    </header>
  );
}
