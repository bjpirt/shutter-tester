import { useContext } from "react";
import {
  convertSpeedToFloat,
  displaySpeed,
  microsToMillis,
} from "../lib/utils";
import Conditional from "./Conditional";
import { Context } from "./SettingsContext";
import { SensorMeasurement, ThreePointMeasurement } from "../types/Measurement";

type Props = {
  speed: string;
  selected: boolean;
  onSelect: (speed: string) => void;
  onRemove: (speed: string) => void;
  measurements?: ThreePointMeasurement[];
};

type ShutterTiming = { "1-2": number; "2-3": number };

type MeasurementSummary = {
  sensor1?: number;
  sensor2?: number;
  sensor3?: number;
  shutter1Timing?: ShutterTiming;
  shutter2Timing?: ShutterTiming;
};

const average = (input: number[]): number =>
  input.reduce((sum, currentValue) => sum + currentValue, 0) / input.length;

const averageSensorTimings = (
  measurements: ThreePointMeasurement[],
  sensor: keyof ThreePointMeasurement
): number => {
  const allIntervals = measurements.map(
    (measurement) => measurement[sensor].close - measurement[sensor].open
  );
  return allIntervals.length > 0 ? average(allIntervals) : 0;
};

type ShutterType = keyof SensorMeasurement;

const averageShutterTimings = (
  measurements: ThreePointMeasurement[],
  shutter: ShutterType
): ShutterTiming => {
  const timings1 = measurements.map((m) =>
    Math.abs(m.sensor2[shutter] - m.sensor1[shutter])
  );
  const timings2 = measurements.map((m) =>
    Math.abs(m.sensor3[shutter] - m.sensor2[shutter])
  );
  return { "1-2": average(timings1), "2-3": average(timings2) };
};

const summariseMeasurements = (
  measurements?: ThreePointMeasurement[]
): MeasurementSummary => {
  if (!measurements) {
    return {};
  }
  return {
    sensor1: averageSensorTimings(measurements, "sensor1"),
    sensor2: averageSensorTimings(measurements, "sensor2"),
    sensor3: averageSensorTimings(measurements, "sensor3"),
    shutter1Timing: averageShutterTimings(measurements, "open"),
    shutter2Timing: averageShutterTimings(measurements, "close"),
  };
};

export default function ThreePointSummaryRow({
  speed,
  selected,
  onSelect,
  onRemove,
  measurements,
}: Props) {
  const summary = summariseMeasurements(measurements);
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
        <Conditional display={settings.sensorData.display}>
          <td>{displaySpeed(settings.sensorData, summary.sensor1, speedUs)}</td>
          <td>{displaySpeed(settings.sensorData, summary.sensor2, speedUs)}</td>
          <td>{displaySpeed(settings.sensorData, summary.sensor3, speedUs)}</td>
        </Conditional>
        <Conditional display={settings.shutterData.display}>
          <td>{microsToMillis(summary.shutter1Timing?.["1-2"], "ms")}</td>
          <td>{microsToMillis(summary.shutter1Timing?.["2-3"], "ms")}</td>
          <td>
            {microsToMillis(
              (summary.shutter1Timing?.["1-2"] ?? 0) +
                (summary.shutter1Timing?.["2-3"] ?? 0),
              "ms"
            )}
          </td>
          <td>{microsToMillis(summary.shutter2Timing?.["1-2"], "ms")}</td>
          <td>{microsToMillis(summary.shutter2Timing?.["2-3"], "ms")}</td>
          <td>
            {microsToMillis(
              (summary.shutter2Timing?.["1-2"] ?? 0) +
                (summary.shutter2Timing?.["2-3"] ?? 0),
              "ms"
            )}
          </td>
        </Conditional>
        <td onClick={() => onRemove(speed)} className="remove">
          ❌
        </td>
      </tr>
    </>
  );
}
