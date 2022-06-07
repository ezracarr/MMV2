const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class ChannelsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const channels = await db.channels.create(
      {
        id: data.id || undefined,

        partyA: data.partyA || null,
        partyB: data.partyB || null,
        partyA_local_balance: data.partyA_local_balance || null,
        partyB_local_balance: data.partyB_local_balance || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return channels;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const channels = await db.channels.findByPk(id, {
      transaction,
    });

    await channels.update(
      {
        partyA: data.partyA || null,
        partyB: data.partyB || null,
        partyA_local_balance: data.partyA_local_balance || null,
        partyB_local_balance: data.partyB_local_balance || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return channels;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const channels = await db.channels.findByPk(id, options);

    await channels.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await channels.destroy({
      transaction,
    });

    return channels;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const channels = await db.channels.findOne({ where }, { transaction });

    if (!channels) {
      return channels;
    }

    const output = channels.get({ plain: true });

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
    let include = [];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.partyA) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('channels', 'partyA', filter.partyA),
        };
      }

      if (filter.partyB) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('channels', 'partyB', filter.partyB),
        };
      }

      if (filter.partyA_local_balance) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'channels',
            'partyA_local_balance',
            filter.partyA_local_balance,
          ),
        };
      }

      if (filter.partyB_local_balance) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'channels',
            'partyB_local_balance',
            filter.partyB_local_balance,
          ),
        };
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

    let { rows, count } = await db.channels.findAndCountAll({
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
          Utils.ilike('channels', 'id', query),
        ],
      };
    }

    const records = await db.channels.findAll({
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
