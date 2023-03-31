import * as React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender } from "../chatLogic";
import { ChatState } from "../Context/ChatProvider";
import { Tooltip, Avatar } from "@chakra-ui/react";
const ScrollableChat = ({ messages }) => {
  const {user} = ChatState();
  return (
      <ScrollableFeed>
        {messages &&
          messages.map((item,i) =>  (
            <div key={item._id} style={{ display: "flex" }}>
              {
                ((isSameSender(messages, item, i, user._id) || isLastMessage(messages,i,user._id)) && 
                  (<Tooltip
                  label={item.sender.name} placement={"bottom-start"} hasArrow
                  >
                  <Avatar
                    mt="20px"
                    mr={1}
                    size={"sm"}
                    cursor={"pointer"}
                    name={item.sender.name}
                    src={item.sender.pic}
                  />
                  </Tooltip>)
                )
              }
              <span style={{
                backgroundColor:`${item.sender._id != user._id ? "#BEE3F8" : "#B9F5D0"}`,
                marginTop:'10px',
                color:'black',
                padding:'10px',
                borderRadius:'10px',
                marginLeft:`${item.sender._id === user._id ? "auto":""}`
              }}>
                {item.content}
              </span>
            </div>
          ))}
      </ScrollableFeed>
   
  );
};

export default ScrollableChat;
