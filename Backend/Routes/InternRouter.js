const router = require('express').Router();

const Interncontrollers = require("../Controllers/Interncontrollers")
const ensureAuthentication = require('../Middleware/ensureAuthentication');
const fetchController = require("../Controllers/fetchController")
const applyInternship = require('../Controllers/applyInternship')
const deleteController = require('../Controllers/deleteController')
const companylist = require('../Controllers/companylist')
const deletecompany = require('../Controllers/deletecompany')

router.post("/",ensureAuthentication,Interncontrollers);
router.post('/fetch-credentials',ensureAuthentication,fetchController);
router.post('/run-puppeteer',ensureAuthentication,applyInternship );
router.delete('/delete-credentials',ensureAuthentication,deleteController);
router.post('/companies',ensureAuthentication,companylist)
router.delete('/delete-company',ensureAuthentication,deletecompany)
module.exports = router;