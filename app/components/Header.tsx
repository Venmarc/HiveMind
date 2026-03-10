"use client";
import React from 'react';
import { Hexagon, Copy, LogOut } from 'lucide-react';
import { HiveUser } from '../store/useHiveStore';

interface HeaderProps {
    roomCode: string;
    displayUsers: HiveUser[];
    onCopyRoomCode: () => void;
    onShowModal: () => void;
    onLeaveHive: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    roomCode,
    displayUsers,
    onCopyRoomCode,
    onShowModal,
    onLeaveHive
}) => (
    <nav className="flex justify-between items-center p-4 md:p-6 border-b border-hive-yellow-base/10 bg-hive-card/50 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-hive-red-neon font-black text-2xl tracking-tighter drop-shadow-[0_0_8px_rgba(255,0,51,0.6)]">
                <Hexagon className="text-hive-red-neon" fill="currentColor" size={28} />
                HM
            </div>
            <button
                onClick={onCopyRoomCode}
                className="px-3 py-1 bg-black/50 rounded-md border border-hive-yellow-base/20 flex items-center gap-2 text-sm text-hive-yellow-base hover:bg-hive-yellow-base/10 hover:border-hive-yellow-base/50 transition-all font-mono shadow-[0_0_10px_rgba(255,221,0,0.1)] hover:shadow-[0_0_15px_rgba(255,221,0,0.3)]"
            >
                Room: {roomCode}
                <Copy size={14} />
            </button>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
            <button
                onClick={onShowModal}
                className="flex items-center gap-2 bg-black/50 px-3 md:px-4 py-1.5 rounded-full border border-hive-green-neon/30 hover:border-hive-green-neon/80 transition-all cursor-pointer shadow-[0_0_10px_rgba(57,255,20,0.1)] hover:shadow-[0_0_15px_rgba(57,255,20,0.3)]"
            >
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-hive-green-neon shadow-[0_0_8px_#39ff14] animate-pulse" />
                <span className="font-mono text-xs md:text-sm text-hive-green-neon font-bold whitespace-nowrap">
                    {displayUsers.length} Synced
                </span>
            </button>

            <button
                onClick={onLeaveHive}
                className="text-sm font-semibold text-gray-400 hover:text-hive-red-neon transition-colors flex items-center gap-2"
            >
                <span className="hidden sm:inline">Leave Hive</span>
                <LogOut size={18} />
            </button>
        </div>
    </nav>
);
