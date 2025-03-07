import { useContext } from "react";
import { Context } from "./SettingsContext";

export default function CompensationControls() {
  const { settings, setSettings } = useContext(Context);

  const handleClick = (event: React.ChangeEvent<HTMLInputElement >) => {
    setSettings({
      ...settings,
      compensation: event.target.checked
    });
  };

  return (
    <div className="control">
      <input
        type="checkbox"
        name="compensation"
        checked={settings.compensation}
        onChange={handleClick}
      ></input>
      <label htmlFor="compensation">Compensation</label>
    </div>
  );
}
