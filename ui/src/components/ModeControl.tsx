import { useContext } from "react";
import { ViewMode } from "../types/ViewMode";
import { Context } from "./SettingsContext";

type Props = {
  onChange: (mode: ViewMode) => void;
};

export default function ModeControl({ onChange }: Props) {
  const { settings, setSettings } = useContext(Context);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMode = event.target.value as ViewMode;
    setSettings({ ...settings, mode: newMode });
    onChange(newMode);
  };

  return (
    <div className="control">
      <label htmlFor="mode">Mode: </label>
      <select name="mode" onChange={handleChange} value={settings.mode}>
        <option value="shot_by_shot">Shot by Shot</option>
        <option value="shutter_timing">Shutter Timing</option>
        <option value="three_point">Three Point</option>
        <option value="single_point">Single Point</option>
      </select>
    </div>
  );
}
