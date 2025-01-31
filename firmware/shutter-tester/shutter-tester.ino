#define LED 8
#define SENSOR_1 1
#define SENSOR_2 21
#define SENSOR_3 20

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

void IRAM_ATTR sensor1_isr()
{
  if (!digitalRead(SENSOR_1))
  {
    // Serial.print("A");
    sensor1_open_time = micros();
    sensor1_state = WAIT_FOR_CLOSE;
  }
  else
  {
    // Serial.print("a");
    sensor1_close_time = micros();
    sensor1_state = DONE;
  }
}

void IRAM_ATTR sensor2_isr()
{
  if (!digitalRead(SENSOR_2))
  {
    // Serial.print("B");
    sensor2_open_time = micros();
    sensor2_state = WAIT_FOR_CLOSE;
  }
  else
  {
    // Serial.print("b");
    sensor2_close_time = micros();
    sensor2_state = DONE;
  }
}

void IRAM_ATTR sensor3_isr()
{
  if (!digitalRead(SENSOR_3))
  {
    // Serial.print("C");
    sensor3_open_time = micros();
    sensor3_state = WAIT_FOR_CLOSE;
  }
  else
  {
    // Serial.print("c");
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
  }
}
