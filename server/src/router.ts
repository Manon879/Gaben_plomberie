import express from "express";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

import contactController from "./middleware/node";
import upload from "./middleware/uploads";
// Define item-related routes
import adminActions from "./modules/Admin/adminActions";

router.get("/admin", adminActions.browse);
router.get("/admin/:id", adminActions.read);
router.post("/admin", adminActions.add);

router.get("/services", adminActions.browseServices);
router.get("/services/:serviceId", adminActions.readService);
router.post("/admin/:adminId/services", adminActions.addService);
router.put("/admin/:adminId/services/:serviceId", adminActions.editService);
router.delete(
  "/admin/:adminId/services/:serviceId",
  adminActions.destroyService,
);
router.post(
  "/services/upload",
  upload.single("file"),
  adminActions.handleUpload,
);
router.post("/contact", contactController.sendMail);
/* ************************************************************************* */

export default router;
