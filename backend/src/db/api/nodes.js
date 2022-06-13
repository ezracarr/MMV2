const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class NodesDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const nodes = await db.nodes.create(
      {
        id: data.id || undefined,

        macaroon: data.macaroon || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await nodes.setMeetup(data.meetup || null, {
      transaction,
    });

    return nodes;
  }

  

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const nodes = await db.nodes.findByPk(id, {
      transaction,
    });

    await nodes.update(
      {
        macaroon: data.macaroon || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await nodes.setMeetup(data.meetup || null, {
      transaction,
    });

    return nodes;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const nodes = await db.nodes.findByPk(id, options);

    await nodes.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await nodes.destroy({
      transaction,
    });

    return nodes;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const nodes = await db.nodes.findOne({ where }, { transaction });

    if (!nodes) {
      return nodes;
    }

    const output = nodes.get({ plain: true });

    output.meetup = await nodes.getMeetup({
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
        as: 'meetup',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.macaroon) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('nodes', 'macaroon', filter.macaroon),
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

      if (filter.meetup) {
        var listItems = filter.meetup.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          meetupId: { [Op.or]: listItems },
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

    let { rows, count } = await db.nodes.findAndCountAll({
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
          Utils.ilike('nodes', 'id', query),
        ],
      };
    }

    const records = await db.nodes.findAll({
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
