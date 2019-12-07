const express = require("express");
const router = express.Router();

const db = require("../../config/db");
const isAuthenticated = require("../../middlewares/isAuthenticated");

router.get("/", async (req, res, next) => {
  try {
    const { rows } = await db.query("SELECT * FROM sounds");
    return res.json({
      sounds: rows.map(sound => {
        return {
          id: sound.id,
          location: sound.location,
          description: sound.description,
          category: sound.category,
          cdNumber: sound.cd_number,
          cdName: sound.cd_name,
          trackNumber: sound.track_number,
          selected: sound.selected,
          onPhone: true
        };
      })
    });
  } catch (e) {
    return next(e);
  }
});

router.get("/selected", async (req, res, next) => {
  try {
    const { rows } = await db.query("SELECT * FROM sounds WHERE selected=True");
    return res.json({
      sounds: rows.map(sound => {
        return {
          id: sound.id,
          location: sound.location,
          description: sound.description,
          category: sound.category,
          cdNumber: sound.cd_number,
          cdName: sound.cd_name,
          trackNumber: sound.track_number,
          selected: sound.selected,
          onPhone: true
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
    // Attempt to insert
    const { rows } = await db.query(
      `
      INSERT INTO sounds
      (location, description, category, cd_number, cd_name, track_number, selected)
      VALUES
      ($1, $2, $3, $4, $5, $6, False)
    `,
      [
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

router.post("/:id/select", isAuthenticated, async (req, res, next) => {
  // Verify input
  if (!req.params.id) {
    return res.status(400).json({ message: "Invalid parameters" });
  }
  try {
    // Attempt to update
    const { rows } = await db.query(
      `
      UPDATE sounds 
      SET (selected) = (True)
      WHERE id=$1
    `,
      [req.params.id]
    );
    return res.sendStatus(200);
  } catch (e) {
    return next(e);
  }
});

router.post("/:id/deselect", isAuthenticated, async (req, res, next) => {
  // Verify input
  if (!req.params.id) {
    return res.status(400).json({ message: "Invalid parameters" });
  }
  try {
    // Attempt to update
    const { rows } = await db.query(
      `
      UPDATE sounds 
      SET (selected) = (False)
      WHERE id=$1
    `,
      [req.params.id]
    );
    return res.sendStatus(200);
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
