export type SensorMeasurement = {
  open: number;
  close: number;
};

type Measurement = {
  sensor1: SensorMeasurement;
  sensor2: SensorMeasurement;
  sensor3: SensorMeasurement;
};

export default Measurement;
