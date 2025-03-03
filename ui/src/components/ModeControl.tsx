import { useContext } from "react";
import { Context } from "./SettingsContext";
import { Mode } from "../types/Message";

type Props = {
  onChange: (mode: Mode) => Promise<void>;
};

export default function ModeControl({ onChange }: Props) {
  const { settings, setSettings } = useContext(Context);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMode = event.target.value as Mode;
    setSettings({ ...settings, mode: newMode });
    onChange(newMode);
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
