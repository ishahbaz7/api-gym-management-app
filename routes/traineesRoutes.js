const express = require("express");
const traineeController = require("../controllers/traineeController");
const { body } = require("express-validator");
const Trainee = require("../models/traineeModel");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.get("/trainees", isAuth, traineeController.getTrainees);
router.get("/trainee/:id", isAuth, traineeController.getTrainee);
router.post(
  "/renew-membership",

  [
    body("startDate").not().isEmpty().withMessage("Please select start date"),
    body("endDate").not().isEmpty().withMessage("Please select end date"),
    body("amount").not().isEmpty().withMessage("Please enter amount"),
    body("membershipType")
      .not()
      .isEmpty()
      .withMessage("Please select membership type"),
  ],
  isAuth,
  traineeController.renewMembership
);
router.post(
  "/trainee",
  [
    body("name").not().isEmpty().withMessage("Please Enter Name"),
    body("mobileNo").not().isEmpty().withMessage("Please Enter Mobile No"),
    body("membershipType")
      .not()
      .isEmpty()
      .withMessage("Please Select membership type"),
    body("endDate")
      .not()
      .isEmpty()
      .withMessage("Please Enter membership end Date"),
    body("startDate")
      .not()
      .isEmpty()
      .withMessage("Please Enter membership start date"),
    body("amount").not().isEmpty().withMessage("Please Enter amount"),
    body("membershipType")
      .not()
      .isEmpty()
      .withMessage("Please Select Membership Type"),
    body("profileImg")
      .not()
      .isEmpty()
      .withMessage("Please upload profile image"),
    body("mobileNo").custom((value) => {
      return Trainee.find({ mobileNo: value }).then((trainee) => {
        if (trainee.length >= 1) {
          console.log("trainee", trainee);
          return Promise.reject("Trainee already exist!");
        }
      });
    }),
  ],
  isAuth,
  traineeController.postTrainee
);
router.delete("/trainee/:id", isAuth, traineeController.deleteTrainee);
router.post("/delete-trainees", isAuth, traineeController.deleteTrainees);

router.get("/membershipTypes", isAuth, traineeController.getMembershipTypes);

router.get("/trainee-invoice/:id", isAuth, traineeController.getTraineeInvoice);

router.get("/collections-stats", isAuth, traineeController.getCollectionStats);

module.exports = router;
