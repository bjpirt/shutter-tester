import { useContext } from "react";
import { Context } from "./SettingsContext";
import { Mode } from "../types/Message";

export default function ModeControl() {
  const { settings, setSettings } = useContext(Context);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings({ ...settings, mode: event.target.value as Mode });
  };

  return (
    <div className="control">
      <label htmlFor="mode">Mode: </label>
      <select name="mode" onChange={handleChange} value={settings.mode}>
        <option value="three_point">Three Point</option>
        <option value="single_point">Single Point</option>
      </select>
    </div>
  );
}
