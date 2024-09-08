function getSmth() {
  const dbOrigin = process.env.DB_ORIGIN;
  const dbName = process.env.DB_NAME;
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
    dbHref: dbOrigin + '/' + dbName,
    clientOrigin: protocol + '//' + clientHost,
    serverOrigin: protocol + '//' + serverHost,
    clientHost,
    serverHost,
    dbOrigin,
    dbName,
    domain,
    clientSubDomain,
    serverSubDomain,
    serverPort,
    clientPort,
    jwtSecret,
  }
}

module.exports = getSmth;
