import { Preferences } from "@capacitor/preferences";

export const saveAuth = async (token: string, user: any) => {
  await Preferences.set({
    key: "auth",
    value: JSON.stringify({ token, user }),
  });
};

export const loadAuth = async () => {
  const { value } = await Preferences.get({ key: "auth" });
  return value ? JSON.parse(value) : null;
};

export const clearAuth = async () => {
  await Preferences.remove({ key: "auth" });
};
