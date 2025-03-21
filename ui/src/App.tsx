import { useContext, useState } from "react";
import "./App.css";
import AddSpeed from "./components/AddSpeed";
import CompensationControls from "./components/CompensationControls";
import Conditional from "./components/Conditional";
import Connect from "./components/Connect";
import ModeControl from "./components/ModeControl";
import SensorControls from "./components/SensorControls";
import { Context } from "./components/SettingsContext";
import ShutterControls from "./components/ShutterControls";
import SinglePointMeasurements from "./components/SinglePointMeasurements";
import TestShot from "./components/TestShot";
import ThreePointMeasurements from "./components/ThreePointMeasurements";
import { defaultSpeeds } from "./lib/defaults";
import { useBluetooth } from "./lib/useBluetooth";
import { formatSpeed, sortSpeeds } from "./lib/utils";
import { ThreePointMeasurement } from "./types/Measurement";
import Message, {
  MetadataMessage,
  Mode,
  SinglePointMessage,
  ThreePointMessage,
} from "./types/Message";

const isDemo = (): boolean =>
  new URLSearchParams(window.location.search).get("demo") === "true";

function App() {
  const { settings, setSettings } = useContext(Context);
  const [speeds, setSpeeds] = useState(defaultSpeeds);
  const [selectedSpeed, setSelectedSpeed] = useState<string>(speeds[0]);

  const [threePointMeasurements, setThreePointMeasurements] = useState<
    Record<string, ThreePointMeasurement[]>
  >({});

  const [singlePointMeasurements, setSinglePointMeasurements] = useState<
    Record<string, number[]>
  >({});

  const removeSpeed = (speed: string) => {
    setSpeeds(speeds.filter((existingSpeed) => existingSpeed !== speed));
  };

  const addSpeed = (speed: string) => {
    setSpeeds([...speeds, formatSpeed(speed)].sort(sortSpeeds));
  };

  const reset = () => {
    setThreePointMeasurements({});
    setSinglePointMeasurements({});
  };

  const selectSpeed = (speed: string) => {
    setSelectedSpeed(speed);
  };

  const removeSinglePointMeasurement = (
    speed: string,
    measurement: number
  ) => {};

  const removeThreePointMeasurement = (
    speed: string,
    measurement: ThreePointMeasurement
  ) => {
    setThreePointMeasurements({
      ...threePointMeasurements,
      [speed]: threePointMeasurements[speed].filter((m) => m != measurement),
    });
  };

  const handleMetadataMessage = (message: MetadataMessage) => {};

  const handleSinglePointMessage = ({ sensor2 }: SinglePointMessage) => {
    const newMeasurements = structuredClone(singlePointMeasurements);
    if (!Array.isArray(newMeasurements[selectedSpeed])) {
      newMeasurements[selectedSpeed] = [];
    }
    newMeasurements[selectedSpeed].push(sensor2);
    setSinglePointMeasurements(newMeasurements);
    setSettings({ ...settings, mode: Mode.SINGLE_POINT });
  };

  const handleThreePointMessage = ({
    type,
    ...measurement
  }: ThreePointMessage) => {
    const newMeasurements = structuredClone(threePointMeasurements);
    if (!Array.isArray(newMeasurements[selectedSpeed])) {
      newMeasurements[selectedSpeed] = [];
    }
    newMeasurements[selectedSpeed].push(measurement);
    setThreePointMeasurements(newMeasurements);
    setSettings({ ...settings, mode: Mode.THREE_POINT });
  };

  const handleMessage = (message: Message) => {
    console.log(message);
    if (message.type === "metadata") {
      handleMetadataMessage(message);
    } else if (message.type === "single_point") {
      handleSinglePointMessage(message);
    } else {
      handleThreePointMessage(message);
    }
  };

  const { setMode, subscribe, isConnected } = useBluetooth(handleMessage);

  const subscribeBluetooth = () => {
    subscribe();
  };

  return (
    <>
      <header>
        <div className="connect">
          {isDemo() ? (
            <TestShot
              onClick={handleMessage}
              selectedSpeed={selectedSpeed}
              mode={settings.mode}
            />
          ) : (
            <Connect onClick={subscribeBluetooth} isConnected={isConnected} />
          )}
        </div>
        <h1>
          <span className="icon">📷</span> Shutter Tester
        </h1>
      </header>
      <div id="controls">
        <ModeControl onChange={setMode} />
        <AddSpeed onAddSpeed={addSpeed} />
        <SensorControls />
        <ShutterControls />
        <CompensationControls />
        <button onClick={reset}>Reset data</button>
      </div>
      <Conditional display={settings.mode === Mode.THREE_POINT}>
        <ThreePointMeasurements
          speeds={speeds}
          onRemoveSpeed={removeSpeed}
          selectedSpeed={selectedSpeed}
          onSelectSpeed={selectSpeed}
          measurements={threePointMeasurements}
          onRemoveMeasurement={removeThreePointMeasurement}
        />
      </Conditional>
      <Conditional display={settings.mode === Mode.SINGLE_POINT}>
        <SinglePointMeasurements
          speeds={speeds}
          onRemoveSpeed={removeSpeed}
          selectedSpeed={selectedSpeed}
          onSelectSpeed={selectSpeed}
          measurements={singlePointMeasurements}
          onRemoveMeasurement={removeSinglePointMeasurement}
        />
      </Conditional>
    </>
  );
}

export default App;
