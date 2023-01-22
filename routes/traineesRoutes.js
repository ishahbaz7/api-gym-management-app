const express = require("express");
const traineeController = require("../controllers/traineeController");
const { body } = require("express-validator");
const Trainee = require("../models/traineeModel");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

const addTraineeValidation = [
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
  body("profileImg").not().isEmpty().withMessage("Please upload profile image"),
  body("mobileNo").custom((value) => {
    return Trainee.find({ mobileNo: value }).then((trainee) => {
      if (trainee.length >= 1) {
        console.log("trainee", trainee);
        return Promise.reject("Trainee already exist!");
      }
    });
  }),
];

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
  addTraineeValidation,
  isAuth,
  traineeController.postTrainee
);
router.put(
  "/trainee",
  body("name").not().isEmpty().withMessage("Please enter your name"),
  body("mobileNo").not().isEmpty().withMessage("Please enter mobile no"),
  body("profileImg").not().isEmpty().withMessage("Please select profile image"),
  isAuth,
  traineeController.putTrainee
);

router.delete("/trainee/:id", isAuth, traineeController.deleteTrainee);

router.post("/delete-trainees", isAuth, traineeController.deleteTrainees);

router.get("/membershipTypes", isAuth, traineeController.getMembershipTypes);

router.get("/trainee-count", isAuth, traineeController.getTraineeCount);
router.get("/expired-trainee-count", isAuth, traineeController.getExpiredCount);

module.exports = router;
