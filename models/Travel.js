const connection = require('./connection');

const createTravel = async (passengerId, driverId, startingPoint) => {
  await connection.execute(
    `INSERT INTO trybe_car.travel (passenger_id, driver_id, starting_point)
    VALUES (?, ?, ?)`,
    [passengerId, driverId, startingPoint],
  );
};

module.exports = {
  createTravel
};
