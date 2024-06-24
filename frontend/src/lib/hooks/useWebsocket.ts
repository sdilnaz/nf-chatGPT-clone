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
