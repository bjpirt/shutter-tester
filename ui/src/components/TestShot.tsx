import { convertSpeedToFloat } from "../lib/utils";
import Message, {
  SinglePointMessage,
  ThreePointMessage
} from "../types/Message";
import { ViewMode } from "../types/ViewMode";

type Props = {
  onClick: (message: Message) => void;
  selectedSpeed: string;
  mode: ViewMode;
};

const randomInt = (range: number): number => Math.floor(Math.random() * range);

const generateThreePointTestData = (speed: string): ThreePointMessage => {
  const speedMicros = convertSpeedToFloat(speed) * 1000000;
  const randomDiff = speedMicros * 0.25;
  const sensor1Close = speedMicros + randomInt(randomDiff);
  const sensor2Open = sensor1Close + randomInt(randomDiff);
  const sensor2Close = sensor2Open + speedMicros + randomInt(randomDiff);
  const sensor3Open = sensor2Close + randomInt(randomDiff);
  const sensor3Close = sensor3Open + speedMicros + randomInt(randomDiff);
  return {
    type: "three_point",
    sensor1: { open: 1, close: sensor1Close },
    sensor2: { open: sensor2Open, close: sensor2Close },
    sensor3: { open: sensor3Open, close: sensor3Close },
  };
};
const generateSinglePointTestData = (speed: string): SinglePointMessage => {
  const speedMicros = convertSpeedToFloat(speed) * 1000000;
  const randomDiff = speedMicros * 0.25;
  return {
    type: "single_point",
    sensor2: speedMicros + randomInt(randomDiff),
  };
};

export default function TestShot({ onClick, selectedSpeed, mode }: Props) {
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (mode === ViewMode.THREE_POINT) {
      onClick(generateThreePointTestData(selectedSpeed));
    } else if (mode === ViewMode.SINGLE_POINT) {
      onClick(generateSinglePointTestData(selectedSpeed));
    }
  };

  return (
    <button onClick={handleClick} className="action">
      Test
    </button>
  );
}
