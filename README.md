## Enc WebRTC

This library is designed to create a Web RTC connection with a `RTCPeerConnection` on both clients.
It encapsulates signaling and makes Web RTC easy set up.

You can find an example at: [https://enc-ee.github.io/enc-webrtc-example/build/](https://enc-ee.github.io/enc-webrtc-example/build/)

## Installation

`npm install --save enc-webrtc`

## How To

```typescript
class MyWebRtcHandler {
    private webRtcConnector: WebRtcConnector;

    constructor() {
        // create a web rtc connector which will handle all the things
        this.webRtcConnector = new WebRtcConnector("https://enc-webrtc-signaling-app.azurewebsites.net");
        // This url *https://enc-webrtc-signaling-app.azurewebsites.net* runs a simple server used for signaling. You can use my server with this url or host your own using this code: https://github.com/Enc-EE/enc-webrtc-signaling
        
        // add a handler if a connection is created (if another client connects to you)
        this.webRtcConnector.receivedNegotiatedConnection.addEventListener(this.onNewRtcPeerConnection);
    }

    private onNewRtcPeerConnection = (rtcPeerConnection: RTCPeerConnection) =>{
        // do what ever you want with the rtcPeerConnection
        // assuming your peer has created or will create a data channel you can handle messages
        rtcPeerConnection.addEventListener("datachannel", (dataChannel) => {
            dataChannel.addEventListener("message", (e: MessageEvent) => {
                console.log("received message: " + e.data);
            })
            dataChannel.send("Hi peer!");
        });
    }

    // one client must start accepting new connections
    // call this to start listening
    public startListen = async () => {
        var client1Id = await this.webRtcConnector.createListener();
        // client1Id is used to identify this client for your peer
        // e.g. user 1 starts listening -> he gets this id -> user 1 now has to give it to peer 2
        this.webRtcConnector.startListener();
    }

    // stop listen if necessary
    public stopListen = () => {
        this.webRtcConnector.stopListener();
    }

    // this method is called by the second client who has the id from client 1
    public connect = async (client1Id: string) => {
        var rtcPeerConnection = await this.webRtcConnector.connect(client1Id)
        // do what ever you want with the rtcPeerConnection
        // you can initiate a data channel to send and receive messages
        var dataChannel = rtcPeerConnection.createDataChannel("data");
        dataChannel.addEventListener("message", (e: MessageEvent) => {
            console.log("received message: " + e.data);
        })
        dataChannel.send("Hi peer!");
    }
}
```

## References

* [enc-webrtc](https://github.com/Enc-EE/enc-webrtc)
* [enc-webrtc (npmjs.com)](https://www.npmjs.com/package/enc-webrtc)
* [enc-webrtc-signaling](https://github.com/Enc-EE/enc-webrtc-signaling)
* [enc-webrtc-example](https://github.com/Enc-EE/enc-webrtc-example)
* [webrtc.org](https://webrtc.org/)

## License

[MIT](https://github.com/Enc-EE/enc-webrtc/blob/master/LICENSE)