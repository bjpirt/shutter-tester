import { Measurement } from "../types/Measurement";

export type Handler = (m: Measurement) => void

class MessageHandler {
  listeners: Record<string, Handler[]> = {}

  constructor() {
    this.listeners = {};
  }

  on(event: string, callback: Handler) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Handler) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(
        (listener) => listener !== callback
      );
    }
  }

  emit(event: string, data: Measurement) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((listener) => listener(data));
    }
  }
}

const messageHandler = new MessageHandler();
export default messageHandler;
