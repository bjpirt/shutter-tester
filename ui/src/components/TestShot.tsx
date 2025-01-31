import { convertSpeedToFloat } from "../lib/utils";
import Measurement from "../types/Measurement";

type Props = {
  onClick: (measurements: Measurement) => void;
  selectedSpeed: string;
};

const randomInt = (range: number): number => Math.floor(Math.random() * range);

const generateTestData = (speed: string) => {
  const speedMicros = convertSpeedToFloat(speed) * 1000000;
  const randomDiff = speedMicros * 0.25;
  const sensor1Close = speedMicros + randomInt(randomDiff);
  const sensor2Open = 4000 + randomInt(randomDiff);
  const sensor2Close = sensor2Open + speedMicros + randomInt(randomDiff);
  const sensor3Open = 8000 + randomInt(randomDiff);
  const sensor3Close = sensor3Open + speedMicros + randomInt(randomDiff);
  return {
    sensor1: { open: 0, close: sensor1Close },
    sensor2: { open: sensor2Open, close: sensor2Close },
    sensor3: { open: sensor3Open, close: sensor3Close },
  };
};

export default function TestShot({ onClick, selectedSpeed }: Props) {
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    onClick(generateTestData(selectedSpeed));
  };

  return <button onClick={handleClick}>Test</button>;
}
