//later this will be used to connect to the database
// but for now just stub data

const connections = [
  {
    id: 1,
    timestamp: new Date().getTime(),
  },
];

export async function getConnections() {
  return connections;
}

export async function newConnection() {
  const length = connections.length;
  const id = 1 + length;
  connections.push({ id, timestamp: new Date().getTime() });
  return id;
}

export async function updateConnection(id: number) {
  const connection = connections.find((connection) => connection.id === id);
  if (connection) {
    connection.timestamp = new Date().getTime();
  }
}
