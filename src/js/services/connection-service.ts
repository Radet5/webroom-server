export interface ConnectionRepositoryInterface {
  getConnections: () => Promise<Array<Connection>>;
  newConnection: () => Promise<string>;
  updateConnection: (id: string) => Promise<boolean>;
}

export interface Connection {
  id: string;
  timestamp: number;
}

export function ConnectionService(
  connectionRepository: ConnectionRepositoryInterface
) {
  async function getConnections() {
    const connections = await connectionRepository.getConnections();
    return connections.filter((connection: Connection) => {
      const now = new Date().getTime();
      return now - connection.timestamp < 10000;
    });
  }

  async function newConnection() {
    return await connectionRepository.newConnection();
  }

  async function updateConnection(id: string) {
    if (await connectionRepository.updateConnection(id)) {
      return true;
    } else {
      return false;
    }
  }

  return {
    getConnections,
    newConnection,
    updateConnection,
  };
}
