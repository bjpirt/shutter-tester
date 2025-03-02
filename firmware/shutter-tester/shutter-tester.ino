#define LED 8
#define SENSOR_1 1
#define SENSOR_2 21
#define SENSOR_3 20

#define VERSION "2.2.0"

// #define TEST_BLUETOOTH

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

typedef enum {
  WAIT_FOR_OPEN,
  WAIT_FOR_CLOSE,
  DONE
} sensor_state;

typedef enum {
  THREE_POINT,
  SINGLE_POINT
} sensor_mode;

sensor_state sensor1_state = WAIT_FOR_OPEN;
sensor_state sensor2_state = WAIT_FOR_OPEN;
sensor_state sensor3_state = WAIT_FOR_OPEN;
long sensor1_open_time;
long sensor1_close_time;
long sensor2_open_time;
long sensor2_close_time;
long sensor3_open_time;
long sensor3_close_time;
sensor_mode mode = THREE_POINT;

BLEServer *pServer = NULL;
BLECharacteristic *pSensorCharacteristic = NULL;
BLECharacteristic *pModeCharacteristic = NULL;
bool deviceConnected = false;
bool oldDeviceConnected = false;
char message[128];
long i = 0;

#define SERVICE_UUID "42de79f1-7248-4c9b-9279-96509b8a9f5c"
#define SENSOR_CHARACTERISTIC_UUID "42de79f1-7248-4c9b-9279-96509b8a9f5d"
#define MODE_CHARACTERISTIC_UUID "42de79f1-7248-4c9b-9279-96509b8a9f5e"
#define DEVICE_NAME "ShutterTester"

class MyServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer *pServer) {
    deviceConnected = true;
  };

  void onDisconnect(BLEServer *pServer) {
    deviceConnected = false;
  }
};

class MyCharacteristicCallbacks : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *pModeCharacteristic) {
    String value = pModeCharacteristic->getValue();
    if (value.length() > 0) {
      Serial.print("Characteristic event, written: ");
      Serial.println(static_cast<int>(value[0]));  // Print the integer value
    }
  }
};

void IRAM_ATTR sensor1_isr() {
  if (!digitalRead(SENSOR_1)) {
    sensor1_open_time = micros();
    sensor1_state = WAIT_FOR_CLOSE;
  } else {
    sensor1_close_time = micros();
    sensor1_state = DONE;
  }
}

void IRAM_ATTR sensor2_isr() {
  if (!digitalRead(SENSOR_2)) {
    sensor2_open_time = micros();
    sensor2_state = WAIT_FOR_CLOSE;
  } else {
    sensor2_close_time = micros();
    sensor2_state = DONE;
  }
}

void IRAM_ATTR sensor3_isr() {
  if (!digitalRead(SENSOR_3)) {
    sensor3_open_time = micros();
    sensor3_state = WAIT_FOR_CLOSE;
  } else {
    sensor3_close_time = micros();
    sensor3_state = DONE;
  }
}

void print_shutter_timing(long t1, long t2, long t3) {
  long s1t1 = t2 - t1;
  long s1t2 = t3 - t2;
  Serial.print(" 1-2: ");
  Serial.print(s1t1);
  Serial.print(" uS || 2-3: ");
  Serial.print(s1t2);
  Serial.println(" uS");
}

void print_exposure_timing(long open_time, long close_time) {
  long interval = close_time - open_time;
  Serial.print(interval);
  Serial.print(" uS  ||  ");

  float milliseconds = interval / 1000.0;

  Serial.print(milliseconds);
  Serial.print(" mS  ||  ");

  float seconds = interval / 1000000.0;
  long inverse = 1 / seconds;

  Serial.print("1 / ");
  Serial.print(inverse);
  Serial.println(" S");
}

void print_three_point_summary(long s1_open_time,
                               long s1_close_time,
                               long s2_open_time,
                               long s2_close_time,
                               long s3_open_time,
                               long s3_close_time) {
  // Print shutter timings
  Serial.println("\r\nShutter timing");
  Serial.print("Shutter 1: ");
  print_shutter_timing(s1_open_time, s2_open_time, s3_open_time);

  Serial.print("Shutter 2: ");
  print_shutter_timing(s1_close_time, s2_close_time, s3_close_time);

  // Print sensor timings
  Serial.println("\r\nExposure timing");
  Serial.print("Sensor 1: ");
  print_exposure_timing(s1_open_time, s1_close_time);
  Serial.print("Sensor 2: ");
  print_exposure_timing(s2_open_time, s2_close_time);
  Serial.print("Sensor 3: ");
  print_exposure_timing(s3_open_time, s3_close_time);
}

void print_single_point_summary(long s2_open_time, long s2_close_time) {
  Serial.println("\r\nExposure timing");
  print_exposure_timing(s2_open_time, s2_close_time);
}

void setupBluetooth() {
  BLEDevice::init(DEVICE_NAME);

  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  // Create the BLE Service
  BLEService *pService = pServer->createService(SERVICE_UUID);

  // Create a BLE Characteristic
  pSensorCharacteristic = pService->createCharacteristic(
    SENSOR_CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_NOTIFY | BLECharacteristic::PROPERTY_INDICATE);

  // Create the mode Characteristic
  pModeCharacteristic = pService->createCharacteristic(
    MODE_CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_WRITE);

  pModeCharacteristic->setCallbacks(new MyCharacteristicCallbacks());

  // Create a BLE Descriptor
  pSensorCharacteristic->addDescriptor(new BLE2902());
  pModeCharacteristic->addDescriptor(new BLE2902());

  // Start the service
  pService->start();

  // Start advertising
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(false);
  pAdvertising->setMinPreferred(0x0);
  BLEDevice::startAdvertising();
}

void setup() {
  Serial.begin(115200);
  Serial.println("");
  Serial.println("Ready to measure");
  pinMode(LED, OUTPUT);
  pinMode(SENSOR_1, INPUT);
  pinMode(SENSOR_2, INPUT);
  pinMode(SENSOR_3, INPUT);
  attachInterrupt(SENSOR_1, sensor1_isr, CHANGE);
  attachInterrupt(SENSOR_2, sensor2_isr, CHANGE);
  attachInterrupt(SENSOR_3, sensor3_isr, CHANGE);

  setupBluetooth();
}

bool ready() {
  return (mode == THREE_POINT && sensor1_state == DONE && sensor2_state == DONE && sensor3_state == DONE) || (mode == SINGLE_POINT && sensor2_state == DONE);
}

void three_point_output() {
  if (sensor1_open_time < sensor3_open_time) {
    print_three_point_summary(sensor1_open_time,
                              sensor1_close_time,
                              sensor2_open_time,
                              sensor2_close_time,
                              sensor3_open_time,
                              sensor3_close_time);
  } else {
    print_three_point_summary(sensor3_open_time,
                              sensor3_close_time,
                              sensor2_open_time,
                              sensor2_close_time,
                              sensor1_open_time,
                              sensor1_close_time);
  }

  if (deviceConnected) {
    long minTime = min(sensor1_open_time, sensor3_open_time);
    sprintf(message, "{\"type\":\"three_point\",\"sensor1\":{\"open\":%ld,\"close\":%ld},\"sensor2\":{\"open\":%ld,\"close\":%ld},\"sensor3\":{\"open\":%ld,\"close\":%ld}}",
            sensor1_open_time - minTime,
            sensor1_close_time - minTime,
            sensor2_open_time - minTime,
            sensor2_close_time - minTime,
            sensor3_open_time - minTime,
            sensor3_close_time - minTime);

    pSensorCharacteristic->setValue(message);
    pSensorCharacteristic->notify();
  }
}

char* getMode() {
  if (mode == THREE_POINT) {
    return "three_point";
  } else if (mode == SINGLE_POINT) {
    return "single_point";
  }
}

void metadata_output() {
  if (deviceConnected) {
    long minTime = min(sensor1_open_time, sensor3_open_time);
    sprintf(message, "{\"type\":\"metadata\",\"mode\":\"%s\",\"version\":%s}", getMode(), VERSION);

    pSensorCharacteristic->setValue(message);
    pSensorCharacteristic->notify();
  }
}

void single_point_output() {
  print_single_point_summary(sensor2_open_time, sensor2_close_time);

  if (deviceConnected) {
    long minTime = min(sensor1_open_time, sensor3_open_time);
    sprintf(message, "{\"type\":\"single_point\",\"sensor2\":%ld}", sensor2_close_time - sensor2_open_time);

    pSensorCharacteristic->setValue(message);
    pSensorCharacteristic->notify();
  }
}

void loop() {
  if (sensor1_state == WAIT_FOR_CLOSE || sensor2_state == WAIT_FOR_CLOSE || sensor3_state == WAIT_FOR_CLOSE) {
    digitalWrite(LED, HIGH);
  }

  if (ready()) {
    digitalWrite(LED, LOW);

    sensor1_state = WAIT_FOR_OPEN;
    sensor2_state = WAIT_FOR_OPEN;
    sensor3_state = WAIT_FOR_OPEN;

    if (mode == THREE_POINT) {
      three_point_output();
    } else if (mode == SINGLE_POINT) {
      single_point_output();
    }
  }

  // disconnecting
  if (!deviceConnected && oldDeviceConnected) {
    Serial.println("Device disconnected.");
    delay(1000);                  // give the bluetooth stack the chance to get things ready
    pServer->startAdvertising();  // restart advertising
    Serial.println("Start advertising");
    oldDeviceConnected = deviceConnected;
  }

  // connecting
  if (deviceConnected && !oldDeviceConnected) {
    oldDeviceConnected = deviceConnected;
    Serial.println("Device Connected");
    metadata_output();
  }

#ifdef TEST_BLUETOOTH
  if (millis() % 5000 == 0) {
    i++;
    if (deviceConnected) {
      Serial.println("Sending measurements");
      sensor1_open_time = 0 + i;
      sensor1_close_time = 11111 + i;
      sensor2_open_time = 33333 + i;
      sensor2_close_time = 44444 + i;
      sensor3_open_time = 77777 + i;
      sensor3_close_time = 88888 + i;

      sensor1_state = DONE;
      sensor2_state = DONE;
      sensor3_state = DONE;
    }
  }
#endif
}
