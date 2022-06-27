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

      type: {
        type: DataTypes.INTEGER,
      },

      category: {
        type: DataTypes.INTEGER,
      },

      website: {
        type: DataTypes.TEXT,
      },

      city: {
        type: DataTypes.TEXT,
      },

      link1: {
        type: DataTypes.TEXT,
      },

      link2: {
        type: DataTypes.TEXT,
      },

      link3: {
        type: DataTypes.TEXT,
      },

      link4: {
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
    db.meetups.belongsToMany(db.users, {
      as: 'user',
      constraints: false,
      through: 'meetupsUserUsers',
    });

    db.meetups.belongsToMany(db.products, {
      as: 'products',
      constraints: false,
      through: 'meetupsProductsProducts',
    });

    db.meetups.belongsToMany(db.nodes, {
      as: 'nodes',
      constraints: false,
      through: 'meetupsNodesNodes',
    });

    db.meetups.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.meetups.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return meetups;
};
