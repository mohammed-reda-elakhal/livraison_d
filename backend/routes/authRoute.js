const router = require("express").Router();
const { loginProfileCtrl , registerAdmin , registerClient, registerLivreur, selectStoreCtrl, registerTeam } = require("../Controllers/authController");
const { createClientFile } = require("../Controllers/clientControllers");
const fileup = require("../Middlewares/fileUpload");




// api/auth/register/role
router.post("/register/admin",registerAdmin);
router.post("/register/client",registerClient);
router.post("/register/livreur",registerLivreur);
router.post("/register/team",registerTeam);


// api/auth/login/:role
router.post("/login/:role",loginProfileCtrl);


// api/auth/selectStore
router.get("/selectStore",selectStoreCtrl);

router.post("/login",loginProfileCtrl);


module.exports= router;
