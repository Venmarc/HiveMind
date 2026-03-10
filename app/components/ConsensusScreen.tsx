"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, RefreshCw } from 'lucide-react';

interface ConsensusScreenProps {
    onRestart: () => void;
}

import { useHiveStore } from '../../store/useHiveStore';

export const ConsensusScreen: React.FC<ConsensusScreenProps> = ({
    onRestart
}) => {
    const consensus = useHiveStore(state => state.consensus);
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(57,255,20,0.05)_0%,transparent_70%)] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="z-10 flex flex-col items-center text-center max-w-lg w-full"
            >
                <div className="w-24 h-24 bg-hive-green-neon/20 rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(57,255,20,0.3)] border-2 border-hive-green-neon">
                    <Trophy className="text-hive-green-neon" size={48} />
                </div>

                <h2 className="text-sm font-mono text-hive-green-neon uppercase tracking-[0.3em] mb-4">Consensus Validated</h2>

                <div className="p-8 bg-hive-card border-2 border-hive-green-neon/50 rounded-3xl mb-12 shadow-[0_0_30px_rgba(57,255,20,0.1)]">
                    <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter">
                        {consensus || "No Agreement"}
                    </h1>
                </div>

                <button
                    onClick={onRestart}
                    className="flex items-center gap-3 bg-white/5 border border-white/10 hover:border-hive-yellow-base hover:text-hive-yellow-base px-8 py-4 rounded-2xl transition-all font-bold uppercase tracking-widest text-sm"
                >
                    <RefreshCw size={20} /> New Decision Cycle
                </button>
            </motion.div>
        </div>
    );
};
