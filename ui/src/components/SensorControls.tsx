import { useContext } from "react";
import { Context, Settings } from "./SettingsContext";

export default function SensorControls() {
  const { settings, setSettings } = useContext(Context);

  const handleClick = (event: any) => {
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
      <label htmlFor="display">Sensor Data</label>
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
      <input
        type="checkbox"
        name="exposure"
        checked={settings.sensorData.exposure}
        onChange={handleClick}
      ></input>
      <label htmlFor="exposure">EV</label>
    </div>
  );
}
