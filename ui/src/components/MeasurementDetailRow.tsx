import { useContext } from "react";
import {
  convertSpeedToFloat,
  displayInterval,
  displaySpeed,
} from "../lib/utils";
import Measurement from "../types/Measurement";
import { SettingsContext } from "./Settings";
import Conditional from "./Conditional";

type Props = {
  measurement: Measurement;
  selectedSpeed: string;
};

export default function MeasurementDetailRow({
  measurement,
  selectedSpeed,
}: Props) {
  const { settings } = useContext(SettingsContext);

  const speedUs = convertSpeedToFloat(selectedSpeed) * 1000000;

  return (
    <tr>
      <Conditional display={settings.sensorData.display}>
        <td>
          {displaySpeed(
            settings.sensorData,
            measurement.sensor1.close - measurement.sensor1.open,
            speedUs
          )}
        </td>
        <td>
          {displaySpeed(
            settings.sensorData,
            measurement.sensor2.close - measurement.sensor2.open,
            speedUs
          )}
        </td>
        <td>
          {displaySpeed(
            settings.sensorData,
            measurement.sensor3.close - measurement.sensor3.open,
            speedUs
          )}
        </td>
      </Conditional>
      <Conditional display={settings.shutterData.display}>
        <td>
          {displayInterval(measurement.sensor2.open, measurement.sensor1.open)}
        </td>
        <td>
          {displayInterval(measurement.sensor3.open, measurement.sensor2.open)}
        </td>
        <td>
          {displayInterval(
            measurement.sensor2.close,
            measurement.sensor1.close
          )}
        </td>
        <td>
          {displayInterval(
            measurement.sensor3.close,
            measurement.sensor2.close
          )}
        </td>
      </Conditional>
    </tr>
  );
}
