interface ConnectionInterface {
    id: number;
    timestamp: number;
}

export function ConnectionService(connectionRepository: any) {
  async function getConnections() {
    const connections = await connectionRepository.getConnections();
    return connections.filter((connection: ConnectionInterface) => {
      const now = new Date().getTime();
      return now - connection.timestamp < 10000;
    });
  }

  async function newConnection() {
    return await connectionRepository.newConnection();
  }

  async function updateConnection(id: number) {
    await connectionRepository.updateConnection(id);
  }

  return {
    getConnections,
    newConnection,
    updateConnection,
  };
}
