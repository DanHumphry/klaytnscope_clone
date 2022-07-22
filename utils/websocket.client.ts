declare interface PACKET_LAYAR {
    type: string;
    data: any;
}

class WebSocketClientModel {
    private ws: WebSocket;

    constructor(_ws: WebSocket) {
        this.ws = _ws;

        this.initialize();
    }

    //Member Methods
    private initialize = (): void => {
        //registed EventHandler
        this.ws.onopen = this.handleOpen;
        this.ws.onclose = this.handleClose;
        this.ws.onerror = this.handleError;
        // this._handleOnMessage
        //     ? (this.ws.onmessage = this._handleOnMessage)
        //     : console.log('***** No handle OnMessage *****');

        // registed Custom EventHandler
        console.log('*** Ready to WebSocket ***');
    };

    public sendMessage = (type: string, data: any): void => {
        if (this.ws.readyState !== this.ws.OPEN) {
            console.log('** WebSocket is not Open **');
            new Error('** WebSocket is Close **');
            return;
        }

        const _packet: PACKET_LAYAR = {
            type: type,
            data: data,
        };

        this.ws.send(JSON.stringify(_packet));
    };

    private handleOpen = (ev: Event): void => {
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
}

export default WebSocketClientModel;
