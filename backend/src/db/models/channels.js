const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const channels = sequelize.define(
    'channels',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      partyA: {
        type: DataTypes.TEXT,
      },

      partyB: {
        type: DataTypes.TEXT,
      },

      partyA_local_balance: {
        type: DataTypes.TEXT,
      },

      partyB_local_balance: {
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

  channels.associate = (db) => {
    db.channels.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.channels.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return channels;
};
