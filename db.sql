CREATE DATABASE IF NOT EXISTS trybe_car;

USE trybe_car;

CREATE TABLE IF NOT EXISTS driver (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name_driver VARCHAR(100),
  license_plate VARCHAR(100),
  car_model VARCHAR(100),
  car_color VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS passenger (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name_passenger VARCHAR(100),
  email VARCHAR(100),
  telephone VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS travel (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  passenger_id INT NOT NULL,
  driver_id INT,
  starting_point VARCHAR(100),
  request_time TIMESTAMP DEFAULT CURRENT_TIME,
  status_travel VARCHAR(100),
  FOREIGN KEY (passenger_id) REFERENCES passenger(id),
  FOREIGN KEY (driver_id) REFERENCES driver(id)
);

CREATE TABLE IF NOT EXISTS stops_travel (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  travel_id INT NOT NULL,
  address_travel VARCHAR(100),
  stop_order INTEGER,
  FOREIGN KEY (travel_id) REFERENCES travel(id)
);

INSERT INTO driver (name_driver, license_plate, car_model, car_color) VALUES
('Fernando Gomez', '7TYP290', 'FORD ECOSPORT', 'Vermelho'),
('Andreia Pinheiro', 'LSN4I49', 'CHEVROLET CORSA', 'Preto');

INSERT INTO passenger (name_passenger, email, telephone) VALUES
('Adilson Gabriel', 'adilsongb.rabelo@gmail.com', '(94) 99476-4523'),
('Laura Fumagalli', 'laura.fumaga@gmail.com', '(51) 97384-2612');

ALTER TABLE travel
ALTER COLUMN request_time TIMESTAMP(); 
