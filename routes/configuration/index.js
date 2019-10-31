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
              timeToFocus: rows[0].time_to_focus,
              minAngleBetweenSounds: rows[0].min_angle_between_sounds,
              maxMediaPlayers: rows[0].max_media_players,
              maxIdleSensorDifference: rows[0].max_idle_sensor_difference,
              maxIdleSeconds: rows[0].max_idle_seconds
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
      req.body.timeToFocus != null &&
      req.body.minAngleBetweenSounds != null &&
      req.body.maxMediaPlayers != null &&
      req.body.maxIdleSensorDifference != null &&
      req.body.maxIdleSeconds != null
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
      (primary_angle, secondary_angle, time_to_focus, min_angle_between_sounds, max_media_players, max_idle_sensor_difference, max_idle_seconds)
      VALUES
      ($1, $2, $3, $4)
    `,
      [
        req.body.primaryAngle,
        req.body.secondaryAngle,
        req.body.timeToFocus,
        req.body.minAngleBetweenSounds,
        req.body.maxMediaPlayers,
        req.body.maxIdleSensorDifference,
        req.body.maxIdleSeconds
      ]
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
