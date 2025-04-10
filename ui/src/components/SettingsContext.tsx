import { createContext, useState } from "react";
import ShutterDirection from "../types/ShutterDirection";
import { ViewMode } from "../types/ViewMode";

export type SensorSettings = {
  milliseconds: boolean;
  seconds: boolean;
  exposure: boolean;
};

export type Settings = {
  compensation: boolean;
  mode: ViewMode;
  sensorData: SensorSettings & {
    display: boolean;
  };
  shutterData: {
    display: boolean;
  };
  shutterDirection: ShutterDirection;
};

const defaultSettings: Settings = {
  compensation: true,
  mode: ViewMode.THREE_POINT,
  sensorData: {
    display: true,
    milliseconds: false,
    seconds: true,
    exposure: true,
  },
  shutterData: {
    display: false,
  },
  shutterDirection: ShutterDirection.Auto
};

export const Context = createContext({
  settings: defaultSettings,
  setSettings: (_: Settings) => {},
});

export default function SettingsContext({ children }: React.PropsWithChildren) {
  const [settings, setSettings] = useState(defaultSettings);
  const settingsContext = { settings, setSettings };

  return (
    <Context.Provider value={settingsContext}>{children}</Context.Provider>
  );
}
