import { Server } from "socket.io";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: [process.env.FRONTEND_URL, "http://localhost:3000"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {

    socket.on("join_service_room", (serviceId) => {
      socket.join(serviceId);
    });

    socket.on("leave_service_room", (serviceId) => {
      socket.leave(serviceId);
      console.log(`Socket ${socket.id} left room: ${serviceId}`);
    });

    socket.on("join_org_room", (orgId) => {
      socket.join(orgId);
    });

    socket.on("leave_org_room", (orgId) => {
      socket.leave(orgId);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
