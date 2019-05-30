import ChatTemplate from "raw-loader!../example/chat.template.html";
import MessageTemplate from "raw-loader!../example/chat-message.template.html";

export class Chat {
    constructor(private id: number, private dataChannel: RTCDataChannel) {
        var chatHtml = ChatTemplate;
        chatHtml = chatHtml.replace(/{{id}}/igm, id.toString());
        (document.getElementById("chats") as HTMLDivElement).innerHTML += chatHtml;

        (document.getElementById("send" + id) as HTMLButtonElement).addEventListener("click", () => {
            var chatMessage = (document.getElementById("message-input" + this.id) as HTMLTextAreaElement).value;
            dataChannel.send(chatMessage);
            chatMessage = "me: " + chatMessage;
            this.appendMessage(chatMessage);
        });

        dataChannel.addEventListener("message", (message) => {
            var chatMessage = message.data;
            chatMessage = "x: " + chatMessage;
            this.appendMessage(chatMessage);
        });
    }

    private appendMessage(chatMessage: any) {
        var html = MessageTemplate;
        html = html.replace(/{{id}}/igm, this.id.toString());
        html = html.replace(/{{message}}/igm, chatMessage);
        (document.getElementById("messages" + this.id) as HTMLDivElement).innerHTML += html;
    }
}