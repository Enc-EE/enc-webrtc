import { EEventT } from "./eEvent";
import { Http } from "./http";
import { CreateResponse } from "./models/createResponse";
import { ConnectStartResponse } from "./models/connectStartResponse";
import { WebRtcClientWorkflow } from "./webRtcClientWorkflow";

export class WebRtcConnector {
    public receivedNegotiatedConnection = new EEventT<RTCPeerConnection>();
    public retryIntervalSeconds = 2;
    public isStarted = false;
    public serverId: undefined | string;

    private http: Http;

    constructor(private sigServeUrl: string) {
        this.http = new Http();
    }

    public createListener = (): Promise<string> => {
        return new Promise(async (resolve, reject) => {
            var response = <CreateResponse>JSON.parse(await this.http.post(this.sigServeUrl + "/api/v1/create"));
            this.serverId = response.id;
            resolve(response.id);
        });
    }

    public startListener = () => {
        console.log("started");
        this.isStarted = true;
        this.checkConnectStart();
    }

    public stopListener = () => {
        console.log("stopping...");
        this.isStarted = false;
    }

    public connect = (serverId: string): Promise<RTCPeerConnection> => {
        return new Promise(async (resolve, reject) => {
            var connectStartResponse = <ConnectStartResponse>JSON.parse(await this.http.post(this.sigServeUrl + "/api/v1/connectstart/" + serverId))
            var workflow = new WebRtcClientWorkflow(this.sigServeUrl, serverId, connectStartResponse.id);
            resolve(workflow.RtcPeerConnection);
        });
    }

    private checkConnectStart = () => {
        if (this.serverId && this.isStarted) {
            this.http.get(this.sigServeUrl + "/api/v1/connectstart/" + this.serverId)
                .then((response) => {
                    var connections = <ConnectStartResponse[]>JSON.parse(response);
                    for (const connection of connections) {
                        if (this.serverId) {
                            var workflow = new WebRtcClientWorkflow(this.sigServeUrl, this.serverId, connection.id);
                            this.receivedNegotiatedConnection.dispatchEvent(workflow.RtcPeerConnection);
                        }
                    }
                    setTimeout(() => {
                        this.checkConnectStart();
                    }, this.retryIntervalSeconds * 1000);
                });
        } else {
            console.log("stopped");
        }
    }
}