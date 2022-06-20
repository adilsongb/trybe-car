const sinon = require('sinon');
const { expect } = require('chai');

const TravelModel = require('../../models/Travel');
const TravelService = require('../../services/travelService');
const travelsMock = require('../mocks/travels'); 

describe('Solicita uma nova viagem', () => {
  describe('Quando há uma viagem em andamento', () => {
    before(() => {
      sinon.stub(TravelModel, 'getAllTravelsForPessenger')
        .resolves(travelsMock);
    });

    after(() => {
      TravelModel.getAllTravelsForPessenger.restore();
    });

    it('É retornada a string "TRAVEL_IN_PROGRESS"', async () => {
      const response = await TravelService
        .createTravel('1', 'Rua teotonio vilela', ['Rua gonsalve dias', 'Rua do emirante']);
      expect(response).to.equal('TRAVEL_IN_PROGRESS');
    });
  });
});
