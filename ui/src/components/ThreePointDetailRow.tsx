import { useContext } from "react";
import getSensorSeparation from "../lib/getSensorSeparation";
import processThreePointMeasurement from "../lib/processThreePointMeasurement";
import {
  convertSpeedToFloat,
  displayInterval,
  displaySpeed,
} from "../lib/utils";
import { ThreePointMeasurement } from "../types/Measurement";
import Conditional from "./Conditional";
import { Context } from "./SettingsContext";

type Props = {
  measurement: ThreePointMeasurement;
  selectedSpeed: string;
  onRemove: (speed: string, measurement: ThreePointMeasurement) => void;
};

export default function ThreePointDetailRow({
  measurement,
  selectedSpeed,
  onRemove,
}: Props) {
  const { settings } = useContext(Context);

  const speedUs = convertSpeedToFloat(selectedSpeed) * 1000000;
  const sensorSeparation = getSensorSeparation(settings.shutterDirection)

  const processedMeasurement = processThreePointMeasurement(measurement, settings.compensation, sensorSeparation);

  return (
    <tr className="measurement-detail">
      <Conditional display={settings.sensorData.display}>
        <td></td>
        <td></td>
        <td></td>
        <td>
          {displaySpeed(
            settings.sensorData,
            processedMeasurement.sensor1,
            speedUs
          )}
        </td>
        <td>
          {displaySpeed(
            settings.sensorData,
            processedMeasurement.sensor2,
            speedUs
          )}
        </td>
        <td>
          {displaySpeed(
            settings.sensorData,
            processedMeasurement.sensor3,
            speedUs
          )}
        </td>
      </Conditional>
      <Conditional display={settings.shutterData.display}>
        <td>{displayInterval(processedMeasurement.shutter1.side1)}</td>
        <td>{displayInterval(processedMeasurement.shutter1.side2)}</td>
        <td>{displayInterval(processedMeasurement.shutter2.side1)}</td>
        <td>{displayInterval(processedMeasurement.shutter2.side2)}</td>
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
