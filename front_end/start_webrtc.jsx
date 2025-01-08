import React, { useState, useRef } from 'react';
import axios from 'axios';

const WebRTCConnection = () => {
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState(null);

    // Use refs instead of state for real-time access
    const dataChannelRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const audioElementRef = useRef(null);

    // Function to handle model's function calls
    const handleFunctionCall = async (functionCall) => {
        try {
            const { name, arguments: args, call_id } = functionCall;
            let result;

            // Parse the arguments string to JSON
            const parsedArgs = JSON.parse(args);

            // Handle different function types
            switch (name) {
                case 'confirm_purchase':
                    result = await confirm_purchase(parsedArgs.full_name, parsedArgs.description);
                    break;
                default:
                    throw new Error(`Unknown function: ${name}`);
            }

            // Send the result back to the model
            await sendFunctionResult(call_id, result);

        } catch (err) {
            console.error('Function call error:', err);
            setError(err.message);
        }
    };

    // Example function implementation
    const confirm_purchase = async (full_name, description) => {
        try {
            const resposne = await axios.post('/api/create_sale', {
                full_name: full_name,
                description: description
            })

            return {
                response: `the sale havebenn added to the data base and someone will get in toutch about the payment method`
            };
        } catch (e) {
            console.log(e)
            return {
                response: `internal server error`
            };
        }

    };

    // Function to send results back to the model
    const sendFunctionResult = async (callId, result) => {
        const dc = dataChannelRef.current;
        if (!dc) {
            throw new Error('Data channel not initialized');
        }

        const event = {
            type: "conversation.item.create",
            item: {
                type: "function_call_output",
                call_id: callId,
                output: JSON.stringify(result)
            }
        };

        dc.send(JSON.stringify(event));

        // Generate a new response using the function result
        const responseEvent = {
            type: "response.create"
        };

        dc.send(JSON.stringify(responseEvent));
    };

    // Message handler for the data channel
    const onmessage = async (e) => {
        const serverEvent = JSON.parse(e.data);

        // Handle function calls from the model
        if (serverEvent.type === "response.done" &&
            serverEvent.response?.output?.[0]?.type === "function_call") {
            const functionCall = serverEvent.response.output[0];
            await handleFunctionCall(functionCall);
        }

        console.log('Received message:', serverEvent);
    };

    const initializeWebRTC = async () => {
        try {
            setStatus('connecting');
            setError(null);

            // Get token from middleware
            const { data } = await axios.post('/api/get_voice_mode_token');
            const EPHEMERAL_KEY = data.client_secret.value;

            // Create and store peer connection in ref
            const pc = new RTCPeerConnection();
            peerConnectionRef.current = pc;

            // Set up audio element for remote audio
            if (!audioElementRef.current) {
                audioElementRef.current = document.createElement('audio');
                audioElementRef.current.autoplay = true;
            }
            pc.ontrack = e => audioElementRef.current.srcObject = e.streams[0];

            // Request microphone access and add track
            const ms = await navigator.mediaDevices.getUserMedia({
                audio: true
            });
            pc.addTrack(ms.getTracks()[0]);

            // Set up data channel and store in ref
            const dc = pc.createDataChannel('oai-events');
            dc.addEventListener('message', onmessage);
            dataChannelRef.current = dc;

            // Create and set local description
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            // Connect to OpenAI's Realtime API
            const baseUrl = 'https://api.openai.com/v1/realtime';
            const model = 'gpt-4o-realtime-preview-2024-12-17';
            const sdpResponse = await axios({
                method: 'POST',
                url: `${baseUrl}?model=${model}`,
                data: offer.sdp,
                headers: {
                    Authorization: `Bearer ${EPHEMERAL_KEY}`,
                    'Content-Type': 'application/sdp'
                },
                transformResponse: [(data) => data], // Prevent JSON parsing of SDP
            });

            const answer = {
                type: 'answer',
                sdp: sdpResponse.data,
            };
            await pc.setRemoteDescription(answer);

            // Wait for connection to stabilize
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Configure available functions
            dc.send(JSON.stringify({
                type: "session.update",
                session: {
                    tools: [
                        {
                            type: "function",
                            name: "confirm_purchase",
                            description: "create a purchase for the customer",
                            parameters: {
                                type: "object",
                                properties: {
                                    full_name: {
                                        type: "string",
                                        description: "full name of the client",

                                    },
                                    description: {
                                        type: "string",
                                        description: "description about the sale that the customer made and also a detailed repport",

                                    }
                                },
                                required: ["full_name", "description"]
                            }
                        }
                    ],
                    tool_choice: "auto"
                }
            }));

            setStatus('connected');
        } catch (err) {
            console.error('Connection error:', err);
            setError(err.response?.data?.error || err.message);
            setStatus('error');
        }
    };

    const getButtonStyles = () => {
        const baseStyles = 'w-full px-4 py-2 mb-4 rounded-md font-medium transition-colors duration-200';

        if (status === 'connecting') {
            return `${baseStyles} bg-gray-400 text-gray-700 cursor-not-allowed`;
        }
        if (status === 'connected') {
            return `${baseStyles} bg-green-500 hover:bg-green-600 text-white`;
        }
        if (status === 'error') {
            return `${baseStyles} bg-red-500 hover:bg-red-600 text-white`;
        }
        return `${baseStyles} bg-blue-500 hover:bg-blue-600 text-white`;
    };

    // Cleanup function to handle component unmounting
    React.useEffect(() => {
        return () => {
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
            }
            if (audioElementRef.current) {
                audioElementRef.current.srcObject = null;
            }
            dataChannelRef.current = null;
        };
    }, []);

    return (
        <div className="p-4">
            <button
                onClick={initializeWebRTC}
                disabled={status === 'connecting'}
                className={getButtonStyles()}
            >
                {status === 'idle' && 'Start Connection'}
                {status === 'connecting' && 'Connecting...'}
                {status === 'connected' && 'Connected'}
                {status === 'error' && 'Retry Connection'}
            </button>

            {error && (
                <div className="p-4 mb-4 rounded-md bg-red-50 border border-red-200">
                    <p className="text-red-800">
                        Error: {error}
                    </p>
                </div>
            )}
        </div>
    );
};

export default WebRTCConnection;