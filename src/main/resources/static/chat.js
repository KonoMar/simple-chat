var user, stompClient;

window.onload = () => {
    user = prompt("What's your name?", `user-${new Date().getTime()}`);
    document.getElementById('user-name').innerHTML = user;
    startMessaging(user);
}

function startMessaging(user) {
    var socket = new SockJS('/my-websocket');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
        stompClient.subscribe('/topic/receive-msg-at', function (chat) {
            chat = JSON.parse(chat.body);
            if (chat.sentBy === user) {
                return;
            }
            showReceivedMessageOnMsgWindow(chat);
        });
    });

}

function showReceivedMessageOnMsgWindow(chat) {
    const receivedMsgHtml =
        `<div class="row">
        <div class="card message-card rounded m-1 mr-5">
            <div class="card-body bg-danger rounded text-white p-2">
                <div class="p-1">
                    <small class="float-left">
                    ${chat.sentBy}
                    </small>
                    <small class="float-right ml-1">
                        ${chat.sentAt}
                    </small>
                </div>
                <hr class="text-white bg-white ">
                <p class="card-text">
                    ${chat.msg}
                </p>
            </div>
        </div>
    </div>`;

    showMsgOnWindow(receivedMsgHtml);
}

document.getElementById('msg-send').onclick = (e) => {
    //prevent default form submit
    e.preventDefault();

    const msgInput = document.getElementById('msg-text');
    const msg = msgInput.value;
    msgInput.value = '';

    sendMessageToUsers(user, msg);
    showSelfMsgOnUi(user, msg);
}


function sendMessageToUsers(user, msg) {

    //endpoint and json object in string
    stompClient.send('/app/send-msg-to', {}, JSON.stringify({
        sentAt: getCurrentTime(),
        sentBy: user,
        msg: msg
    }));
}

function showSelfMsgOnUi(user, msg) {
    const selfMsgHtml = `<div class="row justify-content-end">
    <div class="card message-card rounded m-1 ml-5">
        <div class="card-body bg-primary rounded text-white p-2">
            <div class="p-1">
                <small class="float-left">
                    ${user}
                </small>
                <small class="float-right ml-1">
                    ${getCurrentTime()}
                </small>
            </div>
            <hr class="text-white bg-white ">
            <p class="card-text">
                ${msg}
            </p>
        </div>
    </div>
</div>`;

    showMsgOnWindow(selfMsgHtml);
}

function showMsgOnWindow(msgHtml) {
    const msgWindow = document.getElementById('msg-window');
    const msgBox = document.createElement('div');
    msgBox.innerHTML = msgHtml;

    msgWindow.append(msgBox);

    msgWindow.scrollTop = msgWindow.scrollHeight;
}

function getCurrentTime() {
    const now = new Date();
    return now.getHours() + ':' + now.getMinutes();
}
