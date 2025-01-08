import React, { useState } from 'react';
import { Phone, User, Search } from 'lucide-react';
import WebRTCConnection from './start_webrtc';

const Voice_dashboard = (props) => {
    const [clients, setClients] = useState([
        { id: 1, name: 'John Smith', company: 'Tech Solutions Inc.', phone: '(555) 123-4567', status: 'Never Called' },
        { id: 2, name: 'Sarah Johnson', company: 'Digital Dynamics', phone: '(555) 234-5678', status: 'Follow Up' },
        { id: 3, name: 'Michael Brown', company: 'Innovation Labs', phone: '(555) 345-6789', status: 'Never Called' },
        { id: 4, name: 'Emma Davis', company: 'Future Systems', phone: '(555) 456-7890', status: 'Interested' },
        { id: 5, name: 'James Wilson', company: 'Smart Solutions', phone: '(555) 567-8901', status: 'Never Called' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClient, setSelectedClient] = useState(null);

    const handleCall = (client) => {
        setSelectedClient(client);
    };

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto flex bg-gray-100">
            {/* Left Sidebar */}
            <div className="w-96 bg-white shadow-lg flex flex-col min-h-screen">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 bg-white">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">AI Sales Agent</h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search clients..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ color: 'black' }}
                        />
                    </div>
                </div>

                {/* Client List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredClients.map((client) => (
                        <div
                            key={client.id}
                            className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <User className="h-5 w-5 text-gray-400" />
                                        <h3 className="font-medium text-gray-800">{client.name}</h3>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{client.company}</p>
                                    <p className="text-sm text-gray-500 mt-1">{client.phone}</p>
                                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full mt-2 inline-block">
                                        {client.status}
                                    </span>
                                </div>
                                <button
                                    className="ml-4 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                                    onClick={() => handleCall(client)}
                                >
                                    <Phone className="h-4 w-4" />
                                    Call
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 bg-white min-h-screen">
                {selectedClient ? (
                    <div className="h-full flex flex-col">
                        {/* Top Section with Call Info */}
                        <div className="p-6 border-b">
                            <h2 className="text-2xl font-bold text-gray-800">Active Call</h2>
                            <WebRTCConnection />
                            <div className="flex items-center gap-2 mt-2">
                                <User className="h-5 w-5 text-blue-500" />
                                <span className="text-gray-600">{selectedClient.name} - {selectedClient.company}</span>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-1 p-6 overflow-y-auto">
                            {/* Conversation Visualization */}
                            <div className="max-w-3xl mx-auto">
                                {/* AI Response Visualization */}
                                <div className="mb-8">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <div className="bg-blue-50 rounded-lg p-4">
                                                <p className="text-gray-800">Hello {selectedClient.name}, I'm your AI sales assistant. I understand you're interested in our enterprise solutions. How can I help you today?</p>
                                            </div>
                                            {/* Live Transcription Effect */}
                                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                    <span className="text-sm text-gray-500">Live Transcription</span>
                                                </div>
                                                <p className="mt-2 text-gray-600 font-mono">...</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>



                                {/* Key Points */}
                                <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Key Discussion Points</h4>
                                    <ul className="space-y-2">
                                        <li className="flex items-center gap-2 text-gray-700">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                            <span>Product requirements discussed</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-gray-700">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                            <span>Budget considerations noted</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-gray-700">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                            <span>Next steps identified</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Status Bar */}
                        <div className="p-4 border-t bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-green-600">
                                    <Phone className="h-5 w-5" />
                                    <span className="font-medium">Call in progress</span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {selectedClient.phone}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Phone className="h-12 w-12 text-blue-500" />
                            </div>
                            <p className="text-gray-600 text-lg">Select a client to start a call</p>
                            <p className="text-gray-400 mt-2">Your AI sales assistant is ready to help</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Voice_dashboard;