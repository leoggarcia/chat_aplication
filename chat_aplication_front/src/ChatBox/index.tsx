import { useState } from 'react';

interface MessageItem {
    id: string;
    botMessage: boolean;
    messageText: string;
}

function ChatBox() {
    const [messages, setMessages] = useState<MessageItem[]>([]);
    const [message, setMessage] = useState('');

    async function sendMessage() {
        const res = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            body: JSON.stringify({
                message: message,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const json = await res.json();

        const newMessage = {
            id: new Date().toDateString() + '1',
            botMessage: false,
            messageText: message,
        };

        const newMessages = [...messages];
        newMessages.push(newMessage);
        newMessages.push({
            id: new Date().toDateString() + '2',
            botMessage: true,
            messageText: json.reply,
        });

        setMessages(newMessages);
        setMessage('');
    }

    return (
        <div className='w-[80vw] mt-7 mx-auto'>
            <div className='h-125 border border-slate-500 rounded-xl p-5 flex flex-col gap-2'>
                {messages.length === 0 ? (
                    <p>No hay mensajes para mostrar</p>
                ) : (
                    messages.map((messageItem) => {
                        return (
                            <div
                                key={messageItem.id}
                                className={'w-75 p-2 bg-slate-400'}
                                style={{
                                    marginLeft: messageItem.botMessage
                                        ? 'auto'
                                        : '',
                                    marginRight: !messageItem.botMessage
                                        ? 'auto'
                                        : '',
                                }}
                            >
                                {messageItem.messageText}
                            </div>
                        );
                    })
                )}
                {/* <div className='w-75 ml-auto p-2 bg-slate-400'>Mensaje mio</div> */}
            </div>
            <form className='mt-2.5 flex items-center gap-3'>
                <input
                    placeholder='writte wor message'
                    type='text'
                    className='bg-slate-200 rounded-xl p-3'
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                    }}
                />
                <button type='button' onClick={sendMessage}>
                    Send menssage
                </button>
            </form>
        </div>
    );
}

export default ChatBox;
