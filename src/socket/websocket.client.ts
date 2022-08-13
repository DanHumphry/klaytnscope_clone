import {
    CLIENT_PACKET_LAYER,
    clientInitValues,
    ClientInitValues,
    ClientMessageType,
    receivedServerInitValues,
    ReceivedServerInitValues,
    SERVER_PACKET_LAYER,
    ServerMessageType,
} from 'socket/index.declare';
import { HOST_WS_SERVER } from 'utils/variables';

class ClientWebSocketStorage {
    protected clientValues: ClientInitValues = clientInitValues;

    public getClientValues = <T extends keyof ClientInitValues>(type: T) => {
        return this.clientValues[type];
    };

    public setClientValues = <T extends keyof ClientInitValues>(type: T, value: any) => {
        this.clientValues[type] = value;

        document.dispatchEvent(new Event(type));
    };
}

class ServerWebsocketStorage extends ClientWebSocketStorage {
    protected ws: WebSocket;
    protected receivedServerValues: ReceivedServerInitValues = receivedServerInitValues;
    protected eventEmitterDependency: Record<string, string> = {};

    constructor(_ws: WebSocket) {
        super();

        this.ws = _ws;
    }

    public getServerValue = <T extends keyof ReceivedServerInitValues>(type: T): ReceivedServerInitValues[T] => {
        return this.receivedServerValues[type];
    };

    public sendMessage = (type: ClientMessageType, data: any = null): void => {
        if (this.ws.readyState !== this.ws.OPEN) throw new Error('** WebSocket is Close **');

        const _packet: CLIENT_PACKET_LAYER = { type, network: this.clientValues.network.selected, data };

        this.ws.send(JSON.stringify(_packet));
    };

    public eventListener = <T extends keyof ReceivedServerInitValues>(name: T, listener: () => void) => {
        this.ws.addEventListener(name, listener);
    };

    public removeEventListener = <T extends keyof ReceivedServerInitValues>(name: T) => {
        this.ws.removeEventListener(name, () => {});
    };

    public eventEmitter = (type: ServerMessageType, msg: string) => {
        if (this.eventEmitterDependency[type] !== msg) {
            this.eventEmitterDependency[type] = msg;
            this.ws.dispatchEvent(new Event(type));
        }
    };
}

class WebSocketClientModel extends ServerWebsocketStorage {
    private uuid: string | undefined;
    public isHealthy: boolean = false;

    constructor(_ws: WebSocket) {
        super(_ws);

        this.initialize();
    }

    private initialize = (): void => {
        //register EventHandler
        this.ws.onopen = this.handleOpen;
        this.ws.onclose = this.handleClose;
        this.ws.onerror = this.handleError;
        this.ws.onmessage = this.handleOnMessage;
    };

    private handleOpen = (e: Event): void => {
        this.isHealthy = true;
        console.log('Connected WebSocket >>');
    };

    private handleClose = (e: CloseEvent): void => {
        this.isHealthy = false;
        console.log('Closed WebSocket >>');

        const _interval = setInterval(() => {
            if (this.ws.readyState === this.ws.OPEN) {
                this.initialize();
                clearInterval(_interval);
                console.log('Reconnected Web Socket Server');
            } else {
                this.ws = new WebSocket(this.ws.url);
            }
        }, 5000);
    };

    private handleError = (err: Event): void => {
        console.log('Error WebSocket >>', err);
    };

    private handleOnMessage = (msg: { data: string }): void => {
        const _data: SERVER_PACKET_LAYER = JSON.parse(msg.data);

        switch (_data.type) {
            case ServerMessageType.connected:
                this.uuid = _data.data;
                break;
            case ServerMessageType.initBlocks:
                this.receivedServerValues[ServerMessageType.initBlocks] = _data.data;
                break;
            case ServerMessageType.newBlock:
                this.receivedServerValues[ServerMessageType.newBlock] = _data.data;

                this.receivedServerValues[ServerMessageType.initBlocks].blocks.push(_data.data);
                if (_data.data.txs.length !== 0) {
                    const prevTxs = [...this.receivedServerValues[ServerMessageType.initBlocks].txs];
                    this.receivedServerValues[ServerMessageType.initBlocks].txs = [...prevTxs, ..._data.data.txs];
                }
                this.eventEmitter(ServerMessageType.initBlocks, msg.data);
                break;

            default:
                break;
        }

        this.eventEmitter(_data.type, msg.data);
    };
}

export default typeof window !== 'undefined' ? new WebSocketClientModel(new WebSocket(HOST_WS_SERVER)) : null;

// export default WebSocketClientModel;
