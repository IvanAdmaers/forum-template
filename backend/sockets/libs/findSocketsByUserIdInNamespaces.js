const findSocketByUserId = async (io, namespace = '', userId = '') => {
  const sockets = await io.of(namespace).fetchSockets();

  const socket = sockets.find(({ request }) => request.userId === userId);

  return socket;
};

const findSocketsByUserIdInNamespaces = async (
  io,
  namespaces = [],
  userId = ''
) => {
  const sockets = [];
  const promises = [];

  namespaces.forEach((namespace) =>
    promises.push(findSocketByUserId(io, namespace, userId))
  );

  const results = await Promise.all(promises);

  results.forEach((userSocket) => {
    if (!userSocket) return;

    sockets.push(userSocket);
  });

  return sockets;
};

module.exports = findSocketsByUserIdInNamespaces;
