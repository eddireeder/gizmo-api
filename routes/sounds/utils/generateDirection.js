const db = require("../../../config/db");

generateDirection = async () => {
  // Get the directions of all current sounds
  const response = await db.query(
    "SELECT (direction_x, direction_y, direction_z) FROM sounds"
  );
  const soundDirections = response.rows;
  while (true) {
    // Generate a random direction vector/object
    const randomDirection = generateRandomDirection();
    // Check that direction is not too close to existing directions
    let valid = true;
    for (let soundDirection of soundDirections) {
      if (calculateDegreesFrom(soundDirection, randomDirection) < 30) {
        valid = false;
        break;
      }
    }
    if (valid) {
      return {
        x: randomDirection[0],
        y: randomDirection[1],
        z: randomDirection[2]
      };
    }
  }
};

generateRandomDirection = () => {
  // Generate random vector
  const direction = [
    Math.random() - 0.5,
    Math.random() - 0.5,
    Math.random() - 0.5
  ];
  // Normalise the vector and return
  const magnitude = calculateMagnitude(direction);
  return [
    direction[0] / magnitude,
    direction[1] / magnitude,
    direction[2] / magnitude
  ];
};

calculateDegreesFrom = (direction1, direction2) => {
  // Calculate the dot product of the 2 vectors
  const dotProduct =
    direction1[0] * direction2[0] +
    direction1[1] * direction2[1] +
    direction1[2] * direction2[2];
  // Calculate the magnitudes of the 2 vectors
  const direction1Magnitude = calculateMagnitude(direction1);
  const direction2Magnitude = calculateMagnitude(direction2);
  // Calculate the angle between the 2 vectors and convert to degrees
  return (
    Math.acos(dotProduct / (direction1Magnitude * direction2Magnitude)) *
    (180.0 / Math.PI)
  );
};

calculateMagnitude = direction => {
  return Math.sqrt(
    Math.pow(direction[0], 2) +
      Math.pow(direction[1], 2) +
      Math.pow(direction[2], 2)
  );
};

module.exports = generateDirection;
