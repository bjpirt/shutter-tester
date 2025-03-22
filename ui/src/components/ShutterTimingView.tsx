import { useEffect, useState } from "react";
import messageHandler from "../lib/internalMessageBus";
import processThreePointMeasurement from "../lib/processThreePointMeasurement";
import { displayInterval } from "../lib/utils";
import { InternalMessage, InternalMessageType } from "../types/InternalMessage";
import { ProcessedThreePointMeasurement, ThreePointMeasurement } from "../types/Measurement";



export default function ShutterTimingView() {
  

  const [measurements, setMeasurements] = useState<
    ProcessedThreePointMeasurement[]
  >([]);

  const removeMeasurement = (index: number) => {
    setMeasurements(measurements.filter((_, i) => i !== index));
  };

  const addMeasurement = (measurement: ThreePointMeasurement) => {
    setMeasurements([
      processThreePointMeasurement(measurement),
      ...measurements,
    ]);
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
      <table className="summary">
        <thead>
          <tr>
            <th>Shutter 1 (1 - 2)</th>
            <th>Shutter 1 (2 - 3)</th>
            <th>Shutter 1 (1 - 3)</th>
            <th>Shutter 2 (1 - 2)</th>
            <th>Shutter 2 (2 - 3)</th>
            <th>Shutter 2 (1 - 3)</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {measurements.map((m, index) => (
            <tr>
              <td>{displayInterval(m.shutter1.side1)}</td>
              <td>{displayInterval(m.shutter1.side2)}</td>
              <td>{displayInterval(m.shutter1.side1 + m.shutter1.side2)}</td>
              <td>{displayInterval(m.shutter2.side1)}</td>
              <td>{displayInterval(m.shutter2.side2)}</td>
              <td>{displayInterval(m.shutter2.side1 + m.shutter2.side2)}</td>
              <td
                onClick={() => removeMeasurement(index)}
                className="remove"
              >
                ❌
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
