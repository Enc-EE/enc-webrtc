import { WebRtcConnector } from "../src/webRtcConnector";
import { Chat } from "./chat";

document.addEventListener('DOMContentLoaded', main, false);
var connector: WebRtcConnector;
var currentId = 0;

function main() {
    connector = new WebRtcConnector("http://localhost:1337");
    connector.receivedNegotiatedConnection.addEventListener((rtc) => {
        var dataChannel = rtc.createDataChannel("data");
        createChat(dataChannel);
    });
    (document.getElementById("startListenBtn") as HTMLButtonElement).addEventListener("click", startListen);
    (document.getElementById("stopListenBtn") as HTMLButtonElement).addEventListener("click", stopListen);
    (document.getElementById("connectBtn") as HTMLButtonElement).addEventListener("click", join);
}

async function startListen() {
    var client1Id = await connector.createListener();
    (document.getElementById("client1Id") as HTMLLabelElement).textContent = client1Id;
    connector.startListener();
}

function stopListen() {
    connector.stopListener();
}

async function join() {
    var client2 = (document.getElementById("client2Id") as HTMLInputElement).value;
    if (client2) {
        var rtc = await connector.connect(client2)
        rtc.addEventListener("datachannel", (dc) => {
            createChat(dc.channel);
        });
    } else {
        console.log("id missing");
    }
}

function createChat(dataChannel: RTCDataChannel) {
    new Chat(currentId, dataChannel);
    currentId++;
}
