var deviceName = "ShutterTester";
var bleService = "42de79f1-7248-4c9b-9279-96509b8a9f5c";
var sensorCharacteristic = "42de79f1-7248-4c9b-9279-96509b8a9f5c";

function Bluetooth({ setDevice, setCharacteristic, setServer, setService }) {
  const connectToDevice = async () => {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: "Device Name" }, { services: [bleService] }],
    });
    setDevice(device);
    const server = await device.gatt.connect();
    setServer(server);
    const service = await server.getPrimaryService("bleService");
    setService(service);
    const characteristic = await service.getCharacteristic("Characteristic ID");
    setCharacteristic(characteristic);
    device.addEventListener("gattserverdisconnected", onDisconnected);
  };

  const onDisconnected = (event) => {
    alert("Vibrator Disconnected");
    const device = "";
    setDevice(device);
  };

  return (
    <>
      <button className="bluetooth" onClick={connectToDevice}>
        CONNECT
      </button>
    </>
  );
}

export default Bluetooth;
