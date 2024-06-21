// 'use client';
// import { useEffect, useRef, useState } from 'react';
// import useWebSocket from 'react-use-websocket';

// // const useWebSocket = (url: string) => {
// //   const [messages, setMessages] = useState<any[]>([]);
// //   const webSocketRef = useRef<WebSocket | null>(null);

// //   useEffect(() => {
// //     const webSocket = new WebSocket(url);

// //     webSocket.onopen = () => {
// //       console.log('WebSocket connection opened');
// //     };

// //     webSocket.onmessage = (event) => {
// //       const data = JSON.parse(event.data);
// //       setMessages((prevMessages) => [...prevMessages, data]);
// //     };

// //     webSocket.onerror = (error) => {
// //       console.error('WebSocket error:', error);
// //     };

// //     webSocket.onclose = () => {
// //       console.log('WebSocket connection closed');
// //     };

// //     webSocketRef.current = webSocket;

// //     return () => {
// //       webSocket.close();
// //     };
// //   }, [url]);

// //   const sendMessage = (message: string) => {
// //     if (webSocketRef.current?.readyState === WebSocket.OPEN) {
// //       webSocketRef.current.send(message);
// //     } else {
// //       console.error('WebSocket is not open');
// //     }
// //   };

// //   return { messages, sendMessage };
// // };

// export const useWebSocketConnection = (url: string, onOpen: () => void) => {
// 	return useWebSocket(url, { onOpen });
// };
import { useEffect, useState, useRef } from 'react';

export const useWebSocketConnection = (url: string, onOpen: () => void) => {
    const [lastMessage, setLastMessage] = useState<any>(null);
    const websocket = useRef<WebSocket | null>(null);

    useEffect(() => {
        websocket.current = new WebSocket(url);

        websocket.current.onopen = onOpen;

        websocket.current.onmessage = event => {
            setLastMessage(event);
        };

        websocket.current.onerror = error => {
            console.error('WebSocket error:', error);
        };

        websocket.current.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            if (websocket.current) {
                websocket.current.close();
            }
        };
    }, [url, onOpen]);

    const sendMessage = (message: string) => {
        if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
            websocket.current.send(message);
        }
    };

    return { lastMessage, sendMessage };
};
