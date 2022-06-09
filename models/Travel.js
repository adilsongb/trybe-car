const connection = require('./connection');

const createTravel = async (passengerId, driverId, startingPoint, statusTravel) => {
  const [travel] = await connection.execute(
    `INSERT INTO trybe_car.travel (passenger_id, driver_id, starting_point, status_travel)
    VALUES (?, ?, ?, ?)`,
    [passengerId, driverId, startingPoint, statusTravel],
  );
  return {
    id: travel.insertId,
    passengerId,
    driverId,
    startingPoint,
    requestTime,
    statusTravel,
  };
};

module.exports = {
  createTravel
};
