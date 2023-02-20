import mongoose from "mongoose";
import TickersModel from "../models/Post.js";
import AlertsModel from "../models/Alerts.js";

export const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("subscribeDoc", ({ collection, id }) => {
      console.log(`subscribing to ${collection} ${id}`);

      const changeStream = TickersModel.watch({
        fullDocument: "updateLookup",
        pipeline: [{ $match: { _id: mongoose.Types.ObjectId(id) } }],
      });

      changeStream.on("change", (change) => {
        if (change.operationType === "update") {
          socket.emit("document", change.fullDocument);
        }
      });

      socket.on("unsubscribeDoc", ({ collection, id }) => {
        console.log(`unsubscribing from ${collection} ${id}`);

        changeStream.close();
      });
    });

    socket.on("subscribeCol", ({ collection }) => {
      console.log(`subscribing to ${collection}`);

      const changeStream = AlertsModel.watch();

      changeStream.on("change", (change) => {
        if (change.operationType === "insert") {
          socket.emit("collection", change.fullDocument);
        }
      });

      socket.on("unsubscribeCol", ({ collection }) => {
        console.log(`unsubscribing from ${collection}`);

        changeStream.close();
      });
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};
