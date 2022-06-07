const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const meetups = sequelize.define(
    'meetups',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.TEXT,
      },

      location: {
        type: DataTypes.TEXT,
      },

      lat: {
        type: DataTypes.TEXT,
      },

      long: {
        type: DataTypes.TEXT,
      },

      hasNode: {
        type: DataTypes.TEXT,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  meetups.associate = (db) => {
    db.meetups.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.meetups.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return meetups;
};
