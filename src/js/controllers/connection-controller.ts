import type { Request, Response } from "express";
import * as connectionRepository from "../repositories/connection-repository";
import { ConnectionService } from "../services/connection-service";

const service = ConnectionService(connectionRepository);

async function getConnections(req: Request, res: Response) {
  const data = { connections: await service.getConnections() };
  res.json(data);
}

async function newConnection(req: Request, res: Response) {
  const data = {
    id: await service.newConnection(),
    connections: await service.getConnections(),
  };
  res.json(data);
}

async function poll(req: Request, res: Response) {
  const id = req.body.id;
  await service.updateConnection(id);
  const data = {
    connections: await service.getConnections(),
  };
  res.json(data);
}

export { getConnections, newConnection, poll };
