import { WebRtcConnector } from "../src/webRtcConnector";

document.addEventListener('DOMContentLoaded', main, false);

function main() {
    console.log(window.location.href);

    if (window.location.href.indexOf("client1") !== -1) {
        console.log("client1");
        let connector = new WebRtcConnector("http://localhost:1337");
        (<any>document).c = connector;
        connector.createListener()
            .then((client1Id) => {
                console.log(client1Id);
                connector.receivedNegotiatedConnection.addEventListener(
                    (rtc) => {
                        console.log("got rtc");
                        (<any>document).rtc = rtc
                        var dataChannel = rtc.createDataChannel("data");
                        (<any>document).dc = dataChannel;
                        dataChannel.addEventListener("message", (message) => {
                            console.log(message);
                        });
                    })
                connector.startListener();
            })
    }
    else if (window.location.href.indexOf("client2") !== -1) {
        console.log("client2");
        var id = window.location.href.split("#")[1].split(":")[1];
        console.log(id);
        let connector = new WebRtcConnector("http://localhost:1337");
        (<any>document).c = connector;
        connector.connect(id)
            .then((rtc) => {
                console.log("got rtc");
                (<any>document).rtc = rtc
                rtc.addEventListener("datachannel", (dc) => {
                    (<any>document).dc = dc.channel;
                    dc.channel.addEventListener("message", (message) => {
                        console.log(message);
                    });
                })
            });
    }
}