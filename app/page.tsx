"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { useHiveStore, HiveUser } from '../store/useHiveStore';
import { tmdbFetch } from './lib/tmdb';

// Modular Components
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Homepage } from './components/Homepage';
import { WaitingRoom } from './components/WaitingRoom';
import { VotingRoom } from './components/VotingRoom';
import { ConsensusScreen } from './components/ConsensusScreen';
import { SyncedModal } from './components/SyncedModal';
import { HoneycombLoader } from './components/HoneycombLoader';

// Constants
import { MOCK_OPTIONS } from './constants';

type AppPhase = 'home' | 'waiting' | 'voting' | 'consensus';
type ExtendedUser = HiveUser & { isHost?: boolean; initials: string };

export default function HiveMindApp() {
  const users = useHiveStore(state => state.users);
  const consensus = useHiveStore(state => state.consensus);
  const category = useHiveStore(state => state.category);
  const canOthersAdd = useHiveStore(state => state.canOthersAdd);
  const setUsers = useHiveStore(state => state.setUsers);
  const setConsensus = useHiveStore(state => state.setConsensus);
  const setSettings = useHiveStore(state => state.setSettings);
  const reset = useHiveStore(state => state.reset);

  const socketRef = React.useRef<Socket | null>(null);

  // App Phase & State
  const phase = useHiveStore(state => state.phase);
  const timeLeft = useHiveStore(state => state.timeLeft);
  const dynamicOptions = useHiveStore(state => state.options);
  const vetoedOption = useHiveStore(state => state.vetoedOption);
  const hasVetoed = useHiveStore(state => state.hasVetoed);

  const setPhase = useHiveStore(state => state.setPhase);
  const setTimeLeft = useHiveStore(state => state.setTimeLeft);
  const setOptions = useHiveStore(state => state.setOptions);
  const setVetoedOption = useHiveStore(state => state.setVetoedOption);
  const setHasVetoed = useHiveStore(state => state.setHasVetoed);

  const [myName, setMyName] = useState("");
  const [myVote, setMyVote] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [roomCode, setRoomCode] = useState("");

  // UI States
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const showSidebarRef = React.useRef(showSidebar);
  const roomCodeRef = React.useRef(roomCode);
  const myNameRef = React.useRef(myName);

  // Sync ref with state
  useEffect(() => {
    showSidebarRef.current = showSidebar;
    if (showSidebar) setUnreadMessages(0);
  }, [showSidebar]);

  // Sync refs with state
  useEffect(() => {
    roomCodeRef.current = roomCode;
    myNameRef.current = myName;
  }, [roomCode, myName]);

  // Veto States (Server-synced)
  // No local state for veto, now in store

  // Chat States
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<{ id: number; text: string; sender: string; isMe: boolean; initials: string; time: string }[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Sync unread messages when sidebar changes
  useEffect(() => {
    if (showSidebar) setUnreadMessages(0);
  }, [showSidebar]);

  // --- Utilities ---
  const leaveHive = useCallback(() => {
    socketRef.current?.disconnect();
    reset();
    setPhase('home');
    setMyVote(null);
    setIsHost(false);
    setMyName("");
    setHasVetoed(false);
    setVetoedOption(null);
    setRoomCode("");
    setMessages([]);
    setTimeLeft(180);
    setOptions(MOCK_OPTIONS);
  }, [reset]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // --- Real-time Hooks ---
  useEffect(() => {
    socketRef.current = io();
    const socket = socketRef.current;

    socket.on("room-update", (updatedUsers: HiveUser[]) => setUsers(updatedUsers));
    socket.on("consensus-reached", (winner: string) => {
      setConsensus(winner);
      setPhase('consensus');
    });
    socket.on("phase-change", (data: any) => {
      if (typeof data === 'string') {
        setPhase(data as AppPhase);
      } else {
        setPhase(data.phase);
        if (data.options) setOptions(data.options);
        if (data.settings) setSettings(data.settings);
      }
    });
    socket.on("chat-message", (msg: any) => {
      setMessages(prev => [...prev, msg]);
      if (!showSidebarRef.current) {
        setUnreadMessages(prev => prev + 1);
      }
    });
    socket.on("chat-history", (history: any) => {
      setMessages(history);
    });
    socket.on("state-sync", (state: any) => {
      setPhase(state.phase);
      setSettings({
        category: state.category || 'Movies',
        canOthersAdd: state.canOthersAdd !== undefined ? state.canOthersAdd : true
      });
      setTimeLeft(state.timeLeft || 180);
      setVetoedOption(state.vetoedOption);
      if (state.options && state.options.length > 0) {
        setOptions(state.options);
      }
    });
    socket.on("settings-updated", (settings: any) => {
      setSettings({
        category: settings.category || 'Movies',
        canOthersAdd: settings.canOthersAdd !== undefined ? settings.canOthersAdd : true
      });
    });
    socket.on("options-updated", (newOptions: any) => {
      setOptions(newOptions);
    });
    socket.on("timer-update", (newTime: number) => {
      setTimeLeft(newTime);
    });
    socket.on("timer-expired", () => {
      setPhase('consensus');
    });
    socket.on("veto-applied", (optionTitle: string) => {
      setVetoedOption(optionTitle);
      setMyVote(prev => prev === optionTitle ? null : prev);
    });
    socket.on("room-closed", () => {
      alert("The host has left or the room was closed.");
      // We don't call leaveHive directly here to avoid dependency issues, 
      // but we can trigger the same logic.
      socket.disconnect();
      reset();
      setPhase('home');
    });

    return () => {
      socket.off("room-update");
      socket.off("consensus-reached");
      socket.off("phase-change");
      socket.off("chat-message");
      socket.off("chat-history");
      socket.off("state-sync");
      socket.off("settings-updated");
      socket.off("options-updated");
      socket.off("timer-update");
      socket.off("timer-expired");
      socket.off("veto-applied");
      socket.off("room-closed");
    };
  }, [setUsers, setConsensus, setSettings, reset, setPhase, setOptions, setTimeLeft, setVetoedOption, setHasVetoed]);

  const displayUsers: ExtendedUser[] = phase === 'home' ? [] : users.map(u => ({
    ...u,
    initials: u.initials || u.name.substring(0, 2).toUpperCase()
  }));

  const allVoted = displayUsers.length > 0 && displayUsers.every(u => u.vote !== null);

  // --- Actions ---
  const handleCreateRoom = async () => {
    if (!myName.trim()) return alert("Enter your name");
    setIsHost(true);

    let newRoomCode = "";
    let isTaken = true;

    while (isTaken) {
      newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      isTaken = await new Promise((resolve) => {
        socketRef.current?.emit("check-room-code", { roomId: newRoomCode }, (response: { isTaken: boolean }) => {
          resolve(response.isTaken);
        });
      });
    }

    setRoomCode(newRoomCode);
    setPhase('waiting');
    socketRef.current?.emit("join-room", { roomId: newRoomCode, userName: myName, isHost: true, initials: myName.substring(0, 2).toUpperCase() });
  };

  const handleJoinRoom = () => {
    if (!myName.trim()) return alert("Enter your name");
    if (!joinCode.trim()) return alert("Enter room code");
    setIsHost(false);
    const code = joinCode.toUpperCase();
    setRoomCode(code);
    setPhase('waiting');
    socketRef.current?.emit("join-room", { roomId: code, userName: myName, isHost: false, initials: myName.substring(0, 2).toUpperCase() });
  };

  const startVoting = async () => {
    let initialOptions = MOCK_OPTIONS;
    // If category is Movies, auto-populate with 3 trending movies
    if (category === 'Movies') {
      try {
        const data = await tmdbFetch('/trending/movie/week');
        initialOptions = data.results.slice(0, 3).map((m: any) => ({
          id: `tmdb-${m.id}`,
          title: m.title,
          desc: m.overview,
          image: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null
        }));
      } catch (err) {
        console.error("Failed to fetch initial movies:", err);
      }
    }

    // MANDATORY: Update options on server FIRST, then start voting
    socketRef.current?.emit("update-options", { roomId: roomCode, options: initialOptions });
    socketRef.current?.emit("start-voting", { roomId: roomCode });

    // Local state update
    setOptions(initialOptions);
    setPhase('voting');
  };

  const handleUpdateSettings = (newSettings: { category: string; canOthersAdd: boolean }) => {
    setSettings(newSettings);
    socketRef.current?.emit("update-settings", { roomId: roomCode, ...newSettings });
  };

  const handleCastVote = (title: string) => {
    setMyVote(title);
    socketRef.current?.emit("cast-vote", { roomId: roomCode, vote: title });
  };

  const handleVeto = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    if (hasVetoed) return;
    if (window.confirm("Veto this option? (one-time use)")) {
      setHasVetoed(true);
      setVetoedOption(title);
      socketRef.current?.emit("veto-option", { roomId: roomCode, optionTitle: title });
      if (myVote === title) setMyVote(null);
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatMessage.trim()) return;

    const initials = (myName || "ME").substring(0, 2).toUpperCase();
    const newMsg = {
      id: Date.now(),
      text: chatMessage,
      sender: myName || "Me",
      isMe: true,
      initials: initials,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMsg]);
    setChatMessage("");
    socketRef.current?.emit("chat-message", {
      roomId: roomCode,
      message: { ...newMsg, isMe: false }
    });
  };

  const handleAddOption = (opt: any) => {
    // Check if duplicate or reached limit
    if (dynamicOptions.some(o => o.id === opt.id)) return;
    if (dynamicOptions.length >= 10) return alert("Maximum of 10 options reached");

    const newOptions = [...dynamicOptions, opt];
    setOptions(newOptions);
    socketRef.current?.emit("update-options", { roomId: roomCode, options: newOptions });

    // Optionally announce in chat
    const initials = (myName || "SY").substring(0, 2).toUpperCase();
    const systemMsg = {
      id: Date.now(),
      text: `${myName || 'Someone'} added "${opt.title}" to the hub`,
      sender: "System",
      isMe: false,
      initials: "SY",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, systemMsg]);
    socketRef.current?.emit("chat-message", { roomId: roomCode, message: systemMsg });
  };

  const renderCurrentPhase = () => {
    switch (phase) {
      case 'home':
        return (
          <Homepage
            myName={myName}
            setMyName={setMyName}
            showJoinInput={showJoinInput}
            setShowJoinInput={setShowJoinInput}
            joinCode={joinCode}
            setJoinCode={setJoinCode}
            handleCreateRoom={handleCreateRoom}
            handleJoinRoom={handleJoinRoom}
          />
        );
      case 'waiting':
        return (
          <WaitingRoom
            roomCode={roomCode}
            socketId={socketRef.current?.id}
            isHost={isHost}
            onCopyRoomCode={copyRoomCode}
            onShowModal={() => setShowModal(true)}
            onLeaveHive={leaveHive}
            onStartVoting={startVoting}
            onUpdateSettings={handleUpdateSettings}
          />
        );
      case 'voting':
        return (
          <VotingRoom
            roomCode={roomCode}
            displayUsers={displayUsers}
            socketId={socketRef.current?.id}
            isHost={isHost}
            showSidebar={showSidebar}
            setShowSidebar={setShowSidebar}
            formatTime={formatTime}
            allVoted={allVoted}
            myVote={myVote}
            handleCastVote={handleCastVote}
            handleVeto={handleVeto}
            messages={messages}
            chatMessage={chatMessage}
            setChatMessage={setChatMessage}
            onSendMessage={handleSendMessage}
            onCopyRoomCode={copyRoomCode}
            onShowModal={() => setShowModal(true)}
            onLeaveHive={leaveHive}
            onAddOption={handleAddOption}
            unreadCount={unreadMessages}
          />
        );
      case 'consensus':
        return (
          <ConsensusScreen
            onRestart={leaveHive}
          />
        );
      default:
        return <Homepage {...({} as any)} />;
    }
  };

  return (
    <main className="min-h-screen bg-hive-bg text-white selection:bg-hive-yellow-base selection:text-black">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-hive-yellow-base text-black px-6 py-2 rounded-full font-bold shadow-[0_0_15px_#ffdd00]"
          >
            Copied!
          </motion.div>
        )}
      </AnimatePresence>

      {renderCurrentPhase()}

      <SyncedModal
        showModal={showModal}
        setShowModal={setShowModal}
        socketId={socketRef.current?.id}
      />
    </main>
  );
}