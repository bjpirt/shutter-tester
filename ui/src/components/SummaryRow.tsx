import { displaySpeed } from "../lib/utils";
import Measurement from "../types/Measurement";

type Props = {
  speed: string;
  selected: boolean;
  onSelect: (speed: string) => void;
  onRemove: (speed: string) => void;
  measurements?: Measurement[];
};

type MeasurementSummary = {
  sensor1?: number;
  sensor2?: number;
  sensor3?: number;
};

const averageSensorTimings = (
  measurements: Measurement[],
  sensor: keyof Measurement
): number => {
  const allIntervals = measurements.map(
    (measurement) => measurement[sensor].close - measurement[sensor].open
  );
  return allIntervals.length > 0
    ? allIntervals.reduce((sum, currentValue) => sum + currentValue, 0) /
        allIntervals.length
    : 0;
};

const summariseMeasurements = (
  measurements?: Measurement[]
): MeasurementSummary => {
  if (!measurements) {
    return {};
  }
  return {
    sensor1: averageSensorTimings(measurements, "sensor1"),
    sensor2: averageSensorTimings(measurements, "sensor2"),
    sensor3: averageSensorTimings(measurements, "sensor3"),
  };
};

export default function SummaryRow({
  speed,
  selected,
  onSelect,
  onRemove,
  measurements,
}: Props) {
  const summary = summariseMeasurements(measurements);

  return (
    <tr
      onClick={() => onSelect(speed)}
      className={selected ? "selected" : undefined}
    >
      <td>
        <input type="checkbox" checked={selected} />
      </td>
      <td>{speed} s</td>
      <td>{measurements?.length}</td>
      <td>{displaySpeed(summary.sensor1)}</td>
      <td>{displaySpeed(summary.sensor2)}</td>
      <td>{displaySpeed(summary.sensor3)}</td>
      <td onClick={() => onRemove(speed)} className="remove">
        ❌
      </td>
    </tr>
  );
}
