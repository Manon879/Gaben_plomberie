import type { NextFunction, Request, Response } from "express";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function validateContactForm(
  req: Request,
  res: Response,
  next: NextFunction,
): Response | undefined {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "Validation error" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Adresse email invalide",
    });
  }

  next();
}

// Fonction d'envoi d'email
const sendMail = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "manonlabat10@gmail.com",
      subject: `Nouveau message de ${email} - ${subject}`,
      html: `
                <h3>Nouveau message du formulaire de contact</h3>
                <p><strong>Nom:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Sujet:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({
      success: true,
      message: "Email envoyé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'envoi de l'email",
    });
  }
};

export default {
  validateContactForm,
  sendMail,
};
