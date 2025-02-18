import { useContext } from "react";
import Measurement from "../types/Measurement";
import Conditional from "./Conditional";
import MeasurementDetailRow from "./MeasurementDetailRow";
import { Context } from "./SettingsContext";

type Props = {
  measurements?: Measurement[];
  selectedSpeed: string;
  removeMeasurement: (speed: string, measurement: Measurement) => void
};

export default function MeasurementDetail({
  measurements,
  selectedSpeed,
  removeMeasurement
}: Props) {
  const { settings } = useContext(Context);

  return (
    <table className="measurements">
      <thead>
        <tr>
          <Conditional display={settings.sensorData.display}>
            <th>Sensor 1</th>
            <th>Sensor 2</th>
            <th>Sensor 3</th>
          </Conditional>
          <Conditional display={settings.shutterData.display}>
            <th>Shutter 1 (1 - 2)</th>
            <th>Shutter 1 (2 - 3)</th>
            <th>Shutter 2 (1 - 2)</th>
            <th>Shutter 2 (2 - 3)</th>
          </Conditional>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {measurements
          ? measurements.map((measurement, i) => (
              <MeasurementDetailRow
                measurement={measurement}
                selectedSpeed={selectedSpeed}
                key={`meas-${i}`}
                onRemove={removeMeasurement}
              />
            ))
          : undefined}
      </tbody>
    </table>
  );
}
