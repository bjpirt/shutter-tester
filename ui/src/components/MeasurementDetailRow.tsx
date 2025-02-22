import { useContext } from "react";
import {
  convertSpeedToFloat,
  displayInterval,
  displaySpeed,
} from "../lib/utils";
import Measurement from "../types/Measurement";
import Conditional from "./Conditional";
import { Context } from "./SettingsContext";

type Props = {
  measurement: Measurement;
  selectedSpeed: string;
  onRemove: (speed: string, measurement: Measurement) => void;
};

export default function MeasurementDetailRow({
  measurement,
  selectedSpeed,
  onRemove,
}: Props) {
  const { settings } = useContext(Context);

  const speedUs = convertSpeedToFloat(selectedSpeed) * 1000000;

  return (
    <tr className="measurement-detail">
      <Conditional display={settings.sensorData.display}>
        <td></td>
        <td></td>
        <td></td>
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
      <td
        onClick={() => onRemove(selectedSpeed, measurement)}
        className="remove"
      >
        ❌
      </td>
    </tr>
  );
}
