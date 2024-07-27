export default () => {
  const db =
    process.env.NODE_ENV == 'development'
      ? process.env.LOCAL_MONGO_URL
      : process.env.MONGO_URL;
  return db;
};
