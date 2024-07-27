export default () => {
  const secret = process.env.JWT_KEY;
  return secret;
};
