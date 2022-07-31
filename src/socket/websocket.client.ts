import { Block, Networks, Txs, PACKET_LAYAR } from 'socket/index.declare';

interface Network {
    selected: Networks;
    others: Networks[];
}

class WebSocketClientModel {
    private ws: WebSocket;
    private _uuid: string | undefined;

    private network: Network = { selected: Networks.Baobab, others: [Networks.Cypress] };

    public blocks: Block[] = [];
    public txs: Txs[] = [];

    constructor(_ws: WebSocket) {
        this.ws = _ws;

        this.initialize();
    }

    public getNetwork = (): Network => this.network;
    public setNetwork = (network: Network) => (this.network = network);

    private initialize = (): void => {
        //register EventHandler
        this.ws.onopen = this.handleOpen;
        this.ws.onclose = this.handleClose;
        this.ws.onerror = this.handleError;
        this.ws.onmessage = this.handleOnMessage;
    };

    public sendMessage = (type: string, data: any = null, prevNetwork?: Networks): void => {
        if (this.ws.readyState !== this.ws.OPEN) throw new Error('** WebSocket is Close **');

        const _packet: PACKET_LAYAR = { type, network: this.network.selected, data, prevNetwork };

        this.ws.send(JSON.stringify(_packet));
    };

    private handleOpen = (e: Event): void => {
        console.log('Connected WebSocket >>');
    };

    private handleClose = (e: CloseEvent): void => {
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
        const _data: PACKET_LAYAR = JSON.parse(msg.data);

        switch (_data.type) {
            case 'connected':
                this._uuid = _data.data;
                break;
            case 'initBlocks':
                this.blocks = _data.data.blocks;
                this.txs = _data.data.txs;
                break;
            case 'newBlock':
                this.blocks.push(_data.data);
                if (_data.data.txs.length) this.txs = [...this.txs, ..._data.data.txs];
                this.ws.dispatchEvent(new Event('newBlockHeader'));
                break;

            default:
                break;
        }
    };

    public addEvent = (name: string, listener: () => void) => {
        this.ws.addEventListener(name, listener);
    };

    public removeEvent = (name: string) => {
        this.ws.removeEventListener(name, () => {});
    };
}

export default WebSocketClientModel;
