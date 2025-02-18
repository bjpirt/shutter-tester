import { useContext } from "react";
import { Settings, SettingsContext } from "./Settings";

export default function SensorControls() {
  const { settings, setSettings } = useContext(SettingsContext);

  const handleClick = (event: any) => {
    const target = event.target.name;
    if (target in settings.shutterData) {
      const oldValue =
        settings.shutterData[target as keyof Settings["shutterData"]];
      setSettings({
        ...settings,
        shutterData: {
          ...settings.shutterData,
          [target]: !oldValue,
        },
      });
    }
  };

  return (
    <div className="control">
      <input
        type="checkbox"
        name="display"
        checked={settings.shutterData.display}
        onChange={handleClick}
      ></input>
      <label htmlFor="display">Shutter Data</label>
    </div>
  );
}
