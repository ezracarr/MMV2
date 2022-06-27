const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class PaymentsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const payments = await db.payments.create(
      {
        id: data.id || undefined,

        payer: data.payer || null,
        payee: data.payee || null,
        amount: data.amount || null,
        amount_sats: data.amount_sats || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await payments.setMeetup_from(data.meetup_from || null, {
      transaction,
    });

    await payments.setMeetup_to(data.meetup_to || [], {
      transaction,
    });

    await payments.setProduct(data.product || [], {
      transaction,
    });

    return payments;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const payments = await db.payments.findByPk(id, {
      transaction,
    });

    await payments.update(
      {
        payer: data.payer || null,
        payee: data.payee || null,
        amount: data.amount || null,
        amount_sats: data.amount_sats || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await payments.setMeetup_from(data.meetup_from || null, {
      transaction,
    });

    await payments.setMeetup_to(data.meetup_to || [], {
      transaction,
    });

    await payments.setProduct(data.product || [], {
      transaction,
    });

    return payments;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const payments = await db.payments.findByPk(id, options);

    await payments.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await payments.destroy({
      transaction,
    });

    return payments;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const payments = await db.payments.findOne({ where }, { transaction });

    if (!payments) {
      return payments;
    }

    const output = payments.get({ plain: true });

    output.meetup_to = await payments.getMeetup_to({
      transaction,
    });

    output.meetup_from = await payments.getMeetup_from({
      transaction,
    });

    output.product = await payments.getProduct({
      transaction,
    });

    return output;
  }

  static async findAll(filter, options) {
    var limit = filter.limit || 0;
    var offset = 0;
    const currentPage = +filter.page;

    offset = currentPage * limit;

    var orderBy = null;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [
      {
        model: db.meetups,
        as: 'meetup_from',
      },

      {
        model: db.meetups,
        as: 'meetup_to',
        through: filter.meetup_to
          ? {
              where: {
                [Op.or]: filter.meetup_to.split('|').map((item) => {
                  return { ['Id']: Utils.uuid(item) };
                }),
              },
            }
          : null,
        required: filter.meetup_to ? true : null,
      },

      {
        model: db.products,
        as: 'product',
        through: filter.product
          ? {
              where: {
                [Op.or]: filter.product.split('|').map((item) => {
                  return { ['Id']: Utils.uuid(item) };
                }),
              },
            }
          : null,
        required: filter.product ? true : null,
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.payer) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('payments', 'payer', filter.payer),
        };
      }

      if (filter.payee) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('payments', 'payee', filter.payee),
        };
      }

      if (filter.amountRange) {
        const [start, end] = filter.amountRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            amount: {
              ...where.amount,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            amount: {
              ...where.amount,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.amount_satsRange) {
        const [start, end] = filter.amount_satsRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            amount_sats: {
              ...where.amount_sats,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            amount_sats: {
              ...where.amount_sats,
              [Op.lte]: end,
            },
          };
        }
      }

      if (
        filter.active === true ||
        filter.active === 'true' ||
        filter.active === false ||
        filter.active === 'false'
      ) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.meetup_from) {
        var listItems = filter.meetup_from.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          meetup_fromId: { [Op.or]: listItems },
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    let { rows, count } = await db.payments.findAndCountAll({
      where,
      include,
      distinct: true,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      order:
        filter.field && filter.sort
          ? [[filter.field, filter.sort]]
          : [['createdAt', 'desc']],
      transaction,
    });

    //    rows = await this._fillWithRelationsAndFilesForRows(
    //      rows,
    //      options,
    //    );

    return { rows, count };
  }

  static async findAllAutocomplete(query, limit) {
    let where = {};

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('payments', 'id', query),
        ],
      };
    }

    const records = await db.payments.findAll({
      attributes: ['id', 'id'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['id', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.id,
    }));
  }
};
