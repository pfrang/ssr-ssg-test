/* eslint-disable @typescript-eslint/no-explicit-any */
import next from "next";
import { NextServer } from "next/dist/server/next";
import express, { Request, Response } from "express";

const dev = process.env.NODE_ENV !== "production";
const port = Number(process.env.PORT) || 3000;
const hostname = "localhost";

const nextServer = next({ dev, hostname, port }) as NextServer;
const nextHandler = nextServer.getRequestHandler();

(async () => {
  console.log(`AppConfig validates env variables...`);
  console.log(`NODE_ENV = ${process.env.NODE_ENV}`);

  try {
    await nextServer.prepare();
    const server = express();

    server.all("*", (req: Request, res: Response) => {
      return nextHandler(req, res);
    });

    server.listen(port, (err?: any) => {
      if (err) throw err;
      console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
