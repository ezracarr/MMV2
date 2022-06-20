const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class MeetupsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const meetups = await db.meetups.create(
      {
        id: data.id || undefined,

        name: data.name || null,
        location: data.location || null,
        lat: data.lat || null,
        long: data.long || null,
        hasNode: data.hasNode || null,
        type: data.type || null,
        category: data.category || null,
        website: data.website || null,
        city: data.city || null,
        link1: data.link1 || null,
        link2: data.link2 || null,
        link3: data.link3 || null,
        link4: data.link4 || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await meetups.setUser(data.user || [], {
      transaction,
    });

    await meetups.setProducts(data.products || [], {
      transaction,
    });

    await meetups.setNodes(data.nodes || [], {
      transaction,
    });

    return meetups;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const meetups = await db.meetups.findByPk(id, {
      transaction,
    });

    await meetups.update(
      {
        name: data.name || null,
        location: data.location || null,
        lat: data.lat || null,
        long: data.long || null,
        hasNode: data.hasNode || null,
        type: data.type || null,
        category: data.category || null,
        website: data.website || null,
        city: data.city || null,
        link1: data.link1 || null,
        link2: data.link2 || null,
        link3: data.link3 || null,
        link4: data.link4 || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await meetups.setUser(data.user || [], {
      transaction,
    });

    await meetups.setProducts(data.products || [], {
      transaction,
    });

    await meetups.setNodes(data.nodes || [], {
      transaction,
    });

    return meetups;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const meetups = await db.meetups.findByPk(id, options);

    await meetups.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await meetups.destroy({
      transaction,
    });

    return meetups;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const meetups = await db.meetups.findOne({ where }, { transaction });

    if (!meetups) {
      return meetups;
    }

    const output = meetups.get({ plain: true });

    output.user = await meetups.getUser({
      transaction,
    });

    output.products = await meetups.getProducts({
      transaction,
    });

    output.nodes = await meetups.getNodes({
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
        model: db.users,
        as: 'user',
        through: filter.user
          ? {
              where: {
                [Op.or]: filter.user.split('|').map((item) => {
                  return { ['Id']: Utils.uuid(item) };
                }),
              },
            }
          : null,
        required: filter.user ? true : null,
      },

      {
        model: db.products,
        as: 'products',
        through: filter.products
          ? {
              where: {
                [Op.or]: filter.products.split('|').map((item) => {
                  return { ['Id']: Utils.uuid(item) };
                }),
              },
            }
          : null,
        required: filter.products ? true : null,
      },

      {
        model: db.nodes,
        as: 'nodes',
        through: filter.nodes
          ? {
              where: {
                [Op.or]: filter.nodes.split('|').map((item) => {
                  return { ['Id']: Utils.uuid(item) };
                }),
              },
            }
          : null,
        required: filter.nodes ? true : null,
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
          [Op.and]: Utils.ilike('meetups', 'name', filter.name),
        };
      }

      if (filter.location) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('meetups', 'location', filter.location),
        };
      }

      if (filter.lat) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('meetups', 'lat', filter.lat),
        };
      }

      if (filter.long) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('meetups', 'long', filter.long),
        };
      }

      if (filter.hasNode) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('meetups', 'hasNode', filter.hasNode),
        };
      }

      if (filter.website) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('meetups', 'website', filter.website),
        };
      }

      if (filter.city) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('meetups', 'city', filter.city),
        };
      }

      if (filter.link1) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('meetups', 'link1', filter.link1),
        };
      }

      if (filter.link2) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('meetups', 'link2', filter.link2),
        };
      }

      if (filter.link3) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('meetups', 'link3', filter.link3),
        };
      }

      if (filter.link4) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('meetups', 'link4', filter.link4),
        };
      }

      if (filter.typeRange) {
        const [start, end] = filter.typeRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            type: {
              ...where.type,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            type: {
              ...where.type,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.categoryRange) {
        const [start, end] = filter.categoryRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            category: {
              ...where.category,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            category: {
              ...where.category,
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

    let { rows, count } = await db.meetups.findAndCountAll({
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
          Utils.ilike('meetups', 'id', query),
        ],
      };
    }

    const records = await db.meetups.findAll({
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
