import { useContext } from "react";
import Conditional from "./Conditional";
import { Context } from "./SettingsContext";
import SinglePointSummaryRow from "./SinglePointSummaryRow";
import SinglePointDetailRow from "./SinglePointDetailRow";

type Props = {
  speeds: string[];
  selectedSpeed: null | string;
  onRemoveSpeed: (speed: string) => void;
  onSelectSpeed: (speed: string) => void;
  measurements: Record<string, number[]>;
  onRemoveMeasurement: (speed: string, measurement: number) => void;
};

export default function SinglePointMeasurements({
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
          <th>Speed</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {speeds.map((speed) => {
          const selected = speed === selectedSpeed;
          const selectedMeasurements = measurements[speed ?? ""];

          return (
            <>
              <SinglePointSummaryRow
                key={speed}
                speed={speed}
                selected={selected}
                onSelect={onSelectSpeed}
                onRemove={onRemoveSpeed}
                measurements={selectedMeasurements}
              />

              {selected
                ? selectedMeasurements?.map((m) => (
                    <SinglePointDetailRow
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
