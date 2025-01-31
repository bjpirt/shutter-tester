import { displaySpeed } from "../lib/utils";
import Measurement from "../types/Measurement";

type Props = {
  measurement: Measurement;
};

export default function MeasurementDetailRow({ measurement }: Props) {
  return (
    <tr>
      <td>
        {displaySpeed(measurement.sensor1.close - measurement.sensor1.open)}
      </td>
      <td>
        {displaySpeed(measurement.sensor2.close - measurement.sensor2.open)}
      </td>
      <td>
        {displaySpeed(measurement.sensor3.close - measurement.sensor3.open)}
      </td>
    </tr>
  );
}
