import express from "express";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define item-related routes
import adminActions from "./modules/Admin/adminActions";

router.get("/admin", adminActions.browse);
router.get("/admin/:id", adminActions.read);
router.post("/admin", adminActions.add);

router.get("/service", adminActions.browseServices);
router.get("/service/:serviceId", adminActions.readService);
router.post("/admin/:adminId/service", adminActions.addService);
router.put("/admin/:adminId/service/:serviceId", adminActions.editService);
router.delete("/admin/:adminId/service/:serviceId", adminActions.destroyService);


/* ************************************************************************* */

export default router;
