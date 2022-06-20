const sinon = require('sinon');
const { expect } = require('chai');

const TravelModel = require('../../models/Travel');
const TravelService = require('../../services/travelService');
const travelsMock = require('../mocks/travels'); 

describe('Solicita uma nova viagem', () => {
  describe('Quando há uma viagem em andamento', () => {
    const newTravelRequest = {
      passengerId: '1',
      startingPoint: 'Rua teotonio vilela',
      stopsTravel: ['Rua gonsalve dias', 'Rua do emirante']
    };

    before(() => {
      sinon.stub(TravelModel, 'getAllTravelsForPessenger')
        .resolves(travelsMock);
    });

    after(() => {
      TravelModel.getAllTravelsForPessenger.restore();
    });

    it.only('É lançado um erro', async () => {
      const response = await TravelService.createTravel('1', 'Rua teotonio vilela', ['Rua gonsalve dias', 'Rua do emirante']);
      expect(response).to.equal('TRAVEL_IN_PROGRESS');
    });
  });
});
