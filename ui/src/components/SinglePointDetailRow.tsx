import { useContext } from "react";
import { convertSpeedToFloat, displaySpeed } from "../lib/utils";
import { Context } from "./SettingsContext";

type Props = {
  measurement: number;
  selectedSpeed: string;
  onRemove: (speed: string, measurement: number) => void;
};

export default function ThreePointDetailRow({
  measurement,
  selectedSpeed,
  onRemove,
}: Props) {
  const { settings } = useContext(Context);

  const speedUs = convertSpeedToFloat(selectedSpeed) * 1000000;

  return (
    <tr className="measurement-detail">
      <td></td>
      <td></td>
      <td></td>

      <td>{displaySpeed(settings.sensorData, measurement, speedUs)}</td>

      <td
        onClick={() => onRemove(selectedSpeed, measurement)}
        className="remove"
      >
        ❌
      </td>
    </tr>
  );
}
