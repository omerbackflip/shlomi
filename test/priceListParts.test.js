const assert = require('assert');
const mongoose = require('mongoose');
const createPriceListPartModel = require('../app/models/priceListParts.model');
const specificService = require('../app/services/specific-service');

const modelName = 'priceListPart';
if (mongoose.models[modelName]) mongoose.deleteModel(modelName);
const PriceListPart = createPriceListPartModel(mongoose);

const validPart = new PriceListPart({
  itemCode: 0,
  partId: 1,
  description: 'Test part',
  customerPrice: 68,
  labPrice: 60,
  companyPrice: 50,
  remark: ''
});
assert.strictEqual(validPart.validateSync(), undefined);

const invalidPart = new PriceListPart({
  itemCode: 0,
  partId: 2,
  description: '',
  customerPrice: -1,
  labPrice: 10,
  companyPrice: 10
});
const validationError = invalidPart.validateSync();
assert(validationError.errors.description);
assert(validationError.errors.customerPrice);

const imported = specificService.getPriceListPartsToImport([{
  ItemCode: 0,
  partId: 3,
  description: ' Imported part ',
  customerPrice: 77,
  LabPrice: 70,
  companyPrice: 79,
  Remark: 123
}]);
assert.deepStrictEqual(imported, [{
  itemCode: 0,
  partId: 3,
  description: 'Imported part',
  customerPrice: 77,
  labPrice: 70,
  companyPrice: 79,
  remark: '123'
}]);

assert.throws(() => specificService.getPriceListPartsToImport([
  { ItemCode: 1, partId: 1, description: 'A', customerPrice: 1, companyPrice: 1 },
  { ItemCode: 1, partId: 1, description: 'B', customerPrice: 2, companyPrice: 2 }
]), /duplicate ItemCode\/partId combination/);

mongoose.deleteModel(modelName);
console.log('priceListParts tests passed');
