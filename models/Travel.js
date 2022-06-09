const connection = require('./connection');

const getAllTravelsForPessenger = async (passengerId) => {
  const [travels] = await connection.execute(
    'SELECT * FROM trybe_car.travel WHERE passenger_id = ?;',
    [passengerId],
  );

  return travels;
};

const getAllTravelsForDriver = async (driverId) => {
  const [travels] = await connection.execute(
    'SELECT * FROM trybe_car.travel WHERE driver_id = ?;',
    [driverId],
  );

  return travels;
};

const createTravel = async (passengerId, startingPoint) => {
  const [newTravel] = await connection.execute(
    `INSERT INTO trybe_car.travel (passenger_id, starting_point)
    VALUES (?, ?)`,
    [passengerId, startingPoint],
  );

  return newTravel.insertId;
};

const createStopTravel = async (travelId, stopTravel, stopTravelOrder) => {
  await connection.execute(
    `INSERT INTO trybe_car.stops_travel (travel_id, address_travel, stop_order)
    VALUES (?, ?, ?)`,
    [travelId, stopTravel, stopTravelOrder],
  );
};

module.exports = {
  getAllTravelsForPessenger,
  getAllTravelsForDriver,
  createTravel,
  createStopTravel
};
