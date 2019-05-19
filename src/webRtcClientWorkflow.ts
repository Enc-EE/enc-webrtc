import { Http } from "./http";

export class WebRtcClientWorkflow {
    public retries = 5;
    public retryIntervalSeconds = 2;
    public retryDelaySeconds = 2;
    public listenForNegotiation = true;

    private http: Http;
    private rtcPeerConnection: RTCPeerConnection;
    private client: string | undefined;
    private isConnecting = false;

    constructor(private sigServeUrl: string, private serverId: string, private connectId: string) {
        this.http = new Http();
        const configuration = { iceServers: [{ urls: 'stun:stun1.l.google.com:19302' }] };
        this.rtcPeerConnection = new RTCPeerConnection(configuration);
        this.rtcPeerConnection.addEventListener("icecandidate", this.addIceCandidate);
        this.rtcPeerConnection.addEventListener("negotiationneeded", this.negotiationNeeded);
        this.checkConnectStart();
    }

    public get RtcPeerConnection(): RTCPeerConnection {
        return this.rtcPeerConnection;
    }

    private negotiationNeeded = async (e: Event) => {
        console.log("rtcPeerConnection.onnegotiationneeded");
        if (!this.isConnecting) {
            this.isConnecting = true;
            await this.client1Workflow();
            this.isConnecting = false;
        } else {
            console.log("This log should not appear. But if you see it, it doesn't mean there is an error. It's just for documentation purposes.");
        }
    }

    private client1Workflow = async () => {
        this.listenForNegotiation = false;
        this.client = "client1";
        var description = await this.rtcPeerConnection.createOffer();
        await this.rtcPeerConnection.setLocalDescription(description);
        console.log("PUT connectoffer");
        await this.http.put(this.sigServeUrl + "/api/v1/connectoffer/" + this.serverId + "/" + this.connectId, JSON.stringify(description));
        var client2Description = await this.retry<RTCSessionDescriptionInit>(this.retries, this.retryDelaySeconds, async () => {
            return new Promise(async (resolve, reject) => {
                try {
                    console.log("GET connectanswer");
                    var stringResponse = await this.http.get(this.sigServeUrl + "/api/v1/connectanswer/" + this.serverId + "/" + this.connectId);
                    var response = <RTCSessionDescriptionInit>JSON.parse(stringResponse);
                    resolve(response);
                } catch (error) {
                    reject();
                }
            })
        });
        await this.rtcPeerConnection.setRemoteDescription(client2Description);
        this.checkIceCandidates("client2icecandidates", this.retries, this.retryDelaySeconds);
        await this.validateRtcConnectionState(this.retries * this.retryDelaySeconds);
    }

    private client2Workflow = async (client1Description: RTCSessionDescriptionInit) => {
        this.listenForNegotiation = false;
        this.client = "client2";
        await this.rtcPeerConnection.setRemoteDescription(client1Description);
        var client2Description = await this.rtcPeerConnection.createAnswer();
        await this.rtcPeerConnection.setLocalDescription(client2Description);
        console.log("PUT connectanswer");
        await this.http.put(this.sigServeUrl + "/api/v1/connectanswer/" + this.serverId + "/" + this.connectId, JSON.stringify(client2Description));
        this.checkIceCandidates("client1icecandidates", this.retries, this.retryDelaySeconds);
        await this.validateRtcConnectionState(this.retries * this.retryDelaySeconds);
    }

    protected validateRtcConnectionState = (timeoutDelaySeconds: number): Promise<void> => {
        return new Promise((resolve, reject) => {
            var timeout = setTimeout(() => {
                this.checkIceCandidates = () => { }
                console.log("not connected :(");
                console.log(this.rtcPeerConnection.connectionState);
                console.log(this.rtcPeerConnection);
                reject();
            }, timeoutDelaySeconds * 1000);
            this.rtcPeerConnection.addEventListener("connectionstatechange", (e) => {
                console.log(this.rtcPeerConnection.connectionState);
                console.log(e);

                if (this.rtcPeerConnection.connectionState == "connected") {
                    this.checkIceCandidates = () => { }
                    console.log("connected :)");
                    resolve();
                    clearTimeout(timeout);
                }
            });
            if (this.rtcPeerConnection.connectionState == "connected") {
                this.checkIceCandidates = () => { }
                console.log("connected :)");
                clearTimeout(timeout);
                resolve();
            }
        });
    }

    private checkIceCandidates = (url: string, retries: number, retryDelaySeconds: number) => {
        console.log("GET icecandidate");
        this.http.get(this.sigServeUrl + "/api/v1/" + url + "/" + this.serverId + "/" + this.connectId)
            .then((response) => {
                var candidates = <RTCIceCandidate[]>JSON.parse(response);
                for (const candidate of candidates) {
                    console.log("GOT icecandidate");
                    console.log(candidate);
                    this.rtcPeerConnection.addIceCandidate(candidate);
                }
                if (this.rtcPeerConnection.connectionState != "connected") {
                    setTimeout(() => {
                        this.checkIceCandidates(url, retries--, retryDelaySeconds);
                    }, retryDelaySeconds * 1000);
                }
            });
    }

    private addIceCandidate = (e: RTCPeerConnectionIceEvent) => {
        console.log('ICE candidate:');
        if (e.candidate) {
            console.log(e.candidate);
            this.http.put(this.sigServeUrl + "/api/v1/" + this.client + "icecandidates/" + this.serverId + "/" + this.connectId, JSON.stringify(e.candidate));
        }
    }

    private checkConnectStart = async () => {
        if (this.listenForNegotiation) {
            console.log("listening for negotiation");
            try {
                var connectOffer = await this.http.get(this.sigServeUrl + "/api/v1/connectoffer/" + this.serverId + "/" + this.connectId);
                var offerDescription = <RTCSessionDescriptionInit>JSON.parse(connectOffer);
                await this.client2Workflow(offerDescription);
                this.listenForNegotiation = false;
            } catch (error) {
                setTimeout(() => {
                    this.checkConnectStart();
                }, this.retryIntervalSeconds * 1000);
            }
        }
    }

    private retry = <T>(retries: number, retryDelaySeconds: number, func: () => Promise<T>): Promise<T> => {
        return new Promise(async (resolve, reject) => {
            func()
                .then((value) => {
                    resolve(value);
                })
                .catch(() => {
                    console.log("catched");

                    retries--;
                    if (retries > 0) {
                        setTimeout(async () => {
                            var result = await this.retry(retries, retryDelaySeconds, func);
                            resolve(result);
                        }, retryDelaySeconds * 1000);
                    }
                    else {
                        reject();
                    }
                });
        });
    }
}