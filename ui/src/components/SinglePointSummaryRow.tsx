import { useContext } from "react";
import { convertSpeedToFloat, displaySpeed } from "../lib/utils";
import { Context } from "./SettingsContext";

type Props = {
  speed: string;
  selected: boolean;
  onSelect: (speed: string) => void;
  onRemove: (speed: string) => void;
  measurements?: number[];
};

const average = (input: number[]): number =>
  input.reduce((sum, currentValue) => sum + currentValue, 0) / input.length;

export default function ThreePointSummaryRow({
  speed,
  selected,
  onSelect,
  onRemove,
  measurements,
}: Props) {
  const speedUs = convertSpeedToFloat(speed) * 1000000;
  const { settings } = useContext(Context);

  return (
    <>
      <tr
        onClick={() => onSelect(speed)}
        className={selected ? "selected" : undefined}
      >
        <td>
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect(speed)}
          />
        </td>
        <td>{speed} s</td>
        <td>{measurements?.length}</td>
        <td>
          {displaySpeed(
            settings.sensorData,
            measurements !== undefined ? average(measurements) : undefined,
            speedUs
          )}
        </td>

        <td onClick={() => onRemove(speed)} className="remove">
          ❌
        </td>
      </tr>
    </>
  );
}
