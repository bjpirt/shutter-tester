import { useContext } from "react";
import Conditional from "./Conditional";
import { Context } from "./SettingsContext";
import ThreePointSummaryRow from "./ThreePointSummaryRow";
import ThreePointDetailRow from "./ThreePointDetailRow";
import { ThreePointMeasurement } from "../types/Measurement";

type Props = {
  speeds: string[];
  selectedSpeed: null | string;
  onRemoveSpeed: (speed: string) => void;
  onSelectSpeed: (speed: string) => void;
  measurements: Record<string, ThreePointMeasurement[]>;
  onRemoveMeasurement: (
    speed: string,
    measurement: ThreePointMeasurement
  ) => void;
};

export default function ThreePointMeasurements({
  speeds,
  onRemoveSpeed,
  selectedSpeed,
  onRemoveMeasurement,
  onSelectSpeed,
  measurements,
}: Props) {
  const { settings } = useContext(Context);

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
            <th>Shutter 1 (1 - 3)</th>
            <th>Shutter 2 (1 - 2)</th>
            <th>Shutter 2 (2 - 3)</th>
            <th>Shutter 2 (1 - 3)</th>
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
                onSelect={onSelectSpeed}
                onRemove={onRemoveSpeed}
                measurements={selectedMeasurements}
              />

              {selected
                ? selectedMeasurements?.map((m) => (
                    <ThreePointDetailRow
                      measurement={m}
                      selectedSpeed={speed}
                      onRemove={() => onRemoveMeasurement(speed, m)}
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
