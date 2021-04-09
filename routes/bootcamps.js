const express = require("express");

const {
  getBootcamps,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
  createBootcamp,
  getBootcampInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");
//Include other resources router

const courseRouter = require("./courses");

const router = express.Router();

//Re route into other resources router

router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampInRadius);

router.route("/").get(getBootcamps).post(createBootcamp);

router.route("/:id/photo").put(bootcampPhotoUpload);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
