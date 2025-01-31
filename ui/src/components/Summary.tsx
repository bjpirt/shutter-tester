import Measurement from "../types/Measurement";
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
  return (
    <table className="summary">
      <thead>
        <tr>
          <th></th>
          <th>Speed</th>
          <th>Measurements</th>
          <th>Sensor 1</th>
          <th>Sensor 2</th>
          <th>Sensor 3</th>
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
