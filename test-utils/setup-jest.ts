import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";

const devOrTestEnviroment = process.env.NODE_ENV !== "production";
if (devOrTestEnviroment) {
  console.log("load messages");
  // Adds messages only in a dev and test environment
  loadDevMessages();
  loadErrorMessages();
}
