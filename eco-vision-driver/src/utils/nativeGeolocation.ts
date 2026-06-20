import { Geolocation } from "@capacitor/geolocation";

export const getNativeLocation = async () => {
  const permission = await Geolocation.checkPermissions();

  if (permission.location !== "granted") {
    await Geolocation.requestPermissions();
  }

  return await Geolocation.getCurrentPosition({
    enableHighAccuracy: true,
  });
};
