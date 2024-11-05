import io from "socket.io-client"
import { EventEmitter } from "events"

export default class SocketIoClient extends EventEmitter {
  constructor(config) {
    super()
    this.config = config
    this.socket = null
    this._connect()
  }

  get connected() {
    return !!this.socket && this.socket.connected
  }
  get userId() {
    return this.socket?.id
  }

  _connect() {
    const options = {
      autoConnect: true,
      forceNew: false,
      auth: {
        token: this.config.token
      },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 3000,
      withCredentials: true,
      transports: ["websocket"]
    }
    console.log(this.config,'hellooooo')
    this.socket = io(this.config.url, options)

    this.socket.on("connect", () => {
      this.emit("connect", this.socket)
    })

    this.socket.on("disconnect", reason => {
      this.emit("disconnect", reason)
    })

    this.socket.on("connect_error", error => {
      console.error(error.message)
    })
  }

  subscribe(event, callback) {
    this.socket?.on(event, arg => callback(arg))
  }

  send(event, data) {
    this.socket?.emit(event, data)
  }
}
