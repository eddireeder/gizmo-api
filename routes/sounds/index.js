const express = require('express');
const router = express.Router();

const db = require('../../config/db');
const isAuthenticated = require('../../middlewares/isAuthenticated');


router.get('/', async (req, res, next) => {
  try {
    const {rows} = await db.query("SELECT * FROM sounds")
    return res.json({sounds: rows.map(sound => {
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
        trackNum: sound.track_num
      }
    })});
  } catch (e) {
    return next(e);
  }
});


router.post('/', isAuthenticated, async (req, res, next) => {
  // Verify input
  if (!(
    req.body.hasOwnProperty('directionX') &&
    req.body.hasOwnProperty('directionY') &&
    req.body.hasOwnProperty('directionZ') &&
    req.body.hasOwnProperty('location') &&
    req.body.hasOwnProperty('description') &&
    req.body.hasOwnProperty('category') &&
    req.body.hasOwnProperty('cdNumber') &&
    req.body.hasOwnProperty('cdName') &&
    req.body.hasOwnProperty('trackNum')
  )) {
    return res.status(400).json({message: "Invalid parameters"});
  }
  // Attempt insert
  try {
    const {rows} = await db.query(`
      INSERT INTO sounds
      (direction_x, direction_y, direction_z, location, description, category, cd_number, cd_name, track_num)
      VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      req.body.directionX,
      req.body.directionY,
      req.body.directionZ,
      req.body.location,
      req.body.description,
      req.body.category,
      req.body.cdNumber,
      req.body.cdName,
      req.body.trackNum
    ]);
    return res.sendStatus(200);
  } catch (e) {
    return next(e);
  }
});


module.exports = router;