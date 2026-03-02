import { NextApiRequest, NextApiResponse } from 'next';
import { Server as NetServer } from 'http';
import { Server as IOServer } from 'socket.io';
import dbConnect from '../../lib/dbConnect';
import { Message } from '../../models/Message';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sock: any = res.socket;
  if (!sock.server?.io) {
    console.log('Initializing Socket.io server');
    const httpServer: NetServer = sock.server as NetServer;
    const io = new IOServer(httpServer, {
      path: '/api/socket',
      cors: {
        origin: '*',
      },
    });
    sock.server.io = io;

    io.on('connection', (socket) => {
      console.log('New connection', socket.id);

      socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
      });

      socket.on('leaveRoom', (roomId) => {
        socket.leave(roomId);
      });

      socket.on('message', async (payload) => {
        const { roomId, content, sender } = payload;
        // persist then broadcast saved document so timestamp is included
        try {
          await dbConnect();
          const msg = await new Message({ room: roomId, sender, content }).save();
          io.to(roomId).emit('message', msg);
        } catch (err) {
          console.error('Failed to save message', err);
          // still broadcast payload without createdAt
          io.to(roomId).emit('message', payload);
        }
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected', socket.id);
      });
    });
  }
  res.end();
}
