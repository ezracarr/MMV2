module.exports = {
  production: {
    dialect: 'mysql',
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    timestamps: false,
    dialectOptions: {
      socketPath: process.env.DB_HOST,
    },
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    logging: console.log,
    seederStorage: 'sequelize',
  },
  development: {
    username: 'root',
    dialect: 'mysql',
    password: '',
    database: 'db_meetupmarket',
    host: process.env.DEV_DB_HOST || 'localhost',
    logging: console.log,
    seederStorage: 'sequelize',
  },
};
