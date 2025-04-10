import { useContext } from "react";
import ShutterDirection from "../types/ShutterDirection";
import { Context } from "./SettingsContext";

export default function DirectionControl() {
  const { settings, setSettings } = useContext(Context);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newDirection = event.target.value as unknown as ShutterDirection;
    setSettings({ ...settings, shutterDirection: newDirection });
  };

  return (
    <div className="control">
      <label htmlFor="direction">Shutter: </label>
      <select name="direction" onChange={handleChange} value={settings.shutterDirection}>
        <option value="auto">Auto</option>
        <option value="horizontal">Horizontal</option>
        <option value="vertical">Vertical</option>
      </select>
    </div>
  );
}
