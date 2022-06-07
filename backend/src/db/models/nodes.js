const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const nodes = sequelize.define(
    'nodes',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      macaroon: {
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

  nodes.associate = (db) => {
    db.nodes.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.nodes.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return nodes;
};
