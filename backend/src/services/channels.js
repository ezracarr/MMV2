const db = require('../db/models');
const ChannelsDBApi = require('../db/api/channels');

module.exports = class ChannelsService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      await ChannelsDBApi.create(data, {
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
      let channels = await ChannelsDBApi.findBy({ id }, { transaction });

      if (!channels) {
        throw new ValidationError('channelsNotFound');
      }

      await ChannelsDBApi.update(id, data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
      return channels;
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

      await ChannelsDBApi.remove(id, {
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
