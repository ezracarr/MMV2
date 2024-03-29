const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class EventsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const events = await db.events.create(
      {
        id: data.id || undefined,

        date: data.date || null,
        name: data.name || null,
        description: data.description || null,
        location: data.location || null,
        lat: data.lat || null,
        lng: data.lng || null,
        city: data.city || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await events.setMeetup(data.meetup || null, {
      transaction,
    });

    return events;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const events = await db.events.findByPk(id, {
      transaction,
    });

    await events.update(
      {
        date: data.date || null,
        name: data.name || null,
        description: data.description || null,
        location: data.location || null,
        lat: data.lat || null,
        lng: data.lng || null,
        city: data.city || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await events.setMeetup(data.meetup || null, {
      transaction,
    });

    return events;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const events = await db.events.findByPk(id, options);

    await events.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await events.destroy({
      transaction,
    });

    return events;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const events = await db.events.findOne({ where }, { transaction });

    if (!events) {
      return events;
    }

    const output = events.get({ plain: true });

    output.meetup = await events.getMeetup({
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

      if (filter.name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('events', 'name', filter.name),
        };
      }

      if (filter.description) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('events', 'description', filter.description),
        };
      }

      if (filter.location) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('events', 'location', filter.location),
        };
      }

      if (filter.lat) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('events', 'lat', filter.lat),
        };
      }

      if (filter.lng) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('events', 'lng', filter.lng),
        };
      }

      if (filter.city) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('events', 'city', filter.city),
        };
      }

      if (filter.dateRange) {
        const [start, end] = filter.dateRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            date: {
              ...where.date,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            date: {
              ...where.date,
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

    let { rows, count } = await db.events.findAndCountAll({
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
          Utils.ilike('events', 'id', query),
        ],
      };
    }

    const records = await db.events.findAll({
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
