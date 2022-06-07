const db = require('../db/models');
const NodesDBApi = require('../db/api/nodes');

module.exports = class NodesService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      await NodesDBApi.create(data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  static async update(data, id, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      let nodes = await NodesDBApi.findBy({ id }, { transaction });

      if (!nodes) {
        throw new ValidationError('nodesNotFound');
      }

      await NodesDBApi.update(id, data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
      return nodes;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async remove(id, currentUser) {
    const transaction = await db.sequelize.transaction();

    try {
      if (currentUser.role !== 'admin') {
        throw new ValidationError('errors.forbidden.message');
      }

      await NodesDBApi.remove(id, {
        currentUser,
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
