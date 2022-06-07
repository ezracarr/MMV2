const db = require('../db/models');
const MeetupsDBApi = require('../db/api/meetups');

module.exports = class MeetupsService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      await MeetupsDBApi.create(data, {
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
      let meetups = await MeetupsDBApi.findBy({ id }, { transaction });

      if (!meetups) {
        throw new ValidationError('meetupsNotFound');
      }

      await MeetupsDBApi.update(id, data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
      return meetups;
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

      await MeetupsDBApi.remove(id, {
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
