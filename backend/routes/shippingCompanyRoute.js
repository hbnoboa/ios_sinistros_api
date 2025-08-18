const { Router } = require("express");

const {
  getShippingCompanies,
  getShippingCompany,
  postShippingCompany,
  putShippingCompany,
  deleteShippingCompany,
} = require("../controllers/shippingCompanyController");

const router = Router();

router.get("", getShippingCompanies);
router.get("/:id", getShippingCompany);
router.post("", postShippingCompany);
router.put("/:id", putShippingCompany);
router.delete("/:id", deleteShippingCompany);

module.exports = router;
