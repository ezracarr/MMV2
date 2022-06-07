const db = require('../db/models');
const EventsDBApi = require('../db/api/events');

module.exports = class EventsService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      await EventsDBApi.create(data, {
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
      let events = await EventsDBApi.findBy({ id }, { transaction });

      if (!events) {
        throw new ValidationError('eventsNotFound');
      }

      await EventsDBApi.update(id, data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
      return events;
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

      await EventsDBApi.remove(id, {
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
