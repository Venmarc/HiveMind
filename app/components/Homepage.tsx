"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Hexagon, X } from 'lucide-react';

interface HomepageProps {
    myName: string;
    setMyName: (name: string) => void;
    showJoinInput: boolean;
    setShowJoinInput: (show: boolean) => void;
    joinCode: string;
    setJoinCode: (code: string) => void;
    handleCreateRoom: () => void;
    handleJoinRoom: () => void;
}

export const Homepage: React.FC<HomepageProps> = ({
    myName,
    setMyName,
    showJoinInput,
    setShowJoinInput,
    joinCode,
    setJoinCode,
    handleCreateRoom,
    handleJoinRoom
}) => (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-hive-red-neon/10 blur-[120px] rounded-full pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="z-10 w-full max-w-md flex flex-col gap-8">
            <div className="flex flex-col items-center">
                <Hexagon className="text-hive-red-neon mb-2 drop-shadow-[0_0_15px_rgba(255,0,51,0.8)]" fill="currentColor" size={72} />
                <h1 className="text-5xl font-black text-hive-yellow-neon tracking-tighter drop-shadow-[0_0_15px_rgba(255,221,0,0.5)]">HIVEMIND</h1>
                <p className="text-gray-400 text-center mt-2 font-mono text-sm uppercase tracking-widest">Synchronized Group Consensus</p>
            </div>

            <div className="bg-hive-card/80 backdrop-blur border border-hive-yellow-base/20 p-8 rounded-3xl shadow-[0_0_30px_rgba(255,221,0,0.05)]">
                <div className="mb-6">
                    <label className="block text-sm font-bold text-hive-yellow-base mb-2 uppercase tracking-wider">Your Name</label>
                    <input
                        type="text" value={myName} onChange={(e) => setMyName(e.target.value)} placeholder="Enter alias..."
                        className="w-full bg-black/50 border border-white/10 focus:border-hive-yellow-base rounded-xl px-4 py-3 text-white outline-none transition-colors"
                    />
                </div>

                {!showJoinInput ? (
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleCreateRoom}
                            className="w-full bg-hive-yellow-base text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-hive-yellow-neon transition-all hover:shadow-[0_0_20px_#ffdd00] hover:scale-[1.02] active:scale-95"
                        >
                            Create Room
                        </button>
                        <button
                            onClick={() => setShowJoinInput(true)}
                            className="w-full bg-transparent border-2 border-white/10 text-white font-bold uppercase tracking-widest py-3 rounded-xl hover:border-hive-yellow-base hover:text-hive-yellow-base transition-all"
                        >
                            Join Existing
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 animate-in slide-in-from-right-4 fade-in">
                        <input
                            type="text" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} placeholder="Room Code"
                            className="w-full bg-black/50 border border-white/10 focus:border-hive-yellow-base rounded-xl px-4 py-3 text-white outline-none font-mono uppercase transition-colors"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowJoinInput(false)}
                                className="flex-shrink-0 bg-transparent border-2 border-white/10 text-white px-4 rounded-xl hover:border-white/30"
                            >
                                <X size={20} />
                            </button>
                            <button
                                onClick={handleJoinRoom}
                                className="flex-1 bg-hive-yellow-base text-black font-black uppercase tracking-widest py-3 rounded-xl hover:bg-hive-yellow-neon transition-all hover:shadow-[0_0_20px_#ffdd00]"
                            >
                                Join
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    </div>
);
