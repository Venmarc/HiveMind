"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, ChevronDown, Check, Hexagon, Plus, Lock } from 'lucide-react';
import { HoneycombLoader } from './HoneycombLoader';
import { Header } from './Header';
import { useHiveStore, HiveUser } from '../../store/useHiveStore';
import { MAX_USERS } from '../constants';

interface WaitingRoomProps {
    roomCode: string;
    socketId: string | undefined;
    isHost: boolean;
    onCopyRoomCode: () => void;
    onShowModal: () => void;
    onLeaveHive: () => void;
    onStartVoting: () => void;
    onUpdateSettings: (settings: { category: string; canOthersAdd: boolean }) => void;
}

export const WaitingRoom: React.FC<WaitingRoomProps> = ({
    roomCode,
    socketId,
    isHost,
    onCopyRoomCode,
    onShowModal,
    onLeaveHive,
    onStartVoting,
    onUpdateSettings
}) => {
    const category = useHiveStore(state => state.category);
    const canOthersAdd = useHiveStore(state => state.canOthersAdd);
    const users = useHiveStore(state => state.users);
    const displayUsers = users.map(u => ({
        ...u,
        initials: u.initials || u.name.substring(0, 2).toUpperCase()
    }));
    const showInviteSlot = displayUsers.length < MAX_USERS;

    const categories = ['Movies', 'Custom'];

    return (
        <div className="flex flex-col min-h-screen">
            <Header
                roomCode={roomCode}
                displayUsers={displayUsers}
                onCopyRoomCode={onCopyRoomCode}
                onShowModal={onShowModal}
                onLeaveHive={onLeaveHive}
            />
            <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,221,0,0.05)_0%,transparent_60%)] pointer-events-none" />

                <div className="z-10 flex flex-col items-center text-center max-w-lg w-full">
                    <HoneycombLoader />

                    <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-6 w-full max-w-full">
                        <AnimatePresence>
                            {displayUsers.map((u, i) => {
                                const isMe = u.id === socketId;
                                return (
                                    <motion.div
                                        key={u.id}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="relative group cursor-help"
                                    >
                                        <div className={`
                      w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center font-bold bg-hive-card transition-colors
                      ${isMe ? 'border-2 border-hive-yellow-neon shadow-[0_0_12px_rgba(255,234,0,0.6)] text-hive-yellow-neon text-lg md:text-xl' : 'border-2 border-hive-yellow-base text-hive-yellow-base text-base md:text-lg shadow-[0_0_10px_rgba(255,221,0,0.1)]'}
                    `}>
                                            {u.initials}
                                        </div>
                                        {u.isHost && (
                                            <div className="absolute -bottom-2 -right-2 bg-hive-red-neon text-white text-[9px] md:text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-hive-bg shadow-sm z-10">
                                                HOST
                                            </div>
                                        )}
                                        {isMe && !u.isHost && (
                                            <div className="absolute -bottom-2 -right-2 bg-hive-yellow-base text-black text-[9px] md:text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-hive-bg shadow-sm z-10">
                                                YOU
                                            </div>
                                        )}
                                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs text-gray-400 font-mono whitespace-nowrap transition-opacity">
                                            {u.name}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        {showInviteSlot && (
                            <div title="Invite Members" className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center opacity-40 hover:opacity-100 hover:border-hive-yellow-base/50 transition-all cursor-help group">
                                <Plus className="text-white/30 group-hover:text-hive-yellow-base/50 transition-colors" size={20} />
                            </div>
                        )}
                    </div>

                    <div className="mb-10">
                        <h2 className="text-3xl font-black text-white mb-1 uppercase tracking-wide">
                            Waiting for the hive...
                        </h2>
                        <p className="text-gray-400 flex items-center justify-center gap-2 text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-hive-yellow-base animate-pulse" />
                            Gathering minds before synchronization
                        </p>
                    </div>

                    {/* Host Control Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full bg-hive-card/50 border border-hive-yellow-base/10 rounded-3xl p-6 mb-8 backdrop-blur-sm"
                    >
                        <div className="flex items-center gap-2 mb-6 text-hive-yellow-base text-xs font-black uppercase tracking-widest">
                            <Settings size={14} className="animate-[spin_4s_linear_infinite]" />
                            Room Protocols
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                            {/* Category Selection */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">Decision Domain</label>
                                <div className="relative group">
                                    <select
                                        disabled={!isHost}
                                        value={category}
                                        onChange={(e) => onUpdateSettings({ category: e.target.value, canOthersAdd })}
                                        className={`
                                            w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 appearance-none outline-none text-sm font-bold transition-all
                                            ${isHost ? 'hover:border-hive-yellow-base/40 focus:border-hive-yellow-base text-white cursor-pointer' : 'text-gray-500 cursor-not-allowed'}
                                        `}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat} className="bg-hive-card text-white">{cat}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-hover:text-hive-yellow-base transition-colors" />
                                </div>
                            </div>

                            {/* Permissions Toggle */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">Hive Participation</label>
                                <button
                                    disabled={!isHost}
                                    onClick={() => onUpdateSettings({ category, canOthersAdd: !canOthersAdd })}
                                    className={`
                                        flex items-center justify-between w-full bg-black/40 border rounded-xl px-4 py-3 transition-all
                                        ${isHost ? 'hover:bg-black/60 cursor-pointer' : 'cursor-not-allowed opacity-60'}
                                        ${canOthersAdd ? 'border-hive-green-neon/30 text-hive-green-neon' : 'border-white/10 text-gray-400'}
                                    `}
                                >
                                    <span className="text-sm font-bold">Others can add</span>
                                    <div className={`
                                        w-5 h-5 rounded-md flex items-center justify-center border transition-all
                                        ${canOthersAdd ? 'bg-hive-green-neon border-hive-green-neon text-black' : 'border-white/20'}
                                    `}>
                                        {canOthersAdd && <Check size={14} strokeWidth={4} />}
                                    </div>
                                </button>
                            </div>
                        </div>

                        {!isHost && (
                            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-[10px] text-gray-500 font-mono uppercase">
                                <Lock size={10} /> Syncing current protocols from Host
                            </div>
                        )}
                    </motion.div>

                    <button
                        onClick={onStartVoting}
                        disabled={!isHost || displayUsers.length < 2}
                        className={`
                            w-full max-w-sm py-5 rounded-2xl font-black text-xl uppercase tracking-widest transition-all duration-300 relative overflow-hidden group
                            ${isHost && displayUsers.length >= 2
                                ? 'bg-hive-yellow-base text-black shadow-[0_0_30px_rgba(255,221,0,0.5)] hover:scale-105 active:scale-95'
                                : 'bg-white/5 text-white/30 border-2 border-dashed border-white/10 cursor-not-allowed'}
                        `}
                    >
                        <div className="flex items-center justify-center gap-3">
                            {isHost ? (
                                displayUsers.length >= 2 ? (
                                    <>
                                        <Hexagon size={24} fill="currentColor" className="animate-pulse" />
                                        Initiate Sync
                                    </>
                                ) : "Waiting for members..."
                            ) : "Awaiting Host..."}
                        </div>
                        {isHost && displayUsers.length >= 2 && (
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 blur-sm" />
                        )}
                    </button>

                    {isHost && displayUsers.length < 2 && (
                        <p className="mt-4 text-xs text-hive-red-neon uppercase tracking-wide font-bold drop-shadow-[0_0_5px_rgba(255,0,51,0.3)]">
                            Requires minimum 2 members
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
