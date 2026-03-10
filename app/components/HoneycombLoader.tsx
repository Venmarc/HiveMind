"use client";
import React from 'react';
import { motion } from 'framer-motion';

export const HoneycombLoader = () => (
    <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 border-4 border-hive-yellow-base/20 rounded-full animate-ping" />
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-t-4 border-hive-yellow-neon rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-hive-card border border-hive-yellow-base/30 rounded-lg rotate-45 animate-pulse" />
        </div>
    </div>
);
