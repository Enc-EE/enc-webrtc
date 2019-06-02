export declare class WebRtcClientWorkflow {
    private sigServeUrl;
    private serverId;
    private connectId;
    retries: number;
    retryIntervalSeconds: number;
    retryDelaySeconds: number;
    listenForNegotiation: boolean;
    private http;
    private rtcPeerConnection;
    private client;
    private isConnecting;
    constructor(sigServeUrl: string, serverId: string, connectId: string);
    readonly RtcPeerConnection: RTCPeerConnection;
    private negotiationNeeded;
    private client1Workflow;
    private client2Workflow;
    protected validateRtcConnectionState: (timeoutDelaySeconds: number) => Promise<void>;
    private checkIceCandidates;
    private addIceCandidate;
    private checkConnectStart;
    private retry;
}
