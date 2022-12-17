module.exports = ({ env }) => ({
  auth: {
    secret: env("ADMIN_JWT_SECRET", "7087fcbc4177daf3b5dc3601bdc89206"),
  },
  apiToken: {
    salt: env("API_TOKEN_SALT"),
  },
});
