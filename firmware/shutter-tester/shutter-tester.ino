#define LED 8
#define SENSOR_1 1
#define SENSOR_2 21
#define SENSOR_3 20

#define TEST_BLUETOOTH

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

typedef enum
{
  WAIT_FOR_OPEN,
  WAIT_FOR_CLOSE,
  DONE
} sensor_states;

sensor_states sensor1_state = WAIT_FOR_OPEN;
sensor_states sensor2_state = WAIT_FOR_OPEN;
sensor_states sensor3_state = WAIT_FOR_OPEN;
long sensor1_open_time;
long sensor1_close_time;
long sensor2_open_time;
long sensor2_close_time;
long sensor3_open_time;
long sensor3_close_time;

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

class MyServerCallbacks : public BLEServerCallbacks
{
  void onConnect(BLEServer *pServer)
  {
    deviceConnected = true;
  };

  void onDisconnect(BLEServer *pServer)
  {
    deviceConnected = false;
  }
};

class MyCharacteristicCallbacks : public BLECharacteristicCallbacks
{
  void onWrite(BLECharacteristic *pModeCharacteristic)
  {
    String value = pModeCharacteristic->getValue();
    if (value.length() > 0)
    {
      Serial.print("Characteristic event, written: ");
      Serial.println(static_cast<int>(value[0])); // Print the integer value
    }
  }
};

void IRAM_ATTR sensor1_isr()
{
  if (!digitalRead(SENSOR_1))
  {
    sensor1_open_time = micros();
    sensor1_state = WAIT_FOR_CLOSE;
  }
  else
  {
    sensor1_close_time = micros();
    sensor1_state = DONE;
  }
}

void IRAM_ATTR sensor2_isr()
{
  if (!digitalRead(SENSOR_2))
  {
    sensor2_open_time = micros();
    sensor2_state = WAIT_FOR_CLOSE;
  }
  else
  {
    sensor2_close_time = micros();
    sensor2_state = DONE;
  }
}

void IRAM_ATTR sensor3_isr()
{
  if (!digitalRead(SENSOR_3))
  {
    sensor3_open_time = micros();
    sensor3_state = WAIT_FOR_CLOSE;
  }
  else
  {
    sensor3_close_time = micros();
    sensor3_state = DONE;
  }
}

void print_shutter_timing(long t1, long t2, long t3)
{
  long s1t1 = t2 - t1;
  long s1t2 = t3 - t2;
  Serial.print(" 1-2: ");
  Serial.print(s1t1);
  Serial.print(" uS || 2-3: ");
  Serial.print(s1t2);
  Serial.println(" uS");
}

void print_exposure_timing(long open_time, long close_time)
{
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

void print_summary(long s1_open_time,
                   long s1_close_time,
                   long s2_open_time,
                   long s2_close_time,
                   long s3_open_time,
                   long s3_close_time)
{
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

void setupBluetooth()
{
  BLEDevice::init(DEVICE_NAME);

  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  // Create the BLE Service
  BLEService *pService = pServer->createService(SERVICE_UUID);

  // Create a BLE Characteristic
  pSensorCharacteristic = pService->createCharacteristic(
      SENSOR_CHARACTERISTIC_UUID,
      BLECharacteristic::PROPERTY_READ |
          BLECharacteristic::PROPERTY_WRITE |
          BLECharacteristic::PROPERTY_NOTIFY |
          BLECharacteristic::PROPERTY_INDICATE);

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

void setup()
{
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

void loop()
{
  if (sensor1_state == WAIT_FOR_CLOSE || sensor2_state == WAIT_FOR_CLOSE || sensor3_state == WAIT_FOR_CLOSE)
  {
    digitalWrite(LED, HIGH);
  }

  if (sensor1_state == DONE && sensor2_state == DONE && sensor3_state == DONE)
  {
    digitalWrite(LED, LOW);
    if (sensor1_open_time < sensor3_open_time)
    {
      print_summary(sensor1_open_time,
                    sensor1_close_time,
                    sensor2_open_time,
                    sensor2_close_time,
                    sensor3_open_time,
                    sensor3_close_time);
    }
    else
    {
      print_summary(sensor3_open_time,
                    sensor3_close_time,
                    sensor2_open_time,
                    sensor2_close_time,
                    sensor1_open_time,
                    sensor1_close_time);
    }

    sensor1_state = WAIT_FOR_OPEN;
    sensor2_state = WAIT_FOR_OPEN;
    sensor3_state = WAIT_FOR_OPEN;

    if (deviceConnected)
    {
      long minTime = min(sensor1_open_time, sensor3_open_time);
      sprintf(message, "{\"sensor1\":{\"open\":%ld,\"close\":%ld},\"sensor2\":{\"open\":%ld,\"close\":%ld},\"sensor3\":{\"open\":%ld,\"close\":%ld}}",
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

  // disconnecting
  if (!deviceConnected && oldDeviceConnected)
  {
    Serial.println("Device disconnected.");
    delay(1000);                 // give the bluetooth stack the chance to get things ready
    pServer->startAdvertising(); // restart advertising
    Serial.println("Start advertising");
    oldDeviceConnected = deviceConnected;
  }
  // connecting
  if (deviceConnected && !oldDeviceConnected)
  {
    // do stuff here on connecting
    oldDeviceConnected = deviceConnected;
    Serial.println("Device Connected");
  }

#ifdef TEST_BLUETOOTH
  if (millis() % 5000 == 0)
  {
    i++;
    if (deviceConnected)
    {
      Serial.println("Sending measurements");
      sprintf(message, "{\"sensor1\":{\"open\":%ld,\"close\":%ld},\"sensor2\":{\"open\":%ld,\"close\":%ld},\"sensor3\":{\"open\":%ld,\"close\":%ld}}",
              0 + i,
              11111 + i,
              33333 + i,
              44444 + i,
              77777 + i,
              88888 + i);

      pSensorCharacteristic->setValue(message);
      pSensorCharacteristic->notify();
      delay(2);
    }
  }
#endif
}
