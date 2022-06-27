const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const payments = sequelize.define(
    'payments',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      payer: {
        type: DataTypes.TEXT,
      },

      payee: {
        type: DataTypes.TEXT,
      },

      amount: {
        type: DataTypes.INTEGER,
      },

      amount_sats: {
        type: DataTypes.INTEGER,
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

  payments.associate = (db) => {
    db.payments.belongsToMany(db.meetups, {
      as: 'meetup_to',
      constraints: false,
      through: 'paymentsMeetup_toMeetups',
    });

    db.payments.belongsToMany(db.products, {
      as: 'product',
      constraints: false,
      through: 'paymentsProductProducts',
    });

    db.payments.belongsTo(db.meetups, {
      as: 'meetup_from',
      constraints: false,
    });

    db.payments.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.payments.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return payments;
};
