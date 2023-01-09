const express = require("express");
const membershipController = require("../controllers/membershipController");
const { body } = require("express-validator");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.get("/membership", isAuth, membershipController.getMemberships);
router.post(
  "/membership",
  isAuth,
  [
    body("membershipTitle")
      .not()
      .isEmpty()
      .withMessage("Please Enter Membership Title"),
    body("pkg").not().isEmpty().withMessage("Please Select Package"),
    body("amount").not().isEmpty().withMessage("Please Enter Amount"),
  ],
  membershipController.postMembership
);
router.delete("/membership/:id", isAuth, membershipController.deleteMembership);

module.exports = router;
