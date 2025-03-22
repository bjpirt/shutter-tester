import { useContext, useEffect, useState } from "react";
import "./App.css";
import AddSpeed from "./components/AddSpeed";
import Conditional from "./components/Conditional";
import Connect from "./components/Connect";
import ModeControl from "./components/ModeControl";
import { Context } from "./components/SettingsContext";
import ShutterTimingView from "./components/ShutterTimingView";
import SinglePointMeasurements from "./components/SinglePointMeasurements";
import TestShot from "./components/TestShot";
import ThreePointMeasurements from "./components/ThreePointMeasurements";
import { defaultSpeeds } from "./lib/defaults";
import messageHandler from "./lib/internalMessageBus";
import { useBluetooth } from "./lib/useBluetooth";
import { formatSpeed, sortSpeeds } from "./lib/utils";
import { InternalMessage, InternalMessageType } from "./types/InternalMessage";
import {
  SinglePointMeasurement,
  ThreePointMeasurement,
} from "./types/Measurement";
import Message, { MetadataMessage, Mode } from "./types/Message";
import { ViewMode } from "./types/ViewMode";

const isDemo = (): boolean =>
  new URLSearchParams(window.location.search).get("demo") === "true";

function App() {
  const { settings } = useContext(Context);
  const [speeds, setSpeeds] = useState(defaultSpeeds);
  const [selectedSpeed, setSelectedSpeed] = useState(speeds[0]);

  const removeSpeed = (speed: string) => {
    setSpeeds(speeds.filter((existingSpeed) => existingSpeed !== speed));
  };

  const addSpeed = (speed: string) => {
    setSpeeds([...speeds, formatSpeed(speed)].sort(sortSpeeds));
  };

  const reset = () => {
    messageHandler.emit({ type: InternalMessageType.Reset });
  };

  const handleMetadataMessage = (message: MetadataMessage) => {};

  const handleMessage = ({ type, ...measurement }: Message) => {
    console.log({ type, ...measurement });
    if (type === "metadata") {
      handleMetadataMessage({ type, ...measurement } as MetadataMessage);
    } else if (type === "single_point") {
      messageHandler.emit({
        type: InternalMessageType.SinglePointMeasurement,
        data: measurement as SinglePointMeasurement,
      });
    } else {
      messageHandler.emit({
        type: InternalMessageType.ThreePointMeasurement,
        data: measurement as ThreePointMeasurement,
      });
    }
  };

  const { setDeviceMode, subscribe, isConnected } = useBluetooth(handleMessage);

  const setMode = (mode: ViewMode) => {
    if ([ViewMode.THREE_POINT, ViewMode.SHUTTER_TIMING].includes(mode)) {
      setDeviceMode(Mode.THREE_POINT);
    } else if (mode === ViewMode.SINGLE_POINT) {
      setDeviceMode(Mode.SINGLE_POINT);
    }
  };

  const subscribeBluetooth = () => {
    subscribe();
  };

  useEffect(() => {
    const handleSelectSpeed = (message: InternalMessage) => {
      if(message.type !== InternalMessageType.SelectSpeed){
        return
      }
      setSelectedSpeed(message.data);
    }

    messageHandler.on(InternalMessageType.SelectSpeed, handleSelectSpeed);

    return () => {
      messageHandler.off(InternalMessageType.SelectSpeed, handleSelectSpeed);
    };
  }, []);

  return (
    <>
      <header>
        <div className="connect">
          <ModeControl onChange={setMode} />
          <AddSpeed onAddSpeed={addSpeed} />
          <div className="control">
          <button onClick={reset}>Reset data</button>
          </div>
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
      <Conditional display={settings.mode === ViewMode.THREE_POINT}>
        <ThreePointMeasurements onRemoveSpeed={removeSpeed} speeds={speeds} />
      </Conditional>
      <Conditional display={settings.mode === ViewMode.SINGLE_POINT}>
        <SinglePointMeasurements onRemoveSpeed={removeSpeed} speeds={speeds} />
      </Conditional>
      <Conditional display={settings.mode === ViewMode.SHUTTER_TIMING}>
        <ShutterTimingView />
      </Conditional>
    </>
  );
}

export default App;
