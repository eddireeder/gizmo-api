const express = require("express");
const router = express.Router();

const db = require("../../config/db");
const isAuthenticated = require("../../middlewares/isAuthenticated");

router.get("/", async (req, res, next) => {
  try {
    const { rows } = await db.query("SELECT * FROM configurations");
    return res.json({
      configurations: rows.map(configuration => {
        return {
          id: configuration.id,
          primaryAngle: configuration.primary_angle,
          secondaryAngle: configuration.secondary_angle,
          timeToFocus: configuration.time_to_focus
        };
      })
    });
  } catch (e) {
    return next(e);
  }
});

router.post("/", isAuthenticated, async (req, res, next) => {
  // Verify input
  if (
    !(
      req.body.hasOwnProperty("primaryAngle") &&
      req.body.hasOwnProperty("secondaryAngle") &&
      req.body.hasOwnProperty("timeToFocus")
    )
  ) {
    return res.status(400).json({ message: "Invalid parameters" });
  }
  try {
    // Attempt to insert
    const { rows } = await db.query(
      `
      INSERT INTO configurations
      (primary_angle, secondary_angle, time_to_focus)
      VALUES
      ($1, $2, $3)
    `,
      [req.body.primaryAngle, req.body.secondaryAngle, req.body.timeToFocus]
    );
    return res.sendStatus(200);
  } catch (e) {
    return next(e);
  }
});

router.delete("/:id", isAuthenticated, async (req, res, next) => {
  // Verify input
  if (!req.params.id) {
    return res.status(400).json({ message: "Invalid parameters" });
  }
  // Attempt to delete
  try {
    const { rows } = await db.query("DELETE FROM configurations WHERE id=$1", [
      req.params.id
    ]);
    return res.sendStatus(200);
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
