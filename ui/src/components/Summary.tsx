import { useContext } from "react";
import Measurement from "../types/Measurement";
import Conditional from "./Conditional";
import { Context } from "./SettingsContext";
import SummaryRow from "./SummaryRow";

type Props = {
  speeds: string[];
  selectedSpeed: null | string;
  onRemoveSpeed: (speed: string) => void;
  onSelectSpeed: (speed: string) => void;
  measurements: Record<string, Measurement[]>;
};

export default function Summary({
  speeds,
  onRemoveSpeed,
  selectedSpeed,
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
            <th>Shutter 2 (1 - 2)</th>
            <th>Shutter 2 (2 - 3)</th>
          </Conditional>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {speeds.map((speed) => (
          <SummaryRow
            key={speed}
            speed={speed}
            selected={speed === selectedSpeed}
            onSelect={onSelectSpeed}
            onRemove={onRemoveSpeed}
            measurements={measurements[speed ?? ""]}
          />
        ))}
      </tbody>
    </table>
  );
}
