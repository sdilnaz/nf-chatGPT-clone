// 'use client'
// import axios from 'axios';
// import React, { useState, useEffect } from 'react';
// import Head from 'next/head';
// import ReactMarkdown from 'react-markdown';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { useWebSocketConnection } from '@/lib/hooks/useWebsocket';

// interface Chat {
//     _id: string;
//     userPrompt: string;
//     response: string;
//     createdAt: string;
// }

// const fetchChats = async (): Promise<Chat[]> => {
//     try {
//         const response = await axios.get<Chat[]>('http://localhost:5000/api/chats');
//         return response.data;
//     } catch (error) {
//         console.error('Failed to fetch chat history', error);
//         return [];
//     }
// };

// const Home: React.FC = () => {
//     const [prompt, setPrompt] = useState<string>('');
//     const [isLoading, setIsLoading] = useState<boolean>(false);
//     const [streamingResponse, setStreamingResponse] = useState<string>('');
//     const [chats, setChats] = useState<Chat[]>([]);

//     const { sendMessage, lastMessage } = useWebSocketConnection('ws://localhost:5000', () => {
//         console.log('WebSocket connection established');
//     });

//     useEffect(() => {
//         if (lastMessage !== null) {
//             const { response, error } = JSON.parse(lastMessage.data);
//             if (response) {
//                 setStreamingResponse(prev => prev + response);
//                 setIsLoading(false);
//             } else if (error) {
//                 console.error(error);
//                 setIsLoading(false);
//             }
//         }
//     }, [lastMessage]);

//     useEffect(() => {
//         const loadChats = async () => {
//             const chatHistory = await fetchChats();
//             setChats(chatHistory);
//         };
//         loadChats();
//     }, []);

//     const handleSubmit = () => {
//         if (prompt.trim() === '') return;
//         setIsLoading(true);
//         setStreamingResponse('');
//         sendMessage(JSON.stringify({ message: prompt }));
//         setPrompt('');
//     };

//     return (
//         <div className='flex flex-col w-full min-h-screen'>
//             <Head>
//                 <title>DialogAI</title>
//             </Head>
//             <header className='bg-primary text-primary-foreground py-6 px-4 md:px-6'>
//                 <h1 className='text-3xl font-bold'>DialogAI</h1>
//             </header>
//             <main className='flex-1 py-12 px-4 md:px-6'>
//                 <section className='mb-8'>
//                     <h2 className='text-xl font-semibold mb-4'>Enter your question</h2>
//                     <div className='flex space-x-2'>
//                         <Input
//                             type='text'
//                             value={prompt}
//                             onChange={e => setPrompt(e.target.value)}
//                             placeholder='Enter your question'
//                             className='flex-1 px-4 py-2 border rounded-lg'
//                         />
//                         <Button
//                             onClick={handleSubmit}
//                             className='px-4 py-2 bg-primary text-primary-foreground rounded-lg'
//                             disabled={isLoading}
//                         >
//                             {isLoading ? 'Loading...' : 'Send'}
//                         </Button>
//                     </div>
//                 </section>
//                 <section>
//                     <h2 className='text-xl font-semibold mb-4 text-center'>Answer</h2>
//                     {streamingResponse && (
//                         <div className='mt-4'>
//                             <p className='text-gray-800'>
//                                 <ReactMarkdown>{streamingResponse}</ReactMarkdown>
//                             </p>
//                         </div>
//                     )}
//                 </section>
                
//             </main>
//         </div>
//     );
// };

// export default Home;
'use client'

import axios from 'axios';
import Head from 'next/head';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWebSocketConnection } from '@/lib/hooks/useWebsocket';
import React, { useState, useEffect } from 'react';

interface Chat {
    _id: string;
    userPrompt: string;
    response: string;
    createdAt: string;
}


const fetchChats = async (): Promise<Chat[]> => {
    try {
        const response = await axios.get<Chat[]>('http://localhost:5000/api/v1/chats');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch chat history', error);
        return [];
    }
};
const Home: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [streamingResponse, setStreamingResponse] = useState<string>('');
    const [chats, setChats] = useState<Chat[]>([]);
    const { sendMessage, lastMessage } = useWebSocketConnection('ws://localhost:5000', () => {
        console.log('WebSocket connection established');
    });

    

    const generateResponse = async () => {
      try {
          setIsLoading(true);
          const response = await axios.post<{ response: string }>('http://localhost:5000/api/v1/generate', { message: prompt }, {
              timeout: 10000, // Timeout after 10 seconds (adjust as needed)
          });
          setStreamingResponse(response.data.response);
          setIsLoading(false);
      } catch (error) {
          console.error('Error generating response:', error);
          setIsLoading(false);
          setStreamingResponse('Error connecting to server');
      }
  };
  
    // const handleSubmit = () => {
    //     if (prompt.trim() === '') return;
    //     generateResponse();
    //     setPrompt('');
    // };
    useEffect(() => {
      if (lastMessage !== null) {
        const { response, error } = JSON.parse(lastMessage.data);
        if (response) {
          setStreamingResponse(prev => prev + response);
          setIsLoading(false);
        } else if (error) {
          console.error(error);
          setIsLoading(false);
        }
      }
    }, [lastMessage]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const fetchedChats = await fetchChats();
          setChats(fetchedChats);
        } catch (error) {
          console.error('Failed to fetch chat history', error);
        }
      };
      fetchData();
    }, []);
  
    const handleSubmit = () => {
      setIsLoading(true);
      setStreamingResponse('');
      sendMessage(JSON.stringify({ message: prompt }));
      setPrompt('');
    };

    return (
        <div className='flex flex-col w-full min-h-screen'>
            <Head>
                <title>chatGPT clone</title>
            </Head>
            <header className='bg-primary text-primary-foreground py-6 px-4 md:px-6'>
                <h1 className='text-3xl font-bold'>chatGPT clone</h1>
            </header>
            <main className='flex-1 py-12 px-4 md:px-6'>
                <section className='mb-8'>
                    <h2 className='text-xl font-semibold mb-4'>Enter your question</h2>
                    <div className='flex space-x-2'>
                        <Input
                            type='text'
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            placeholder='Enter your question'
                            className='flex-1 px-4 py-2 border rounded-lg'
                        />
                        <Button
                            onClick={handleSubmit}
                            className='px-4 py-2 bg-primary text-primary-foreground rounded-lg'
                            disabled={isLoading}
                        >
                            {isLoading ? 'Loading...' : 'Send'}
                        </Button>
                    </div>
                </section>
                <section>
                    <h2 className='text-xl font-semibold mb-4 text-center'>Answer</h2>
                    {streamingResponse && (
                        <div className='mt-4'>
                            <p className='text-gray-800'>
                                <ReactMarkdown>{streamingResponse}</ReactMarkdown>
                            </p>
                        </div>
                    )}

                </section>
                <div className='mt-12'>
					<h2 className='text-xl font-semibold mb-4 text-center'>Chat History</h2>
					<div className='space-y-4'>
						{chats.map(chat => (
							<div
								key={chat._id}
								className='p-4 border rounded-lg'
							>
								<p>
									<strong>Prompt:</strong> {chat.userPrompt}
								</p>
								<p>
									<strong>Response:</strong> <ReactMarkdown>{chat.response}</ReactMarkdown>
								</p>
								<p className='text-gray-500 text-sm'>
									<em>{new Date(chat.createdAt).toLocaleString()}</em>
								</p>
							</div>
						))}
					</div>
				</div>
            </main>

        </div>
    );
};

export default Home;
