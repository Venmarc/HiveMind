 "use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hexagon, X, Send } from 'lucide-react';

interface Message {
    id: number;
    text: string;
    sender: string;
    isMe: boolean;
    initials: string;
    time: string;
}

interface SidebarProps {
    showSidebar: boolean;
    setShowSidebar: (show: boolean) => void;
    messages: Message[];
    chatMessage: string;
    setChatMessage: (msg: string) => void;
    onSendMessage: (e?: React.FormEvent) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    showSidebar,
    setShowSidebar,
    messages,
    chatMessage,
    setChatMessage,
    onSendMessage
}) => (
    <>
        <AnimatePresence>
            {showSidebar && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setShowSidebar(false)}
                    className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
                />
            )}
        </AnimatePresence>

        <div className={`
      fixed top-0 md:top-[73px] bottom-0 right-0 
      w-full md:w-80 lg:w-96 bg-hive-card 
      border-l border-hive-yellow-base/10 
      transform transition-transform duration-300 z-40 flex flex-col
      shadow-[-10px_0_30px_rgba(0,0,0,0.5)]
      ${showSidebar ? 'translate-x-0' : 'translate-x-full'}
    `}>
            <div className="p-4 border-b border-hive-yellow-base/20 flex items-center justify-between bg-hive-card/80 backdrop-blur">
                <h3 className="font-bold text-hive-yellow-base flex items-center gap-2 drop-shadow-[0_0_5px_rgba(255,221,0,0.3)]">
                    <Hexagon size={18} fill="currentColor" className="text-hive-yellow-neon animate-pulse" /> Hive Chat
                </h3>
                <button onClick={() => setShowSidebar(false)} className="text-gray-400 hover:text-hive-red-neon transition-colors p-1 rounded-full hover:bg-white/5">
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 scrollbar-thin scrollbar-thumb-hive-red-neon/30 hover:scrollbar-thumb-hive-red-neon/50">
                {messages.map((msg) => {
                    if (msg.sender === "System") {
                        return (
                            <div key={msg.id} className="flex flex-col items-center my-2 w-full animate-in fade-in zoom-in-95 duration-500">
                                <div className="text-[10px] text-gray-400 font-mono uppercase tracking-widest bg-black/40 px-3 py-0.5 rounded-full border border-white/5 shadow-inner">
                                    {msg.text}
                                </div>
                            </div>
                        );
                    }
                    return (
                        <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.isMe ? 'self-end flex-row-reverse' : 'self-start'}`}>
                            <div className={`
                w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold border
                ${msg.isMe ? 'bg-hive-yellow-base/10 border-hive-yellow-base text-hive-yellow-base' : 'bg-black/50 border-white/20 text-gray-300'}
              `}>
                                {msg.initials}
                            </div>
                            <div className="flex flex-col">
                                <div className={`flex items-baseline gap-2 mb-1 ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <span className={`text-[10px] uppercase tracking-wider font-bold ${msg.isMe ? 'text-hive-yellow-base' : 'text-gray-400'}`}>
                                        {msg.sender}
                                    </span>
                                    <span className="text-[9px] text-gray-500 font-mono">{msg.time}</span>
                                </div>
                                <div className={`
                  p-3 rounded-2xl text-sm leading-relaxed
                  ${msg.isMe ? 'bg-hive-yellow-base text-black rounded-tr-sm shadow-[0_2px_10px_rgba(255,221,0,0.2)]' : 'bg-black/40 text-gray-200 border border-white/5 rounded-tl-sm'}
                `}>
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="p-4 border-t border-hive-yellow-base/10 bg-hive-card/80 backdrop-blur">
                <form onSubmit={onSendMessage} className="bg-black/50 rounded-full flex items-center border border-white/10 p-1 pl-4 focus-within:border-hive-yellow-base/50 focus-within:bg-black transition-all">
                    <input
                        type="text" value={chatMessage} onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Type your message..." className="bg-transparent border-none outline-none text-sm text-white flex-1 py-2"
                    />
                    <button
                        type="submit" disabled={!chatMessage.trim()}
                        className={`p-2 rounded-full ml-2 transition-all flex items-center justify-center ${chatMessage.trim() ? 'bg-hive-yellow-base text-black hover:bg-hive-yellow-neon hover:shadow-[0_0_15px_rgba(255,221,0,0.4)]' : 'bg-white/5 text-gray-600'}`}
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    </>
);
