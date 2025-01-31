import EventEmitter from "events";

var deviceName = "ShutterTester";
var bleService = "42de79f1-7248-4c9b-9279-96509b8a9f5c";
var sensorCharacteristic = "42de79f1-7248-4c9b-9279-96509b8a9f5c";

class Bluetooth extends EventEmitter {
  bleServer?: BluetoothRemoteGATTServer;

  connect() {
    if (!this.isWebBluetoothEnabled()) {
      return;
    }

    navigator.bluetooth
      .requestDevice({
        filters: [{ name: deviceName }],
        optionalServices: [bleService],
      })
      .then((device) => {
        console.log("Device Selected:", device.name);
        device.addEventListener(
          "gattservicedisconnected",
          this.onDisconnected.bind(this)
        );
        return device.gatt?.connect();
      })
      .then((gattServer) => {
        this.bleServer = gattServer;
        console.log("Connected to GATT Server");
        return this.bleServer?.getPrimaryService(bleService);
      })
      .then((service) => {
        console.log("Service discovered:", service?.uuid);
        return service?.getCharacteristic(sensorCharacteristic);
      })
      .then((characteristic) => {
        console.log("Characteristic discovered:", characteristic?.uuid);
        characteristic?.addEventListener(
          "characteristicvaluechanged",
          this.handleCharacteristicChange.bind(this)
        );
        characteristic?.startNotifications();
        console.log("Notifications Started.");
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  }

  private onDisconnected(event: any) {
    console.log("Device Disconnected:", event.target.device.name);

    this.connect();
  }

  private isWebBluetoothEnabled() {
    if (!navigator.bluetooth) {
      console.log("Web Bluetooth API is not available in this browser!");
      alert("Web Bluetooth is not enabled - please use Chrome");
      return false;
    }
    console.log("Web Bluetooth API supported in this browser.");
    return true;
  }

  private handleCharacteristicChange(event: any) {
    const newValueReceived = new TextDecoder().decode(event.target.value);
    this.emit("newMeasurement", JSON.parse(newValueReceived));
  }
}

export default Bluetooth;
