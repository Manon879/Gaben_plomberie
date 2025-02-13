import { type FormEvent, useState } from "react";
import "./style.css";
import Footer from "../Footer";
import UserNavBar from "../NavBar";

export default function ContactBlock() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [emailError, setEmailError] = useState("");
  const [submitStatus, setSubmitStatus] = useState({
    message: "",
    isError: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "email") {
      validateEmail(value);
    }
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setEmailError(
      !value ? "" : !emailRegex.test(value) ? "Format d'email invalide" : "",
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (emailError) {
      setSubmitStatus({
        message: "Veuillez corriger les erreurs avant d'envoyer",
        isError: true,
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:3310/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          message: "Message envoyé avec succès !",
          isError: false,
        });

        setFormData({
          fullName: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        throw new Error(data.message || "Une erreur est survenue");
      }
    } catch (error) {
      setSubmitStatus({
        message:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de l'envoi",
        isError: true,
      });
    }
  };

  return (
    <>
      <UserNavBar />
      <h2 className="contact">Me Contacter</h2>
      <form onSubmit={handleSubmit} className="contactForm">
        <section className="contactDescription" />

        <label htmlFor="fullName" className="Name">
          <input
            id="fullName"
            className="blockName"
            required
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Nom Prénom..."
          />
        </label>

        <label htmlFor="email" className="Email">
          <input
            id="email"
            className="blockEmail"
            required
            type="email"
            name="email"
            value={formData.email}
            placeholder="Votre e-mail..."
            onChange={handleChange}
          />
        </label>
        {emailError && <p className="errorEmail">{emailError}</p>}

        <label htmlFor="message" className="Message">
          <textarea
            id="message"
            className="blockMessage"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Votre message..."
            required
          />
        </label>

        {submitStatus.message && (
          <p
            className={submitStatus.isError ? "errorMessage" : "successMessage"}
          >
            {submitStatus.message}
          </p>
        )}

        <button className="send" type="submit">
          Envoyer
        </button>
      </form>
      <Footer />
    </>
  );
}
