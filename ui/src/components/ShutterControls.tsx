import { useContext } from "react";
import { Context, Settings } from "./SettingsContext";

export default function SensorControls() {
  const { settings, setSettings } = useContext(Context);

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
      <label htmlFor="display">Shutter Timing</label>
    </div>
  );
}
