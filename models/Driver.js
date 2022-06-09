const connection = require('./connection');

const createDriver = async (nameDriver, licensePlate, carModel, carColor) => {
  const [driver] = await connection.execute(
    `INSERT INTO trybe_car.driver (name_driver, license_plate, car_model, car_color)
    VALUES (?, ?, ?, ?)`,
    [nameDriver, licensePlate, carModel, carColor],
  );
  return { id: driver.insertId, nameDriver, licensePlate, carModel, carColor };
};

module.exports = {
  createDriver
};
