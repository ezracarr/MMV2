module.exports = {
  /**
   * @param {QueryInterface} queryInterface
   * @param {Sequelize} Sequelize
   * @returns {Promise<void>}
   */
  async up(queryInterface, Sequelize) {
    /**
     * @type {Transaction}
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('channels', { transaction });

      await queryInterface.addColumn(
        'users',
        'alias',
        {
          type: Sequelize.DataTypes.TEXT,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'users',
        'type',
        {
          type: Sequelize.DataTypes.INTEGER,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'users',
        'category',
        {
          type: Sequelize.DataTypes.INTEGER,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'meetups',
        'type',
        {
          type: Sequelize.DataTypes.INTEGER,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'meetups',
        'category',
        {
          type: Sequelize.DataTypes.INTEGER,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'meetups',
        'website',
        {
          type: Sequelize.DataTypes.TEXT,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'meetups',
        'city',
        {
          type: Sequelize.DataTypes.TEXT,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'meetups',
        'link1',
        {
          type: Sequelize.DataTypes.TEXT,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'meetups',
        'link2',
        {
          type: Sequelize.DataTypes.TEXT,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'meetups',
        'link3',
        {
          type: Sequelize.DataTypes.TEXT,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'meetups',
        'link4',
        {
          type: Sequelize.DataTypes.TEXT,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'nodes',
        'api_endpoint',
        {
          type: Sequelize.DataTypes.TEXT,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'nodes',
        'type',
        {
          type: Sequelize.DataTypes.INTEGER,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'nodes',
        'MeetupId',
        {
          type: Sequelize.DataTypes.UUID,

          references: {
            model: 'meetups',
            key: 'id',
          },
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'nodes',
        'node_name',
        {
          type: Sequelize.DataTypes.TEXT,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'nodes',
        'node_id',
        {
          type: Sequelize.DataTypes.TEXT,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'payments',
        'amount',
        {
          type: Sequelize.DataTypes.INTEGER,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'payments',
        'amount_sats',
        {
          type: Sequelize.DataTypes.INTEGER,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'payments',
        'meetup_fromId',
        {
          type: Sequelize.DataTypes.UUID,

          references: {
            model: 'meetups',
            key: 'id',
          },
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'events',
        'location',
        {
          type: Sequelize.DataTypes.TEXT,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'events',
        'lat',
        {
          type: Sequelize.DataTypes.TEXT,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'events',
        'lng',
        {
          type: Sequelize.DataTypes.TEXT,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'events',
        'city',
        {
          type: Sequelize.DataTypes.TEXT,
        },
        { transaction },
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  /**
   * @param {QueryInterface} queryInterface
   * @param {Sequelize} Sequelize
   * @returns {Promise<void>}
   */
  async down(queryInterface, Sequelize) {
    /**
     * @type {Transaction}
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('events', 'city', { transaction });

      await queryInterface.removeColumn('events', 'lng', { transaction });

      await queryInterface.removeColumn('events', 'lat', { transaction });

      await queryInterface.removeColumn('events', 'location', { transaction });

      await queryInterface.removeColumn('payments', 'meetup_fromId', {
        transaction,
      });

      await queryInterface.removeColumn('payments', 'amount_sats', {
        transaction,
      });

      await queryInterface.removeColumn('payments', 'amount', { transaction });

      await queryInterface.removeColumn('nodes', 'node_id', { transaction });

      await queryInterface.removeColumn('nodes', 'node_name', { transaction });

      await queryInterface.removeColumn('nodes', 'MeetupId', { transaction });

      await queryInterface.removeColumn('nodes', 'type', { transaction });

      await queryInterface.removeColumn('nodes', 'api_endpoint', {
        transaction,
      });

      await queryInterface.removeColumn('meetups', 'link4', { transaction });

      await queryInterface.removeColumn('meetups', 'link3', { transaction });

      await queryInterface.removeColumn('meetups', 'link2', { transaction });

      await queryInterface.removeColumn('meetups', 'link1', { transaction });

      await queryInterface.removeColumn('meetups', 'city', { transaction });

      await queryInterface.removeColumn('meetups', 'website', { transaction });

      await queryInterface.removeColumn('meetups', 'category', { transaction });

      await queryInterface.removeColumn('meetups', 'type', { transaction });

      await queryInterface.removeColumn('users', 'category', { transaction });

      await queryInterface.removeColumn('users', 'type', { transaction });

      await queryInterface.removeColumn('users', 'alias', { transaction });

      await queryInterface.createTable(
        'channels',
        {
          id: {
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.DataTypes.UUIDV4,
            primaryKey: true,
          },
          createdById: {
            type: Sequelize.DataTypes.UUID,
            references: {
              key: 'id',
              model: 'users',
            },
          },
          updatedById: {
            type: Sequelize.DataTypes.UUID,
            references: {
              key: 'id',
              model: 'users',
            },
          },
          createdAt: { type: Sequelize.DataTypes.DATE },
          updatedAt: { type: Sequelize.DataTypes.DATE },
          deletedAt: { type: Sequelize.DataTypes.DATE },
          importHash: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true,
            unique: true,
          },
        },
        { transaction },
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
