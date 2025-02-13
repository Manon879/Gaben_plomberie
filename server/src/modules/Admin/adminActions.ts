import type { Request, RequestHandler } from "express";
import adminRepository from "./adminRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const admins = await adminRepository.readAll();
    res.json(admins);
  } catch (err) {
    next(err);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const adminId = Number(req.params.id);
    const admin = await adminRepository.read(adminId);

    if (admin == null) {
      res.sendStatus(404);
    } else {
      res.json(admin);
    }
  } catch (err) {
    next(err);
  }
};

const add: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const insertId = await adminRepository.create({ email, password });
    res.status(201).json({ insertId });
  } catch (error) {
    next(error);
  }
};
const browseServices: RequestHandler = async (req, res, next) => {
  try {
    const services = await adminRepository.getAllServices();
    res.json(services);
  } catch (err) {
    next(err);
  }
};

const readService: RequestHandler = async (req, res, next) => {
  try {
    const serviceId = Number(req.params.serviceId);
    const service = await adminRepository.getServiceById(serviceId);

    if (service == null) {
      res.sendStatus(404);
    } else {
      res.json(service);
    }
  } catch (err) {
    next(err);
  }
};

const addService: RequestHandler = async (req, res, next) => {
  try {
    const { title, description, picture } = req.body;

    const insertId = await adminRepository.createService({
      title,
      description,
      picture,
    });

    res.status(201).json({ insertId });
  } catch (err) {
    console.error("Erreur lors de la création du service:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({
      message: "Erreur lors de la création du service",
      error: errorMessage,
    });
  }
};

const editService: RequestHandler = async (req, res, next) => {
  try {
    const serviceId = Number(req.params.serviceId);
    const { title, description, picture } = req.body;

    const success = await adminRepository.updateService(serviceId, {
      title,
      description,
      picture,
    });

    if (success) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
};
const destroyService: RequestHandler = async (req, res, next) => {
  try {
    const serviceId = Number(req.params.serviceId);

    const success = await adminRepository.deleteService(serviceId);

    if (success) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
};

interface CustomRequest extends Request {
  fileValidationError?: string;
}

const handleUpload: RequestHandler = async (req: CustomRequest, res, next) => {
  if (req.fileValidationError) {
    res.status(400).json({ error: req.fileValidationError });
    return;
  }

  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  try {
    // Utiliser un chemin relatif pour l'URL
    const relativePath = `uploads/${req.file.filename}`;

    res.status(200).json({
      fileUrl: relativePath,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: "Upload failed", details: errorMessage });
    next(error);
  }
};

export default {
  browse,
  read,
  add,
  browseServices,
  readService,
  addService,
  editService,
  destroyService,
  handleUpload,
};
