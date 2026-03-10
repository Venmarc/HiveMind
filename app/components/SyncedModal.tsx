"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, X } from 'lucide-react';
import { useHiveStore, HiveUser } from '../../store/useHiveStore';

interface SyncedModalProps {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    socketId: string | undefined;
}

export const SyncedModal: React.FC<SyncedModalProps> = ({
    showModal,
    setShowModal,
    socketId
}) => {
    const users = useHiveStore(state => state.users);
    const phase = useHiveStore(state => state.phase);

    const displayUsers = users.map(u => ({
        ...u,
        initials: u.initials || u.name.substring(0, 2).toUpperCase()
    }));

    return (
        <AnimatePresence>
            {showModal && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
                        onClick={() => setShowModal(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-hive-card border border-hive-yellow-base/30 rounded-2xl p-6 w-[90%] max-w-sm shadow-[0_0_30px_rgba(255,221,0,0.15)]"
                    >
                        <div className="flex justify-between items-center mb-6 border-b border-hive-yellow-base/20 pb-4">
                            <h2 className="text-xl font-bold text-hive-yellow-neon flex items-center gap-2">
                                <Users size={20} /> Hive Minds
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                            {displayUsers.map(u => {
                                const isMe = u.id === socketId;
                                return (
                                    <div key={u.id} className="flex items-center justify-between p-3 bg-black/30 rounded-xl border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className={`
                      w-10 h-10 flex items-center justify-center rounded-full font-bold border-2
                      ${isMe ? 'border-hive-yellow-neon text-hive-yellow-neon shadow-[0_0_8px_rgba(255,234,0,0.6)]' :
                                                    u.vote ? 'border-hive-green-neon text-hive-green-neon' : 'border-hive-yellow-base text-hive-yellow-base'}
                    `}>
                                                {u.initials}
                                            </div>
                                            <div>
                                                <p className={`font-bold text-white flex items-center gap-2 ${isMe ? 'text-lg text-hive-yellow-neon drop-shadow-md' : ''}`}>
                                                    {u.name}
                                                    {isMe && <span className="text-[10px] bg-hive-yellow-base text-black px-2 py-0.5 rounded font-black uppercase">You</span>}
                                                    {u.isHost && <span className="text-[10px] bg-hive-red-neon text-white px-2 py-0.5 rounded font-black tracking-widest uppercase shadow-[0_0_5px_#ff0033]">Host</span>}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {phase === 'voting' ? (u.vote ? 'Vote locked' : 'Deciding...') : 'Ready'}
                                                </p>
                                            </div>
                                        </div>
                                        {phase === 'voting' && (
                                            <div className={`w-3 h-3 rounded-full ${u.vote ? 'bg-hive-green-neon shadow-[0_0_8px_#39ff14]' : 'bg-hive-red-neon shadow-[0_0_8px_#ff0033]'}`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
