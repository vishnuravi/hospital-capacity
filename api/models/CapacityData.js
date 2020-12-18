const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CapacityData', {
    hospital_pk: {
      type: DataTypes.STRING(64),
      allowNull: false,
      primaryKey: true
    },
    collection_week: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true
    },
    state: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    hospital_name: {
      type: DataTypes.STRING(77),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    zip: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    hospital_subtype: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    fips_code: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    total_beds: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    all_adult_hospital_inpatient_beds: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    inpatient_beds_used: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    all_adult_hospital_inpatient_bed_occupied: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    total_adult_patients_hospitalized_confirmed_and_suspected_covid: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    total_adult_patients_hospitalized_confirmed_covid: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    total_staffed_adult_icu_beds: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    staffed_adult_icu_bed_occupancy: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    staffed_icu_adult_patients_confirmed_and_suspected_covid: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    staffed_icu_adult_patients_confirmed_covid: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'CapacityData',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "hospital_pk" },
          { name: "collection_week" },
        ]
      },
    ]
  });
};
