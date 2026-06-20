import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.ecovision.driver",
  appName: "EcoVision Driver",
  webDir: "dist",

  server: {
    url: "http://192.168.1.4:5174",
    cleartext: true
  }
};

export default config;
