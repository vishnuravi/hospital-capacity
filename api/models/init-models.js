var DataTypes = require("sequelize").DataTypes;
var _CapacityData = require("./CapacityData");

function initModels(sequelize) {
  var CapacityData = _CapacityData(sequelize, DataTypes);


  return {
    CapacityData,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
