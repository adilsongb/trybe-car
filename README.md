# trybe-car

### Parte 1

- Códigos que serão copiados pelos estudantes para o exemplo do dia:

```sql
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
  request_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status_travel VARCHAR(100) DEFAULT 'aguardando_motorista',
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
```

`./package.json`

```json
{
  "name": "trybercar",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.1",
    "express-rescue": "^1.1.31",
    "mysql2": "^2.3.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.16"
  }
}
```

`./models/connection.js`

```js
const mysql = require('mysql2/promise');

const connection = mysql.createPool({
  host: 'localhost',
  user: 'seu_usuario',
  password: 'sua_senha',
  database: 'trybe_car',
  });

module.exports = connection;
```

`./models/Travel.js`

```js
const connection = require('./connection');

const getAllTravelsForPessenger = async (passengerId) => {
  const [travels] = await connection.execute(
    'SELECT * FROM trybe_car.travel WHERE passenger_id = ?;',
    [passengerId],
  );

  return travels.map((travel) => ({
    id: travel.id,
    passengerId: travel.passenger_id,
    driverId: travel.driver_id,
    startingPoint: travel.starting_point,
    requestTime: travel.request_time,
    statusTravel: travel.status_travel
  }));
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
```

`./middlewares/error.js`

```js
const error = (err, _req, res, _next) => {
  console.error(err);

  res.status(500).json({ message: 'Erro interno do servidor' });
};

module.exports = { error };
```

`./index.js`

```js
const express = require('express')
const rescue = require('express-rescue');
const TravelModel = require('./models/Travel');
const { error } = require('./middlewares/error');

const app = express();

app.use(express.json());

const PORT = 3001;

app.post('/passenger/travel', rescue(async (req, res) => {
  const { passengerId, startingPoint, stopsTravel } = req.body;

  const newTravelId = await TravelModel
    .createTravel(passengerId, startingPoint);

  await Promise.all(
    stopsTravel
      .map((stopAddress, index) =>
        TravelModel.createStopTravel(newTravelId, stopAddress, (index + 1)))
  );

  res.status(200).json({ message: 'trip requested successfully' });
}));

app.use(error);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
```

### Parte 2

- Movemos todas as ações relacionadas ao model (do `index.js`) para a camada de services:

`./services/travelService.js`

```js
const TravelModel = require('../models/Travel');

const createTravel = async (passengerId, startingPoint, stopsTravel) => {
  const newTravelId = await TravelModel
    .createTravel(passengerId, startingPoint);

  await Promise.all(
    stopsTravel
      .map((stopAddress, index) =>
        TravelModel.createStopTravel(newTravelId, stopAddress, (index + 1)))
  );
}

module.exports = {
  createTravel
};
```

- No `index.js`, adaptamos para usar a camada de serviço:

```js
const express = require('express')
const rescue = require('express-rescue');
// Removemos a importação do model
// const TravelModel = require('./models/Travel');
const TravelService = require('./services/travelService');
const { error } = require('./middlewares/error');

const app = express();

app.use(express.json());

const PORT = 3001;

app.post('/passenger/travel', rescue(async (req, res) => {
  const { passengerId, startingPoint, stopsTravel } = req.body;

  await TravelService.createTravel(passengerId, startingPoint, stopsTravel);

  res.status(200).json({ message: 'trip requested successfully' });
}));

app.use(error);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
```

- Implementamos a seguinte regra de negócio na camada de serviço:

> Verificar se já existe uma viagem com o status `em_viagem` ou `aguardando_motorista` ou `motorista_a_caminho` vinculado ao cliente. Se houver a viagem não pode ser solicitada. Caso não exista, s viagem deve ser cadastrada e vinculado ao cliente com o status 'aguardando_motorista`. Todos os endereços de parada devem ser cadastrados na tabela `Paradas` e vinculados a viagem cadastrada.

`./services/travelService.js`

```js
const TravelModel = require('../models/Travel');

const createTravel = async (passengerId, startingPoint, stopsTravel) => {
  // Pegamos todas as viagens relacionadas ao passageiro da requisição 
  const travelsByPassenger = await TravelModel.getAllTravelsForPessenger(passengerId); 

  // Verificamos se há alguma viagem em andamento
  const travelInProgress = travelsByPassenger.some((travel) => {
    if (travel.statusTravel === 'aguardando_motorista') return true;
    if (travel.statusTravel === 'motorista_a_caminho') return true;
    if (travel.statusTravel === 'em_viagem') return true;
    return false;
  })

  // Se houver alguma viagem do passageiro em andamento, lançamos um erro.
  // Esse erro será tratado pelo nosso middleware de erro.
  if (travelInProgress)
    throw { type: 'TRAVEL_IN_PROGRESS' }

  // Se tudo estiver correto com a regra de negócio, então a viagem será criada
  const newTravelId = await TravelModel
    .createTravel(passengerId, startingPoint);

  await Promise.all(
    stopsTravel
      .map((stopAddress, index) =>
        TravelModel.createStopTravel(newTravelId, stopAddress, (index + 1)))
  );
}

module.exports = {
  createTravel
};
```

- Adequamos o middleware de erro para tratar os erros da regra de negócio:

`./middlewares/error.js`

```js
const error = (err, _req, res, _next) => {
  if (err.type === 'TRAVEL_IN_PROGRESS') {
    return res.status(400).json({ message: 'Há uma viagem em progresso!' });
  }

  res.status(500).json({ message: 'Erro interno do servidor' });
};

module.exports = { error };
```
