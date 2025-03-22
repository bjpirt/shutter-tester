import { useContext, useEffect, useState } from "react";
import messageHandler from "../lib/internalMessageBus";
import { InternalMessage, InternalMessageType } from "../types/InternalMessage";
import {
  ThreePointMeasurement
} from "../types/Measurement";
import { ViewMode } from "../types/ViewMode";
import Conditional from "./Conditional";
import { Context } from "./SettingsContext";
import ThreePointDetailRow from "./ThreePointDetailRow";
import ThreePointSummaryRow from "./ThreePointSummaryRow";

type Props = {
  speeds: string[];
  onRemoveSpeed: (speed: string) => void;
};

export default function ThreePointMeasurements({
  speeds,
  onRemoveSpeed,
}: Props) {
  const [selectedSpeed, setSelectedSpeed] = useState<string>(speeds[0]);
  const { settings, setSettings } = useContext(Context);

  const [measurements, setMeasurements] = useState<
    Record<string, ThreePointMeasurement[]>
  >({});

  const selectSpeed = (speed: string) => {
    messageHandler.emit({type: InternalMessageType.SelectSpeed, data: speed})
    setSelectedSpeed(speed);
  };

  const removeMeasurement = (
    speed: string,
    measurement: ThreePointMeasurement
  ) => {
    setMeasurements({
      ...measurements,
      [speed]: measurements[speed].filter((m) => m != measurement),
    });
  };

  const addMeasurement = (measurement: ThreePointMeasurement) => {
    const newMeasurements = structuredClone(measurements);
    if (!Array.isArray(newMeasurements[selectedSpeed])) {
      newMeasurements[selectedSpeed] = [];
    }
    newMeasurements[selectedSpeed].push(measurement);
    setMeasurements(newMeasurements);
    setSettings({ ...settings, mode: ViewMode.THREE_POINT });
  };

  useEffect(() => {
    const handleNewMeasurement = (message: InternalMessage) => {
      if(selectedSpeed === null || message.type !== InternalMessageType.ThreePointMeasurement){
        return
      }
      addMeasurement(message.data);
    };

    const handleReset = (message: InternalMessage) => {
      if(message.type !== InternalMessageType.Reset){
        return
      }
      setMeasurements({});
    }

    messageHandler.on(InternalMessageType.ThreePointMeasurement, handleNewMeasurement);
    messageHandler.on(InternalMessageType.Reset, handleReset);

    return () => {
      messageHandler.off(InternalMessageType.ThreePointMeasurement, handleNewMeasurement);
      messageHandler.off(InternalMessageType.Reset, handleReset);
    };
  }, [selectedSpeed, measurements]);

  return (
    <table className="summary">
      <thead>
        <tr>
          <th></th>
          <th>Speed</th>
          <th>Measurements</th>
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
        {speeds.map((speed) => {
          const selected = speed === selectedSpeed;
          const selectedMeasurements = measurements[speed ?? ""];

          return (
            <>
              <ThreePointSummaryRow
                key={speed}
                speed={speed}
                selected={selected}
                onSelect={selectSpeed}
                onRemove={onRemoveSpeed}
                measurements={selectedMeasurements}
              />

              {selected
                ? selectedMeasurements?.map((m) => (
                    <ThreePointDetailRow
                      measurement={m}
                      selectedSpeed={speed}
                      onRemove={() => removeMeasurement(speed, m)}
                    />
                  ))
                : undefined}
            </>
          );
        })}
      </tbody>
    </table>
  );
}
