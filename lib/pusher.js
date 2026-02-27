import PusherServer from "pusher";
import PusherClient from "pusher-js";

// Backend tarafı (Sipariş geldiğinde tetiklemek için)
export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

// Frontend tarafı (Admin panelinde dinlemek için)
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY, 
  {
    cluster: process.env.PUSHER_CLUSTER,
  }
);