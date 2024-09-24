function getSmth() {
  const dbOrigin = process.env.DB_ORIGIN;
  const dbName = process.env.DB_NAME;
  const dbUser = process.env.DB_USERNAME;
  const dbPassword = process.env.DB_PASSWORD;
  const dbHref = dbUser && dbPassword
    ? `${dbUser}:${dbPassword}@${dbOrigin}/${dbName}?authSource=admin`
    : `${dbOrigin}/${dbName}`;

  const domain = process.env.DOMAIN;
  const protocol = process.env.PROTOCOL;
  const clientSubDomain = process.env.CLIENT_SUB_DOMAIN;
  const serverSubDomain = process.env.SERVER_SUB_DOMAIN;
  const serverPort = process.env.SERVER_PORT;
  const clientPort = process.env.CLIENT_PORT;
  const jwtSecret = process.env.JWT_SECRET;

  const clientHost = clientSubDomain + domain + (clientPort ? ':' + clientPort : '');
  const serverHost = serverSubDomain + domain;

  return {
    dbHref,
    clientOrigin: protocol + '//' + clientHost,
    serverOrigin: protocol + '//' + serverHost,
    clientHost,
    serverHost,
    domain,
    clientSubDomain,
    serverSubDomain,
    serverPort,
    clientPort,
    jwtSecret,
  }
}

module.exports = getSmth;
