import React, { useEffect } from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender } from '../config/chatLogic'
import { useSelector } from 'react-redux'
import { Avatar, Tooltip } from '@chakra-ui/react'
const ScrollableChat = ({ messages }) => {
  useEffect(() => {
    console.log(messages, "I am messages in messages")
  })
  const { user } = useSelector((state) => state.userAdmin);
  return (
    <ScrollableFeed>
      {messages && messages.map((elem, indx) => {
        return <div style={{ display: "flex" }} key={elem._id}>
          {
            (
              user && (isSameSender(messages, elem, indx, user._id) || isLastMessage(messages, indx, user._id))
            ) &&
            (<Tooltip
              label={elem.sender.name}
              placement='bottom-start'
              hasArrow>
              <Avatar display={'flex'} alignItems={'center'} mt='16px' mr={1} size='sm' cursor={'pointer'} name={elem.sender.name} src={elem && elem.sender && elem.sender.avatar && elem.sender.avatar.url} />
            </Tooltip>)
          }
          {
            !(isSameSender(messages, elem, indx, user._id) || isLastMessage(messages, indx, user._id)) && <span style={{ "marginLeft": "33px", display: 'inline-block' }}></span>
          }
          <span
            style={{
              backgroundColor: `${elem.sender._id !== user._id ? '#B9F5D0' : '#BEE3F8 '
                }`,
              borderRadius: '20px',
              padding: '5px 15px',
              maxWidth: '75%',
              marginLeft: elem.sender._id === user._id ? 'auto' : '0',
              marginTop: '15px',
            }
            }>
            {elem.content}
          </span>
        </div>
      })}
    </ScrollableFeed>
  )
}

export default ScrollableChat