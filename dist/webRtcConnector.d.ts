import { EEventT } from "./eEvent";
export declare class WebRtcConnector {
    private sigServeUrl;
    receivedNegotiatedConnection: EEventT<RTCPeerConnection>;
    retryIntervalSeconds: number;
    isStarted: boolean;
    serverId: undefined | string;
    private http;
    constructor(sigServeUrl: string);
    createListener: () => Promise<string>;
    startListener: () => void;
    stopListener: () => void;
    connect: (serverId: string) => Promise<RTCPeerConnection>;
    private checkConnectStart;
}
