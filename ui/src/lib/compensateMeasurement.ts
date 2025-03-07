import { ProcessedThreePointMeasurement } from "../types/Measurement"

export const compensateMeasurement = (measurement: ProcessedThreePointMeasurement, width: number = 32, compensationWidth: number = 1): ProcessedThreePointMeasurement => {
  // Using a simple linear extrapolation, work out the shutter width at the three measurement points
  // The assumption is that both shutters are travelling at similar speeds so we will use an average
  // First, work out the speed at the two centre points between the three sensors
  const shutter1Side1Speed = (width / 2) / measurement.shutter1.side1
  const shutter1Side2Speed = (width / 2) / measurement.shutter1.side2
  const shutter2Side1Speed = (width / 2) / measurement.shutter2.side1
  const shutter2Side2Speed = (width / 2) / measurement.shutter2.side2

  // Next, extrapolate the speed at the three sensor points for both curtains
  const shutter1Sensor1Speed = shutter1Side1Speed - ((shutter1Side2Speed - shutter1Side1Speed) / 2)
  const shutter1Sensor2Speed = (shutter1Side1Speed + shutter1Side2Speed) / 2
  const shutter1Sensor3Speed = shutter1Side2Speed + ((shutter1Side2Speed - shutter1Side1Speed) / 2)

  const shutter2Sensor1Speed = shutter2Side1Speed - ((shutter2Side2Speed - shutter2Side1Speed) / 2)
  const shutter2Sensor2Speed = (shutter2Side1Speed + shutter2Side2Speed) / 2
  const shutter2Sensor3Speed = shutter2Side2Speed + ((shutter2Side2Speed - shutter2Side1Speed) / 2)

  // Average both shutter speeds
  const averageSensor1Speed = (shutter1Sensor1Speed + shutter2Sensor1Speed)/2
  const averageSensor2Speed = (shutter1Sensor2Speed + shutter2Sensor2Speed)/2
  const averageSensor3Speed = (shutter1Sensor3Speed + shutter2Sensor3Speed)/2

  // Work out the slit width for each sensor for each curtain speed
  const sensor1SlitWidth = averageSensor1Speed * measurement.sensor1
  const sensor2SlitWidth = averageSensor2Speed * measurement.sensor2
  const sensor3SlitWidth = averageSensor3Speed * measurement.sensor3

  // Add in the sensor width compensation amount
  const compensatedSensor1SlitWidth = sensor1SlitWidth + compensationWidth
  const compensatedSensor2SlitWidth = sensor2SlitWidth + compensationWidth
  const compensatedSensor3SlitWidth = sensor3SlitWidth + compensationWidth

  // Recalculate what the timings would have been at that speed with that width
  const compensatedSensor1Interval = Math.round(compensatedSensor1SlitWidth / averageSensor1Speed)
  const compensatedSensor2Interval = Math.round(compensatedSensor2SlitWidth / averageSensor1Speed)
  const compensatedSensor3Interval = Math.round(compensatedSensor3SlitWidth / averageSensor1Speed)

  return {...measurement, sensor1: compensatedSensor1Interval, sensor2: compensatedSensor2Interval, sensor3: compensatedSensor3Interval}
}

export default compensateMeasurement
