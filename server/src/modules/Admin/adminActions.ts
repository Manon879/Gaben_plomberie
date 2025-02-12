import type { RequestHandler } from "express";
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
    const adminId = Number(req.params.adminId);
    const { title, description, picture } = req.body;

    const insertId = await adminRepository.createService(adminId, {
      title,
      description,
      picture,
    });

    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};

const editService: RequestHandler = async (req, res, next) => {
  try {
    const adminId = Number(req.params.adminId);
    const serviceId = Number(req.params.serviceId);
    const { title, description, picture } = req.body;

    const success = await adminRepository.updateService(adminId, serviceId, {
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
    const adminId = Number(req.params.adminId);
    const serviceId = Number(req.params.serviceId);

    const success = await adminRepository.deleteService(adminId, serviceId);

    if (success) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
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
};
