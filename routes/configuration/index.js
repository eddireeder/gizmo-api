const express = require("express");
const router = express.Router();

const db = require("../../config/db");
const isAuthenticated = require("../../middlewares/isAuthenticated");

router.get("/", async (req, res, next) => {
  try {
    const { rows } = await db.query("SELECT * FROM configurations");
    return res.json({
      configuration:
        rows.length > 0
          ? {
              primaryAngle: rows[0].primary_angle,
              secondaryAngle: rows[0].secondary_angle,
              timeToFocus: rows[0].time_to_focus
            }
          : null
    });
  } catch (e) {
    return next(e);
  }
});

router.post("/", isAuthenticated, async (req, res, next) => {
  // Verify input
  if (
    !(
      req.body.primaryAngle != null &&
      req.body.secondaryAngle != null &&
      req.body.timeToFocus != null
    )
  ) {
    return res.status(400).json({ message: "Invalid parameters" });
  }
  try {
    // Attempt to delete all then insert
    await db.query("DELETE FROM configurations");
    await db.query(
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
