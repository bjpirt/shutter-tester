import { useContext, useEffect, useState } from "react";
import getSensorSeparation from "../lib/getSensorSeparation";
import messageHandler from "../lib/internalMessageBus";
import processThreePointMeasurement from "../lib/processThreePointMeasurement";
import { displayInterval, displaySpeed } from "../lib/utils";
import { InternalMessage, InternalMessageType } from "../types/InternalMessage";
import { ThreePointMeasurement } from "../types/Measurement";
import CompensationControls from "./CompensationControls";
import Conditional from "./Conditional";
import SensorControls from "./SensorControls";
import { Context } from "./SettingsContext";
import ShutterControls from "./ShutterControls";

export default function ShotByShotView() {
  const { settings } = useContext(Context);
  const [measurements, setMeasurements] = useState<ThreePointMeasurement[]>([]);
  const sensorSeparation = getSensorSeparation(settings.shutterDirection)

  const removeMeasurement = (index: number) => {
    setMeasurements(measurements.filter((_, i) => i !== index));
  };

  const addMeasurement = (measurement: ThreePointMeasurement) => {
    setMeasurements([measurement, ...measurements]);
  };

  useEffect(() => {
    const handleNewMeasurement = (message: InternalMessage) => {
      if (message.type !== InternalMessageType.ThreePointMeasurement) {
        return;
      }
      addMeasurement(message.data);
    };

    const handleReset = (message: InternalMessage) => {
      if (message.type !== InternalMessageType.Reset) {
        return;
      }
      setMeasurements([]);
    };

    messageHandler.on(
      InternalMessageType.ThreePointMeasurement,
      handleNewMeasurement
    );
    messageHandler.on(InternalMessageType.Reset, handleReset);

    return () => {
      messageHandler.off(
        InternalMessageType.ThreePointMeasurement,
        handleNewMeasurement
      );
      messageHandler.off(InternalMessageType.Reset, handleReset);
    };
  }, [measurements]);

  return (
    <>
      <div id="controls">
        <SensorControls />
        <ShutterControls />
        <CompensationControls />
      </div>
      <table className="summary">
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
              <th>Shutter 1 (1 - 3)</th>
              <th>Shutter 2 (1 - 2)</th>
              <th>Shutter 2 (2 - 3)</th>
              <th>Shutter 2 (1 - 3)</th>
            </Conditional>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {measurements.map((m, index) => {
            const processedMeasurement = processThreePointMeasurement(m, true, sensorSeparation);
            return (
              <tr className="measurement-detail">
                <Conditional display={settings.sensorData.display}>
                  <td>
                    {displaySpeed(
                      settings.sensorData,
                      processedMeasurement.sensor1
                    )}
                  </td>
                  <td>
                    {displaySpeed(
                      settings.sensorData,
                      processedMeasurement.sensor2
                    )}
                  </td>
                  <td>
                    {displaySpeed(
                      settings.sensorData,
                      processedMeasurement.sensor3
                    )}
                  </td>
                </Conditional>
                <Conditional display={settings.shutterData.display}>
                  <td>
                    {displayInterval(processedMeasurement.shutter1.side1)}
                  </td>
                  <td>
                    {displayInterval(processedMeasurement.shutter1.side2)}
                  </td>
                  <td>
                    {displayInterval(
                      processedMeasurement.shutter1.side1 +
                        processedMeasurement.shutter1.side2
                    )}
                  </td>
                  <td>
                    {displayInterval(processedMeasurement.shutter2.side1)}
                  </td>
                  <td>
                    {displayInterval(processedMeasurement.shutter2.side2)}
                  </td>
                  <td>
                    {displayInterval(
                      processedMeasurement.shutter2.side1 +
                        processedMeasurement.shutter2.side2
                    )}
                  </td>
                </Conditional>
                <td onClick={() => removeMeasurement(index)} className="remove">
                  ❌
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
