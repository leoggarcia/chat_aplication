import { SendHorizontal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface MessageItem {
    id: string;
    botMessage: boolean;
    messageText: string;
    active: boolean;
}

function ChatBox() {
    const [messages, setMessages] = useState<MessageItem[]>([]);
    const [loadingMessage, setLoadingMessage] = useState(false);
    const [message, setMessage] = useState('');

    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    async function sendMessage() {
        if (loadingMessage) return;

        setLoadingMessage(true);

        const myMessage = {
            id: new Date().toISOString() + '1',
            botMessage: false,
            messageText: message,
            active: true,
        };

        setMessages((prevState) => [...prevState, myMessage]);

        const botMessage = {
            id: new Date().toISOString() + '2',
            botMessage: true,
            messageText: '',
            active: false,
        };

        setMessages((prevState) => [...prevState, botMessage]);
        setMessage('');

        inputRef?.current?.focus();

        try {
            const response = await fetch(
                import.meta.env.VITE_API_URL + '/chat',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message }),
                },
            );

            if(!response.ok){
                throw new Error
            }

            const reader = response?.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) return;

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const chunkSplit = chunk
                    .replace(/[\r\n\t]+/g, ' ')
                    .trim()
                    .split('data: ');

                if (chunkSplit.length === 1) continue;

                const jsonResponse = JSON.parse(
                    chunkSplit[chunkSplit.length - 1],
                );

                setMessages((prevState) =>
                    prevState.map((messageItem) =>
                        botMessage.id === messageItem.id
                            ? {
                                  ...messageItem,
                                  active: true,
                                  messageText:
                                      messageItem.messageText +
                                      jsonResponse.reply,
                              }
                            : messageItem,
                    ),
                );
            }
        } catch (error) {
            setMessages((prevState) =>
                prevState.map((messageItem) =>
                    botMessage.id === messageItem.id
                        ? {
                              ...messageItem,
                              active: true,
                              messageText: 'Connection lost, please retry.',
                          }
                        : messageItem,
                ),
            );
        } finally {
            setLoadingMessage(false);
        }
    }

    return (
        <div className='w-full  mt-7 mx-auto'>
            <div className='w-[60vw] min-h-screen mx-auto flex flex-col gap-5 pb-28'>
                {messages.length === 0 ? (
                    <div>
                        <p className='text-6xl text-center'>
                            Hello, I am an Italian
                            <br /> professional chef
                        </p>
                        <p className='text-3xl text-center mt-2.5'>
                            How can I help you?
                        </p>
                    </div>
                ) : (
                    messages.map((messageItem) => {
                        return (
                            <div
                                className={
                                    'max-w-10/12 w-fit flex items-end gap-2' +
                                    (messageItem.botMessage
                                        ? ' '
                                        : '  ml-auto') +
                                    (messageItem.active ? ' block' : ' hidden')
                                }
                            >
                                {messageItem.botMessage && (
                                    <p className='text-xs min-w-12.5 text-blue-800'>
                                        Chef AI
                                    </p>
                                )}
                                <div
                                    key={messageItem.id}
                                    className={
                                        'w-full p-2 z-0 rounded-xl' +
                                        (messageItem.botMessage
                                            ? ' bg-slate-100 rounded-bl-none'
                                            : ' bg-slate-300 rounded-br-none')
                                    }
                                >
                                    {messageItem.messageText}
                                </div>
                                {!messageItem.botMessage && (
                                    <p className='text-xs min-w-12.5 text-blue-500'>
                                        Tu
                                    </p>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* REFERENCE FROM THE BOTOM TO MAKE THE SCROLL */}
            <div ref={bottomRef}></div>

            {loadingMessage && (
                <div className='bg-slate-300 w-fit px-5 py-1 mx-auto z-10 rounded-xl animate-pulse fixed bottom-27.5 left-1/2 transform -translate-x-1/2'>
                    <p className='text-sm'>Thinking...</p>
                </div>
            )}

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                }}
                className='w-[60vw] flex items-end gap-2 fixed bottom-3 left-1/2 transform -translate-x-1/2 border border-gray-200 shadow-xl/30 z-30 bg-white rounded-xl p-4'
            >
                <input
                    ref={inputRef}
                    placeholder='Write your message'
                    type='text'
                    className='bg-transparent w-full rounded-xl p-3 focus:border-0'
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                    }}
                />
                <button
                    disabled={loadingMessage || message.length === 0}
                    className={
                        'cursor-pointer bg-blue-700 text-white w-fit rounded-full p-2' +
                        (loadingMessage || message.length === 0
                            ? ' opacity-40'
                            : ' opacity-100')
                    }
                >
                    <SendHorizontal strokeWidth={1} size={24} />
                </button>
            </form>
        </div>
    );
}

export default ChatBox;
