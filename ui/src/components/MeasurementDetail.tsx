import Measurement from "../types/Measurement";
import MeasurementDetailRow from "./MeasurementDetailRow";

type Props = {
  measurements?: Measurement[];
};

export default function MeasurementDetail({ measurements }: Props) {
  return (
    <table className="measurements">
      <thead>
        <tr>
          <th>Sensor 1</th>
          <th>Sensor 2</th>
          <th>Sensor 3</th>
        </tr>
      </thead>
      <tbody>
        {measurements
          ? measurements.map((measurement, i) => (
              <MeasurementDetailRow
                measurement={measurement}
                key={`meas-${i}`}
              />
            ))
          : undefined}
      </tbody>
    </table>
  );
}
