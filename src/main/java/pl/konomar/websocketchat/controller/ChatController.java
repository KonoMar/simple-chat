package pl.konomar.websocketchat.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import pl.konomar.websocketchat.dto.ChatDto;

@Controller
public class ChatController {

    //send your message to this with /app/send-msg-at
    @MessageMapping("send-msg-to")
    //all the subscriber to this  will get the message
    @SendTo("/topic/receive-msg-at")
    public ChatDto chatWithUsers(ChatDto chatDto){
        return chatDto;
    }
}
