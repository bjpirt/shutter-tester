import { useContext } from "react";
import averageThreePointMeasurements from "../lib/averageThreePointMeasurements";
import getSensorSeparation from "../lib/getSensorSeparation";
import {
  convertSpeedToFloat,
  displaySpeed,
  microsToMillis,
} from "../lib/utils";
import { ThreePointMeasurement } from "../types/Measurement";
import Conditional from "./Conditional";
import { Context } from "./SettingsContext";

type Props = {
  speed: string;
  selected: boolean;
  onSelect: (speed: string) => void;
  onRemove: (speed: string) => void;
  measurements?: ThreePointMeasurement[];
};

export default function ThreePointSummaryRow({
  speed,
  selected,
  onSelect,
  onRemove,
  measurements,
}: Props) {
  const { settings } = useContext(Context);
  const sensorSeparation = getSensorSeparation(settings.shutterDirection)

  const averageMeasurements = averageThreePointMeasurements(measurements ?? [], settings.compensation, sensorSeparation)

  const speedUs = convertSpeedToFloat(speed) * 1000000;

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
        <Conditional display={settings.sensorData.display}>
          <td>{displaySpeed(settings.sensorData, averageMeasurements?.sensor1, speedUs)}</td>
          <td>{displaySpeed(settings.sensorData, averageMeasurements?.sensor2, speedUs)}</td>
          <td>{displaySpeed(settings.sensorData, averageMeasurements?.sensor3, speedUs)}</td>
        </Conditional>
        <Conditional display={settings.shutterData.display}>
          <td>{microsToMillis(averageMeasurements?.shutter1.side1, "ms")}</td>
          <td>{microsToMillis(averageMeasurements?.shutter1.side2, "ms")}</td>
          <td>{microsToMillis(averageMeasurements?.shutter2.side1, "ms")}</td>
          <td>{microsToMillis(averageMeasurements?.shutter2.side2, "ms")}</td>
        </Conditional>
        <td onClick={() => onRemove(speed)} className="remove">
          ❌
        </td>
      </tr>
    </>
  );
}
