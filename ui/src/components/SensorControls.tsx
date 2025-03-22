import { useContext } from "react";
import { Context, Settings } from "./SettingsContext";
import Conditional from "./Conditional";
import { ViewMode } from "../types/ViewMode";

export default function SensorControls() {
  const { settings, setSettings } = useContext(Context);

  const handleClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target.name;
    if (target in settings.sensorData) {
      const oldValue =
        settings.sensorData[target as keyof Settings["sensorData"]];
      setSettings({
        ...settings,
        sensorData: {
          ...settings.sensorData,
          [target]: !oldValue,
        },
      });
    }

    console.log(target);
  };

  return (
    <div className="control">
      <input
        type="checkbox"
        name="display"
        checked={settings.sensorData.display}
        onChange={handleClick}
      ></input>
      <label htmlFor="display">Sensor Timing</label>
      <input
        type="checkbox"
        name="milliseconds"
        checked={settings.sensorData.milliseconds}
        onChange={handleClick}
      ></input>
      <label htmlFor="milliseconds">ms</label>
      <input
        type="checkbox"
        name="seconds"
        checked={settings.sensorData.seconds}
        onChange={handleClick}
      ></input>
      <label htmlFor="seconds">1/X s</label>
      <Conditional display={settings.mode !== ViewMode.SHOT_BY_SHOT}>
        <input
          type="checkbox"
          name="exposure"
          checked={settings.sensorData.exposure}
          onChange={handleClick}
        ></input>
        <label htmlFor="exposure">EV</label>
      </Conditional>
    </div>
  );
}
