import ShutterDirection from "../types/ShutterDirection"

const getSensorSeparation = (direction: ShutterDirection): number => {
  if(direction === ShutterDirection.Vertical){
    return 10
  }
  return 16
}

export default getSensorSeparation
