import { useContext, useEffect, useState } from "react";
import messageHandler from "../lib/MessageHandler";
import {
  Measurement,
  ThreePointMeasurement,
  threePointMeasurementSchema,
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
    console.log(selectedSpeed)
    const newMeasurements = structuredClone(measurements);
    if (!Array.isArray(newMeasurements[selectedSpeed])) {
      newMeasurements[selectedSpeed] = [];
    }
    newMeasurements[selectedSpeed].push(measurement);
    setMeasurements(newMeasurements);
    setSettings({ ...settings, mode: ViewMode.THREE_POINT });
  };

  useEffect(() => {
    const handleNewMeasurement = (measurement: Measurement) => {
      const parsedMeasurement =
        threePointMeasurementSchema.safeParse(measurement);
      if (selectedSpeed === null || parsedMeasurement.error) {
        return;
      }
      addMeasurement(parsedMeasurement.data);
    };

    messageHandler.on("ThreePointMeasurement", handleNewMeasurement);

    return () => {
      messageHandler.off("ThreePointMeasurement", handleNewMeasurement);
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
