import { useContext } from "react";
import Measurement from "../types/Measurement";
import MeasurementDetailRow from "./MeasurementDetailRow";
import { SettingsContext } from "./Settings";
import Conditional from "./Conditional";

type Props = {
  measurements?: Measurement[];
  selectedSpeed: string;
};

export default function MeasurementDetail({
  measurements,
  selectedSpeed,
}: Props) {
  const { settings } = useContext(SettingsContext);

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
        </tr>
      </thead>
      <tbody>
        {measurements
          ? measurements.map((measurement, i) => (
              <MeasurementDetailRow
                measurement={measurement}
                selectedSpeed={selectedSpeed}
                key={`meas-${i}`}
              />
            ))
          : undefined}
      </tbody>
    </table>
  );
}
