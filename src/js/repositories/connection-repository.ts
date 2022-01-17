import type { Connection } from "../services/connection-service";
import { v4 } from "uuid";
//later this will be used to connect to the database
// but for now just stub data

const connections: Array<Connection> = [];

export async function getConnections() {
  return connections;
}

export async function newConnection() {
  const id = v4();
  connections.push({ id, timestamp: new Date().getTime() });
  return id;
}

export async function updateConnection(id: string) {
  const connection = connections.find((connection) => connection.id === id);
  if (connection) {
    connection.timestamp = new Date().getTime();
    return true;
  } else {
    return false;
  }
}
