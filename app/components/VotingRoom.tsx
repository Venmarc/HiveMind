"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHiveStore, HiveUser } from '../../store/useHiveStore';
import {
    Users, Lock, Clock, MessageSquare, Copy, LogOut,
    Check, Plus, X, Trophy, RefreshCw, Hexagon, ShieldAlert
} from 'lucide-react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MovieSuggestions } from './MovieSuggestions';

interface VotingRoomProps {
    roomCode: string;
    displayUsers: HiveUser[];
    socketId: string | undefined;
    isHost: boolean;
    showSidebar: boolean;
    setShowSidebar: (show: boolean) => void;
    formatTime: (s: number) => string;
    allVoted: boolean;
    myVote: string | null;
    handleCastVote: (title: string) => void;
    handleVeto: (e: React.MouseEvent, title: string) => void;
    messages: any[];
    chatMessage: string;
    setChatMessage: (msg: string) => void;
    onSendMessage: (e?: React.FormEvent) => void;
    onCopyRoomCode: () => void;
    onShowModal: () => void;
    onLeaveHive: () => void;
    onAddOption: (opt: any) => void;
    unreadCount?: number;
}

export const VotingRoom: React.FC<VotingRoomProps> = ({
    roomCode,
    displayUsers,
    socketId,
    isHost,
    showSidebar,
    setShowSidebar,
    formatTime,
    allVoted,
    myVote,
    handleCastVote,
    handleVeto,
    messages,
    chatMessage,
    setChatMessage,
    onSendMessage,
    onCopyRoomCode,
    onShowModal,
    onLeaveHive,
    onAddOption,
    unreadCount = 0
}) => {
    const options = useHiveStore(state => state.options);
    const timeLeft = useHiveStore(state => state.timeLeft);
    const vetoedOption = useHiveStore(state => state.vetoedOption);
    const hasVetoed = useHiveStore(state => state.hasVetoed);
    const participationCanAdd = useHiveStore(state => state.canOthersAdd);
    return (
        <div className="flex flex-col min-h-screen relative overflow-hidden">
            <Header
                roomCode={roomCode}
                displayUsers={displayUsers}
                onCopyRoomCode={onCopyRoomCode}
                onShowModal={onShowModal}
                onLeaveHive={onLeaveHive}
            />
            <Sidebar
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
                messages={messages}
                chatMessage={chatMessage}
                setChatMessage={setChatMessage}
                onSendMessage={onSendMessage}
            />

            <div className={`p-4 md:p-8 flex-1 transition-all duration-300 ${showSidebar ? 'md:mr-80 lg:mr-96' : ''}`}>
                <div className="max-w-5xl mx-auto flex flex-col relative z-10 pt-4">

                    <div className="flex justify-between items-center mb-10 gap-4">
                        {/* Desktop Avatars */}
                        <div className="hidden md:flex flex-wrap items-center gap-3">
                            {displayUsers.map((u) => {
                                const isMe = u.id === socketId;
                                return (
                                    <div key={u.id} className="relative group cursor-help">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold bg-hive-card border-2 transition-colors 
                    ${isMe ? 'border-hive-yellow-neon text-hive-yellow-neon shadow-[0_0_10px_rgba(255,234,0,0.6)] text-lg' :
                                                u.vote ? 'border-hive-green-neon text-hive-green-neon shadow-[0_0_10px_rgba(57,255,20,0.2)]' : 'border-hive-yellow-base text-hive-yellow-base'}`}>
                                            {u.initials}
                                        </div>
                                        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-hive-bg ${u.vote ? 'bg-hive-green-neon' : 'bg-hive-red-neon'}`} />
                                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 bg-black/80 px-2 py-1 rounded">
                                            {isMe ? "You" : u.name}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Mobile Avatars */}
                        <div className="flex md:hidden items-center gap-2">
                            {displayUsers.slice(0, 4).map((u) => {
                                const isMe = u.id === socketId;
                                return (
                                    <div key={u.id} className="relative group">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold bg-hive-card border-2 transition-colors 
                      ${isMe ? 'border-hive-yellow-neon text-hive-yellow-neon shadow-[0_0_8px_rgba(255,234,0,0.6)]' :
                                                u.vote ? 'border-hive-green-neon text-hive-green-neon' : 'border-hive-yellow-base text-hive-yellow-base'}`}>
                                            {u.initials}
                                        </div>
                                        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-hive-bg ${u.vote ? 'bg-hive-green-neon' : 'bg-hive-red-neon'}`} />
                                    </div>
                                );
                            })}
                            {displayUsers.length > 4 && (
                                <div onClick={onShowModal} className="w-10 h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-xs text-white font-bold cursor-pointer">
                                    +{displayUsers.length - 4}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowSidebar(!showSidebar)}
                                className={`relative p-3 rounded-xl border transition-all
                ${showSidebar ? 'bg-hive-yellow-base text-black border-hive-yellow-base shadow-[0_0_15px_#ffdd00]' : 'bg-hive-card text-hive-yellow-base border-hive-yellow-base/30 hover:border-hive-yellow-base shadow-sm'}`}
                            >
                                <MessageSquare size={20} className={showSidebar ? "text-black drop-shadow-sm" : "drop-shadow-[0_0_5px_rgba(255,221,0,0.5)]"} />

                                {/* Unread Badge */}
                                <AnimatePresence>
                                    {!showSidebar && unreadCount > 0 && (
                                        <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1.1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            className="absolute -top-1 -right-1 w-5 h-5 bg-hive-red-neon text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-hive-bg shadow-[0_0_10px_rgba(255,0,51,0.5)]"
                                        >
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>

                            <div className={`flex items-center gap-2 font-mono text-xl md:text-2xl font-bold px-3 py-2 rounded-xl backdrop-blur ${timeLeft < 30 ? 'text-hive-red-neon bg-hive-red-neon/10 animate-pulse border border-hive-red-neon/30 shadow-[0_0_10px_rgba(255,0,51,0.2)]' : 'text-hive-yellow-base bg-hive-card border border-hive-yellow-base/20 shadow-[0_0_15px_rgba(255,221,0,0.1)]'}`}>
                                <Clock size={22} className="hidden md:block" />
                                {formatTime(timeLeft)}
                            </div>
                        </div>
                    </div>

                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-5xl font-black mb-3 text-hive-yellow-neon drop-shadow-[0_0_15px_rgba(255,221,0,0.5)] uppercase tracking-wider transition-all">
                            {allVoted ? "Hive converging..." : `${displayUsers.length} minds deciding...`}
                        </h1>
                        <p className="text-gray-400">Lock in your selection to reach group consensus.</p>
                    </div>

                    {/* Horizontal Scroll Container for Options */}
                    <div className="relative mb-12">
                        <div className="flex overflow-x-auto pb-8 gap-6 no-scrollbar snap-x snap-mandatory px-4 -mx-4">
                            <AnimatePresence mode="popLayout">
                                {options.map((opt) => {
                                    const isSelected = myVote === opt.title;
                                    const isVetoed = vetoedOption === opt.title;
                                    const voteCount = displayUsers.filter(u => u.vote === opt.title).length;
                                    const percent = displayUsers.length ? Math.round((voteCount / displayUsers.length) * 100) : 0;

                                    return (
                                        <motion.div
                                            key={opt.id}
                                            layout
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{ opacity: isVetoed ? 0.5 : 1, x: 0 }}
                                            whileHover={!isVetoed ? { y: -5 } : {}}
                                            onClick={() => !isVetoed && handleCastVote(opt.title)}
                                            className={`
                                            relative flex-shrink-0 w-[280px] md:w-[320px] h-[400px] p-6 rounded-[2rem] border-2 transition-all cursor-pointer overflow-hidden snap-center
                                            ${isVetoed ? 'border-hive-red-neon/20 bg-black/40 cursor-not-allowed grayscale' :
                                                    isSelected ? 'border-hive-yellow-base bg-hive-yellow-base/10 shadow-[0_0_30px_rgba(255,221,0,0.15)]' :
                                                        'border-white/5 bg-hive-card hover:border-hive-yellow-base/30'}
                                        `}
                                        >
                                            {/* Progress bar background */}
                                            <div
                                                className="absolute bottom-0 left-0 h-1.5 bg-hive-green-neon/30 transition-all duration-1000"
                                                style={{ width: `${percent}%` }}
                                            />

                                            <div className="flex flex-col h-full relative z-10">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className={`p-2.5 rounded-2xl ${isSelected ? 'bg-hive-yellow-base text-black shadow-[0_0_15px_rgba(255,221,0,0.4)]' : 'bg-black/50 text-hive-yellow-base border border-hive-yellow-base/20'}`}>
                                                        {isSelected ? <Check size={20} strokeWidth={3} /> : <Hexagon size={20} />}
                                                    </div>

                                                    {!isVetoed && !hasVetoed && (
                                                        <button
                                                            onClick={(e) => handleVeto(e, opt.title)}
                                                            className="p-2 text-hive-red-neon hover:bg-hive-red-neon/10 rounded-xl transition-all border border-transparent hover:border-hive-red-neon/20"
                                                            title="Veto this option"
                                                        >
                                                            <ShieldAlert size={18} />
                                                        </button>
                                                    )}
                                                </div>

                                                <h3 className={`text-xl font-black mb-2 uppercase tracking-tight line-clamp-2 ${isSelected ? 'text-hive-yellow-base' : 'text-white'}`}>
                                                    {opt.title}
                                                </h3>
                                                <p className="text-xs text-gray-400 line-clamp-3 mb-4 font-medium leading-relaxed">{opt.desc}</p>

                                                {opt.image && (
                                                    <div className="mt-auto mb-5 rounded-2xl overflow-hidden border border-white/5 h-40 shadow-inner relative group-hover:border-white/10 transition-colors bg-black/40">
                                                        <img src={opt.image} alt={opt.title} className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-700" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                )}

                                                <div className="mt-auto flex justify-between items-end">
                                                    <div className="flex -space-x-2.5">
                                                        {displayUsers.filter(u => u.vote === opt.title).slice(0, 4).map((u, i) => (
                                                            <div key={i} className="w-7 h-7 rounded-full bg-hive-green-neon text-black text-[10px] flex items-center justify-center font-black border-2 border-hive-bg shadow-sm">
                                                                {u.initials}
                                                            </div>
                                                        ))}
                                                        {voteCount > 4 && (
                                                            <div className="w-7 h-7 rounded-full bg-black/80 text-white text-[9px] flex items-center justify-center font-bold border-2 border-white/10">
                                                                +{voteCount - 4}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`text-2xl font-black ${percent > 0 ? 'text-hive-green-neon' : 'text-gray-600'}`}>{percent}%</span>
                                                        <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">{voteCount} Minds</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {isVetoed && (
                                                <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/70 backdrop-blur-sm">
                                                    <motion.div
                                                        initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
                                                        animate={{ scale: 1, rotate: -12, opacity: 1 }}
                                                        className="border-4 border-hive-red-neon text-hive-red-neon px-6 py-2 font-black text-3xl tracking-widest uppercase shadow-[0_0_20px_rgba(255,0,51,0.3)]"
                                                    >
                                                        VETOED
                                                    </motion.div>
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>

                        {/* Scroll indicators or gradients could go here */}
                        <div className="absolute top-0 right-0 bottom-8 w-20 bg-gradient-to-l from-hive-bg to-transparent pointer-events-none z-10 hidden md:block" />
                    </div>

                    {/* Integration Zone: Movie Suggestions (Permission Based) */}
                    {(isHost || participationCanAdd) ? (
                        <MovieSuggestions onAddOption={onAddOption} />
                    ) : (
                        <div className="mt-8 p-8 border-2 border-dashed border-white/5 rounded-[2.5rem] bg-black/20 flex flex-col items-center text-center opacity-60">
                            <Lock className="text-gray-500 mb-3" size={32} />
                            <h3 className="text-gray-400 font-bold uppercase tracking-widest text-sm">Suggestions Locked</h3>
                            <p className="text-gray-600 text-xs mt-1">Host has restricted adding new movies during this phase.</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};
