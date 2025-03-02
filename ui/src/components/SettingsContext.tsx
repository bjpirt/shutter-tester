import { createContext, useState } from "react";

export type SensorSettings = {
  milliseconds: boolean;
  seconds: boolean;
  exposure: boolean;
};

export type Settings = {
  sensorData: SensorSettings & {
    display: boolean;
  };
  shutterData: {
    display: boolean;
  };
};

const defaultSettings: Settings = {
  sensorData: {
    display: true,
    milliseconds: false,
    seconds: true,
    exposure: true,
  },
  shutterData: {
    display: true,
  },
};

export const Context = createContext({
  settings: defaultSettings,
  setSettings: (_: Settings) => {},
});

export default function SettingsContext({ children }: React.PropsWithChildren) {
  const [settings, setSettings] = useState(defaultSettings);
  const settingsContext = { settings, setSettings };

  return (
    <Context.Provider value={settingsContext}>
      {children}
    </Context.Provider>
  );
}
