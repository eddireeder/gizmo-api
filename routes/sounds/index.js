const express = require("express");
const router = express.Router();

const db = require("../../config/db");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const generateDirection = require("./utils/generateDirection");

router.get("/", async (req, res, next) => {
  try {
    const { rows } = await db.query("SELECT * FROM sounds");
    return res.json({
      sounds: rows.map(sound => {
        return {
          id: sound.id,
          directionX: sound.direction_x,
          directionY: sound.direction_y,
          directionZ: sound.direction_z,
          location: sound.location,
          description: sound.description,
          category: sound.category,
          cdNumber: sound.cd_number,
          cdName: sound.cd_name,
          trackNumber: sound.track_number
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
      req.body.location != null &&
      req.body.description != null &&
      req.body.category != null &&
      req.body.cdNumber != null &&
      req.body.cdName != null &&
      req.body.trackNumber != null
    )
  ) {
    return res.status(400).json({ message: "Invalid parameters" });
  }
  try {
    // Generate direction for the sound
    const direction = await generateDirection();
    // Attempt to insert
    const { rows } = await db.query(
      `
      INSERT INTO sounds
      (direction_x, direction_y, direction_z, location, description, category, cd_number, cd_name, track_number)
      VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `,
      [
        direction.x,
        direction.y,
        direction.z,
        req.body.location,
        req.body.description,
        req.body.category,
        req.body.cdNumber,
        req.body.cdName,
        req.body.trackNumber
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
    const { rows } = await db.query("DELETE FROM sounds WHERE id=$1", [
      req.params.id
    ]);
    return res.sendStatus(200);
  } catch (e) {
    return next(e);
  }
});

router.post(
  "/regenerateDirections",
  isAuthenticated,
  async (req, res, next) => {
    try {
      // Remove direction from all sounds
      await db.query(`
        UPDATE sounds
        SET (direction_x, direction_y, direction_z) = (null, null, null)
      `);
      // Retrieve all sounds
      const { rows } = await db.query("SELECT * FROM sounds");
      // Generate a new direction for each sound and update it
      for (row of rows) {
        const direction = await generateDirection();
        await db.query(
          `
          UPDATE sounds
          SET (direction_x, direction_y, direction_z) = ($1, $2, $3)
          WHERE id=$4
        `,
          [direction.x, direction.y, direction.z, row.id]
        );
      }
      return res.sendStatus(200);
    } catch (e) {
      return next(e);
    }
  }
);

module.exports = router;
