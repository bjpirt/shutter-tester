import { useEffect, useState } from "react";
import messageHandler from "../lib/internalMessageBus";
import { InternalMessage, InternalMessageType } from "../types/InternalMessage";
import { SinglePointMeasurement } from "../types/Measurement";
import SinglePointDetailRow from "./SinglePointDetailRow";
import SinglePointSummaryRow from "./SinglePointSummaryRow";

type Props = {
  speeds: string[];
  onRemoveSpeed: (speed: string) => void;
};

export default function SinglePointMeasurements({
  speeds,
  onRemoveSpeed,
}: Props) {
  const [selectedSpeed, setSelectedSpeed] = useState<string>(speeds[0]);

  const [measurements, setMeasurements] = useState<Record<string, number[]>>(
    {}
  );

  const selectSpeed = (speed: string) => {
    messageHandler.emit({ type: InternalMessageType.SelectSpeed, data: speed });
    setSelectedSpeed(speed);
  };

  const removeMeasurement = (speed: string, index: number) => {
    setMeasurements({
      ...measurements,
      [speed]: measurements[speed].filter((_, i) => i !== index),
    });
  };

  const addMeasurement = (measurement: SinglePointMeasurement) => {
    setMeasurements({
      ...measurements,
      [selectedSpeed]: [
        measurement.sensor2,
        ...(measurements[selectedSpeed] ?? []),
      ],
    });
  };

  useEffect(() => {
    const handleNewMeasurement = (message: InternalMessage) => {
      if (
        selectedSpeed === null ||
        message.type !== InternalMessageType.SinglePointMeasurement
      ) {
        return;
      }
      addMeasurement(message.data);
    };

    const handleReset = (message: InternalMessage) => {
      if (message.type !== InternalMessageType.Reset) {
        return;
      }
      setMeasurements({});
    };

    messageHandler.on(
      InternalMessageType.SinglePointMeasurement,
      handleNewMeasurement
    );
    messageHandler.on(InternalMessageType.Reset, handleReset);

    return () => {
      messageHandler.off(
        InternalMessageType.SinglePointMeasurement,
        handleNewMeasurement
      );
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
                onSelect={selectSpeed}
                onRemove={onRemoveSpeed}
                measurements={selectedMeasurements}
              />

              {selected
                ? selectedMeasurements?.map((m, index) => (
                    <SinglePointDetailRow
                      measurement={m}
                      selectedSpeed={speed}
                      onRemove={() => removeMeasurement(speed, index)}
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
