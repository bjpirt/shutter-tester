import { InternalMessage, InternalMessageType } from "../types/InternalMessage";


export type Handler = (m: InternalMessage) => void

class InternalMessageBus {
  listeners: Record<InternalMessageType, Handler[]> = {
    [InternalMessageType.SinglePointMeasurement]: [],
    [InternalMessageType.ThreePointMeasurement]: [],
    [InternalMessageType.Reset]: [],
    [InternalMessageType.SelectSpeed]: []
  }

  on(event: InternalMessageType, callback: Handler) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: InternalMessageType, callback: Handler) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(
        (listener) => listener !== callback
      );
    }
  }

  emit(message: InternalMessage) {
    if (this.listeners[message.type].length > 0) {
      this.listeners[message.type].forEach((listener) => listener(message));
    }
  }
}

const messageBus = new InternalMessageBus();
export default messageBus;
