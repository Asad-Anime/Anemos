/**
 * index.tsx - Anemos Social App Prototype
 * This single file contains the entire React application logic.
 */
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// --- CONFIGURATION ---
// PASTE THE GOOGLE APPS SCRIPT URL YOU DEPLOYED HERE
// FIX: Explicitly type SCRIPT_URL as string to prevent type inference issues.
const SCRIPT_URL: string = 'https://script.google.com/macros/s/AKfycbxNByx59I3vLrL4Qamcxa1j1hH_MI2pmTzQcyB1WBkoaw2ulWonJUhoj-BHctQPa7FzPg/exec';


// --- SVG ICONS ---
// Using functional components for SVG icons for better reusability and control over props.

const AnemosLogoIcon = ({ className = 'w-12 h-12' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" fill="url(#logo-gradient)" stroke="#E5E7EB" strokeWidth="2" />
    <path d="M66 35C66 35 52.1746 40.2388 49.5 50C46.8254 59.7612 58.5 70 58.5 70" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M72 45C72 45 58.1746 50.2388 55.5 60C52.8254 69.7612 64.5 80 64.5 80" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M58 25C58 25 44.1746 30.2388 41.5 40C38.8254 49.7612 50.5 60 50.5 60" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M50 30C50 30 36.1746 35.2388 33.5 45C30.8254 54.7612 42.5 65 42.5 65" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="logo-gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6EE7B7" />
        <stop offset="1" stopColor="#A78BFA" />
      </linearGradient>
    </defs>
  </svg>
);

const SearchIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const BellIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

const HomeIcon = ({ className = "w-7 h-7", isActive = false }: { className?: string, isActive?: boolean }) => (
    <svg className={className} fill={isActive ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const RoomsIcon = ({ className = "w-7 h-7", isActive = false }: { className?: string, isActive?: boolean }) => (
    <svg className={className} fill={isActive ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const ChatIcon = ({ className = "w-7 h-7", isActive = false }: { className?: string, isActive?: boolean }) => (
    <svg className={className} fill={isActive ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const ProfileIcon = ({ className = "w-7 h-7", isActive = false }: { className?: string, isActive?: boolean }) => (
    <svg className={className} fill={isActive ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const EchoIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 12c0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6"></path>
    <path d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4"></path>
  </svg>
);

const ShareIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8m-4-6l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const CommentIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
    </svg>
);

const SaveIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
);

const PlusIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

const LockClosedIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
    </svg>
);

const ClipboardIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a2.25 2.25 0 01-2.25 2.25h-1.5a2.25 2.25 0 01-2.25-2.25v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
    </svg>
);

const PencilIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
);

const TrashIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
);

const EllipsisVerticalIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
);

const XMarkIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

const MicrophoneIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 0v-1.5a6 6 0 00-6-6v0a6 6 0 00-6 6v1.5m6 7.5v-1.5" /></svg>
);

const MicrophoneSlashIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l-2.25 2.25M19.5 12l2.25-2.25M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m12 0v-1.5a6 6 0 0 0-6-6v0a6 6 0 0 0-6 6v1.5m6 7.5v-1.5m-6-6H6m6 0h6" /></svg>
);

const VideoCameraIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9A2.25 2.25 0 0 0 4.5 18.75Z" /></svg>
);

const VideoCameraSlashIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9A2.25 2.25 0 0 0 4.5 18.75Z M19.5 19.5 4.5 4.5" /></svg>
);

const UserMinusIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
);

const UsersIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.962A3.75 3.75 0 0 1 12 15v-2.25A3.75 3.75 0 0 1 15.75 9V6.75a3.75 3.75 0 0 1-3.75-3.75v-2.25A3.75 3.75 0 0 0 8.25 9v2.25A3.75 3.75 0 0 0 12 15.75v2.25m-8.25-5.5-2.25.005a2.25 2.25 0 0 0-2.25 2.25v1.5a2.25 2.25 0 0 0 2.25 2.25h1.5a2.25 2.25 0 0 0 2.25-2.25v-1.5a2.25 2.25 0 0 0-2.25-2.25Z" /></svg>
);

const ScreenShareIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m9 17.25 2.25 2.25m-2.25-2.25L9 15m0 2.25-2.25 2.25m2.25-2.25 2.25-2.25M15 17.25l2.25 2.25m-2.25-2.25L15 15m0 2.25-2.25 2.25m2.25-2.25 2.25-2.25M9 5.25 12 3m0 0 3 2.25M12 3v9" /></svg>
);

const PhoneIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 6.75Z" /></svg>
);

const ArrowLeftIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
);

const PaperAirplaneIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>
);

const PencilSquareIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
);

const LogoutIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>
);

const EyeIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
);

const EyeSlashIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.243 4.243L6.228 6.228" /></svg>
);

// --- REACTION ICONS ---
const AppreciateIcon = ({ className = 'w-7 h-7' }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>;
const InterestingIcon = ({ className = 'w-7 h-7' }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6M12 1a8 8 0 015.66 13.66L12 23l-5.66-8.34A8 8 0 0112 1zM12 7v6"></path><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;
const InspiredIcon = ({ className = 'w-7 h-7' }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.35 7.16h7.65l-6.18 4.48 2.36 7.16L12 16.32l-6.18 4.48 2.36-7.16-6.18-4.48h7.65L12 2z"></path></svg>;

// --- DATA & TYPES ---

// Base user profile
type UserProfile = {
    id: string;
    username: string; // The full username, e.g., aria@anemos.com
    password?: string; // Only for mock data, don't use in real app state
    name: string; // The display name, e.g., Aria
    avatar: string;
    bio: string;
};

// Feed post structure
type FeedPost = {
    id: number;
    user: { name: string; avatar: string; };
    timestamp: string;
    location: string;
    context: string;
    media: string;
    initialEchos: number;
    comments: number;
    shares: number;
};

// Chat types
type Message = {
    id: string;
    text: string;
    senderId: string;
    timestamp: string;
};

type ChatConversation = {
    id: string;
    participant: { id: string; username: string; avatar: string; isOnline: boolean; };
    messages: Message[];
    unreadCount: number;
};

// Room-related types
type RoomUser = {
    username: string;
    avatar: string;
    isMuted?: boolean;
    isVideoOff?: boolean;
};
type JoinRequest = {
    user: RoomUser;
    id: string;
};
type Room = {
    id: string;
    name: string;
    tag: string;
    privacy: 'public' | 'private';
    host: string;
    members: RoomUser[];
    joinRequests: JoinRequest[];
    code: string;
};
type View = 'home' | 'profile' | 'edit-profile' | 'rooms' | 'chat' | 'create-room' | 'live-room' | 'edit-room';

// Combined state for persistence
type AppState = {
    users: UserProfile[];
    rooms: Room[];
    chats: ChatConversation[];
};

// --- CHAT CONTEXT & PROVIDER ---
// Using React Context for a frontend-only global state management for chats.
type ChatContextType = {
    chats: ChatConversation[];
    getChatById: (chatId: string) => ChatConversation | undefined;
    sendMessage: (chatId: string, text: string) => void;
    markChatAsRead: (chatId: string) => void;
};

const ChatContext = React.createContext<ChatContextType | undefined>(undefined);

const useChat = () => {
    const context = React.useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};

const ChatProvider = ({
    chats,
    setChats,
    children,
    currentUser
}: {
    chats: ChatConversation[],
    setChats: React.Dispatch<React.SetStateAction<ChatConversation[]>>,
    children: React.ReactNode,
    currentUser: UserProfile | null
}) => {
    const getChatById = useCallback((chatId: string) => {
        return chats.find(c => c.id === chatId);
    }, [chats]);

    const sendMessage = useCallback((chatId: string, text: string) => {
        if (!currentUser) return;
        const newMessage: Message = {
            id: `msg_${Date.now()}`,
            text,
            senderId: currentUser.id,
            timestamp: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
        };

        setChats(prevChats => prevChats.map(chat =>
            chat.id === chatId
                ? { ...chat, messages: [...chat.messages, newMessage] }
                : chat
        ));
    }, [currentUser, setChats]);

    const markChatAsRead = useCallback((chatId: string) => {
        setChats(prevChats => prevChats.map(chat =>
            (chat.id === chatId && chat.unreadCount > 0) ? { ...chat, unreadCount: 0 } : chat
        ));
    }, [setChats]);

    const value = useMemo(() => ({
        chats,
        getChatById,
        sendMessage,
        markChatAsRead,
    }), [chats, getChatById, sendMessage, markChatAsRead]);


    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};


// --- MOCK DATA (for initial state) ---

const mockUsers: UserProfile[] = [
    {
        id: 'user_aria',
        username: 'aria@anemos.com',
        password: 'password123',
        name: 'Aria',
        avatar: 'https://picsum.photos/id/237/200/200',
        bio: 'Wandering through digital winds and analog worlds. Capturing moments, sharing stories. 🌬️✨',
    },
    {
        id: 'user_leo',
        username: 'leo@anemos.com',
        password: 'password123',
        name: 'Leo',
        avatar: 'https://picsum.photos/id/338/100/100',
        bio: 'Music producer and indie enthusiast.',
    }
];

const storiesData = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    user: `User ${i + 1}`,
    avatar: `https://picsum.photos/id/10${i + 1}/100/100`,
    isLive: i % 3 === 0,
}));

const feedData: FeedPost[] = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    user: { name: `User ${i + 1}`, avatar: `https://picsum.photos/id/1${i + 2}5/100/100` },
    timestamp: `${i + 2}h ago`,
    location: 'Milan',
    context: i % 2 === 0 ? '#FotografiaUrbana' : '#MusicaIndie',
    media: `https://picsum.photos/id/10${i + 4}/600/400`,
    initialEchos: 54 + i * 3,
    comments: 12 + i * 2,
    shares: 3 + i,
}));

const connectionData = {
    user: 'Leo',
    avatar: 'https://picsum.photos/id/338/100/100',
    reason: 'Segue la Corrente #MusicaIndie',
};

const initialRoomsData: Room[] = [
    { id: 'r1', name: "Chiacchiere Notturne 🌙", tag: "#Relax", members: [
        {username: 'Chris Walker', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200', isMuted: false, isVideoOff: false}, 
        {username: 'Jason Carter', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', isMuted: true, isVideoOff: false}, 
        {username: 'Josh Hassan', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', isMuted: true, isVideoOff: true}, 
        {username: 'Greta Collins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', isMuted: true, isVideoOff: false}, 
        {username: 'Sasha Lee', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200', isMuted: true, isVideoOff: true}
    ], privacy: 'public', host: 'Chris Walker', joinRequests: [], code: '111111'},
    { id: 'r2', name: "Progetti Indie Dev", tag: "#Gaming", members: [], privacy: 'public', host: 'System', joinRequests: [], code: '222222'},
    { id: 'r3', name: "Amanti della Musica Lo-fi", tag: "#Musica", members: [], privacy: 'private', host: 'System', joinRequests: [], code: '333333'},
    { id: 'r4', name: "Viaggiatori con lo Zaino", tag: "#Viaggi", members: [], privacy: 'public', host: 'System', joinRequests: [], code: '444444'},
];

const initialChatsData: ChatConversation[] = [
    {
        id: 'chat1',
        participant: { id: 'user_leo', username: 'Leo', avatar: 'https://picsum.photos/id/338/100/100', isOnline: true },
        unreadCount: 2,
        messages: [
            { id: 'm1', text: 'Hey, hai visto l\'ultimo post su #MusicaIndie?', senderId: 'user_leo', timestamp: '10:40' },
            { id: 'm2', text: 'Mi è piaciuto un sacco!', senderId: 'user_leo', timestamp: '10:41' },
            { id: 'm3', text: 'Ciao! Non ancora, vado a vedere subito!', senderId: 'user_aria', timestamp: '10:42' },
        ],
    },
    {
        id: 'chat2',
        participant: { id: 'user_sasha', username: 'Sasha Lee', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200', isOnline: false },
        unreadCount: 0,
        messages: [
            { id: 'm4', text: 'Perfetto, ci vediamo dopo allora. A più tardi!', senderId: 'user_aria', timestamp: 'Ieri' },
        ],
    },
     {
        id: 'chat3',
        participant: { id: 'user_greta', username: 'Greta Collins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', isOnline: true },
        unreadCount: 0,
        messages: [
            { id: 'm5', text: 'La riunione per il progetto è confermata per domani alle 15:00.', senderId: 'user_greta', timestamp: '2g fa' },
        ],
    },
];

// --- API SERVICE ---
const api = {
    fetchData: async (): Promise<AppState | null> => {
        if (!SCRIPT_URL || !SCRIPT_URL.startsWith('https')) {
            console.warn('Google Apps Script URL is not set. Using local mock data.');
            return null;
        }
        try {
            const response = await fetch(SCRIPT_URL);
            if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
            const text = await response.text();
            if (!text) return null; // Handle empty response for first run
            const data = JSON.parse(text);
            // Check for a key property to validate the data
            if (data && data.users) {
                return data;
            }
            return null;
        } catch (error) {
            console.error('Failed to fetch data:', error);
            return null;
        }
    },
    saveData: async (state: AppState) => {
         if (!SCRIPT_URL || !SCRIPT_URL.startsWith('https')) return;
         try {
            // CAVEAT: Persisting passwords in plaintext like this is insecure and should
            // never be done in a production application. This is for prototype purposes only,
            // as requested by the user's data schema.
            await fetch(SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8', // Send as plain text to avoid CORS preflight issues
                },
                body: JSON.stringify(state),
            });
         } catch (error) {
            console.error('Failed to save data:', error);
         }
    }
};

// --- APP COMPONENTS ---

const SplashScreen = () => (
    <div className="fixed inset-0 bg-sky-50 z-50 flex flex-col items-center justify-center animate-fadeOut">
        <div className="animate-fadeInPulse">
            <AnemosLogoIcon className="w-24 h-24" />
        </div>
        <h1 className="text-4xl font-bold text-slate-700 mt-4 tracking-wider animate-fadeIn animate-delay-400">Anemos</h1>
    </div>
);

const Header = ({ onLogoClick }: { onLogoClick: () => void }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const handleClick = () => { setIsAnimating(true); onLogoClick(); };
    return (
        <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-40 shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className={`flex items-center gap-2 cursor-pointer transition-transform duration-300 ${isAnimating ? 'scale-110 -rotate-6' : ''}`} onClick={handleClick} onAnimationEnd={() => setIsAnimating(false)}>
                    <AnemosLogoIcon className="w-8 h-8" />
                    <span className="text-xl font-bold text-slate-800">Anemos</span>
                </div>
                <div className="flex items-center gap-4 text-slate-600">
                    <button aria-label="Search"><SearchIcon className="w-6 h-6" /></button>
                    <button aria-label="Notifications" className="relative">
                        <BellIcon className="w-6 h-6" />
                        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-teal-400 ring-2 ring-white" />
                    </button>
                </div>
            </div>
        </header>
    );
};

const Stories = () => (
    <div className="bg-white py-3 border-b border-slate-200">
        <div className="container mx-auto pl-4">
            <div className="flex gap-4 overflow-x-auto no-scrollbar">
                {storiesData.map(story => (
                    <div key={story.id} className="flex-shrink-0 w-20 flex flex-col items-center gap-1.5 cursor-pointer group">
                        <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-teal-400 to-purple-400">
                            <img className="w-16 h-16 rounded-full border-2 border-white" src={story.avatar} alt={story.user} />
                            {story.isLive && (<span className="absolute bottom-0 right-0 text-xs bg-red-500 text-white font-semibold px-1.5 py-0.5 rounded-md border-2 border-white">LIVE</span>)}
                        </div>
                        <span className="text-xs text-slate-600 group-hover:text-slate-900">{story.user}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const PostReactions = ({ onSelectReaction, closeMenu }: { onSelectReaction: (reaction: string) => void; closeMenu: () => void; }) => {
  const reactions = [
    { name: 'Apprezzo', icon: AppreciateIcon, color: 'text-pink-500' },
    { name: 'Interessante', icon: InterestingIcon, color: 'text-yellow-500' },
    { name: 'Ispirato', icon: InspiredIcon, color: 'text-blue-500' },
  ];
  return (
    <div className="absolute bottom-full mb-2 left-0 bg-white rounded-full shadow-lg p-2 flex gap-3 z-20 animate-fadeInUp">
      {reactions.map(reaction => (
        <button key={reaction.name} onClick={() => { onSelectReaction(reaction.name); closeMenu(); }} className={`p-1.5 rounded-full hover:bg-slate-100 transition-transform transform hover:scale-125 ${reaction.color}`}>
          <reaction.icon />
        </button>
      ))}
    </div>
  );
};

const Post = ({ post }: { post: FeedPost }) => {
    const [showReactions, setShowReactions] = useState(false);
    const [userReaction, setUserReaction] = useState<string | null>(null);
    const [echoCount, setEchoCount] = useState(post.initialEchos);
    const handleEchoClick = () => setShowReactions(prev => !prev);
    const handleReactionSelect = (reaction: string) => {
        if (userReaction === reaction) { setUserReaction(null); setEchoCount(prev => prev - 1); }
        else if (userReaction && userReaction !== reaction) { setUserReaction(reaction); }
        else { setUserReaction(reaction); setEchoCount(prev => prev + 1); }
    };
    const hasReacted = userReaction !== null;
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => { if (!(event.target as HTMLElement).closest('.reactions-container')) setShowReactions(false); };
        if (showReactions) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showReactions]);

    return (
        <article className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-4 flex items-center gap-3">
                <img className="w-10 h-10 rounded-full" src={post.user.avatar} alt={post.user.name} />
                <div>
                    <p className="font-semibold text-slate-800">{post.user.name} <span className="font-normal text-slate-500">in</span> <span className="text-teal-600 font-medium">{post.context}</span></p>
                    <p className="text-xs text-slate-500">{post.timestamp} &middot; {post.location}</p>
                </div>
            </div>
            <img className="w-full h-auto" src={post.media} alt="Post media" />
            <div className="p-4">
                <div className="flex items-center justify-between text-slate-600">
                    <div className="flex items-center gap-5">
                       <div className="relative reactions-container">
                           {showReactions && <PostReactions onSelectReaction={handleReactionSelect} closeMenu={() => setShowReactions(false)} />}
                           <button onClick={handleEchoClick} className={`flex items-center gap-1.5 group transition-colors ${hasReacted ? 'text-teal-500' : 'hover:text-teal-500'}`}>
                               <EchoIcon className="w-7 h-7 group-hover:scale-110 transition-transform" />
                               <span className="font-semibold text-sm">{echoCount} Echi</span>
                           </button>
                       </div>
                        <button className="flex items-center gap-1.5 group hover:text-teal-500 transition-colors"><CommentIcon className="w-7 h-7 group-hover:scale-110 transition-transform" /><span className="font-semibold text-sm">{post.comments} Risposte</span></button>
                        <button className="flex items-center gap-1.5 group hover:text-teal-500 transition-colors"><ShareIcon className="w-7 h-7 group-hover:scale-110 transition-transform" /><span className="font-semibold text-sm">{post.shares}</span></button>
                    </div>
                    <button className="group hover:text-teal-500 transition-colors"><SaveIcon className="w-7 h-7 group-hover:scale-110 transition-transform" /></button>
                </div>
            </div>
        </article>
    );
};

const ConnectionCard = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <h3 className="font-bold text-slate-800 text-lg mb-3">Venti di Connessione</h3>
        <div className="flex items-center gap-3">
            <img className="w-12 h-12 rounded-full" src={connectionData.avatar} alt={connectionData.user} />
            <div className="flex-grow">
                <p className="font-semibold text-slate-800">{connectionData.user}</p>
                <p className="text-sm text-slate-500">{connectionData.reason}</p>
            </div>
            <button className="bg-teal-400/20 text-teal-700 font-semibold px-4 py-1.5 rounded-full text-sm hover:bg-teal-400/40 transition">Segui il Soffio</button>
        </div>
    </div>
);

const Feed = () => (
    <main className="container mx-auto p-4 flex flex-col gap-4">
        {feedData.map((post, index) => (<React.Fragment key={post.id}><Post post={post} />{index === 2 && <ConnectionCard />}</React.Fragment>))}
    </main>
);

const ProfilePage = ({ user, onEdit, onLogout }: { user: UserProfile; onEdit: () => void; onLogout: () => void; }) => (
    <div className="container mx-auto p-4 animate-fadeIn">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                <img className="w-24 h-24 sm:w-32 sm:h-32 rounded-full ring-4 ring-white shadow-md" src={user.avatar} alt={user.name} />
                <div className="text-center sm:text-left flex-grow">
                    <h2 className="text-3xl font-bold text-slate-800">{user.name}</h2>
                    <p className="text-slate-400 text-sm -mt-1">{user.username}</p>
                    <p className="text-slate-600 mt-2">{user.bio}</p>
                    <div className="mt-4 flex flex-wrap gap-3 justify-center sm:justify-start">
                      <button onClick={onEdit} className="bg-slate-100 text-slate-700 font-semibold px-5 py-2 rounded-lg text-sm hover:bg-slate-200 transition">Modifica Profilo</button>
                      <button onClick={onLogout} className="bg-red-50 text-red-600 font-semibold px-5 py-2 rounded-lg text-sm hover:bg-red-100 transition flex items-center gap-2">
                        <LogoutIcon className="w-5 h-5" /> Logout
                      </button>
                    </div>
                </div>
            </div>
        </div>
        <div className="mt-6">
             <h3 className="text-xl font-bold text-slate-800 mb-4 px-2">I Miei Soffi Recenti</h3>
             <div className="grid grid-cols-3 gap-1">
                 {feedData.slice(0, 6).map(post => (<div key={post.id} className="aspect-square bg-slate-200 rounded-md overflow-hidden"><img src={post.media} alt="Soffio thumbnail" className="w-full h-full object-cover" /></div>))}
             </div>
        </div>
    </div>
);

const EditProfilePage = ({ user, onSave, onCancel }: { user: UserProfile; onSave: (newUser: UserProfile) => void; onCancel: () => void; }) => {
    const [formData, setFormData] = useState(user);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => setFormData(prev => ({ ...prev, avatar: reader.result as string }));
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(formData); };

    return (
        <div className="container mx-auto p-4 animate-fadeIn">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">Modifica Profilo</h2>
                <div className="flex flex-col items-center gap-4 mb-8">
                    <img src={formData.avatar} alt="Profile preview" className="w-32 h-32 rounded-full object-cover ring-4 ring-teal-400/20 shadow-lg" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-slate-100 text-slate-700 font-semibold px-5 py-2 rounded-lg text-sm hover:bg-slate-200 transition">Cambia foto profilo</button>
                    <input ref={fileInputRef} type="file" id="avatar" name="avatar" accept="image/*" onChange={handleFileChange} className="hidden" />
                </div>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500" />
                    </div>
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                        <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={4} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500" />
                    </div>
                </div>
                <div className="mt-8 flex items-center justify-end gap-3">
                    <button type="button" onClick={onCancel} className="bg-slate-100 text-slate-700 font-semibold px-5 py-2 rounded-lg text-sm hover:bg-slate-200 transition">Annulla</button>
                    <button type="submit" className="bg-teal-500 text-white font-semibold px-5 py-2 rounded-lg text-sm hover:bg-teal-600 transition">Salva Modifiche</button>
                </div>
            </form>
        </div>
    );
};

const CreateRoomPage = ({ onCancel, onCreate }: { onCancel: () => void; onCreate: (name: string, privacy: 'public' | 'private') => void }) => {
    const [name, setName] = useState('');
    const [privacy, setPrivacy] = useState<'public' | 'private'>('public');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onCreate(name.trim(), privacy);
        }
    };
    return (
        <div className="container mx-auto p-4 animate-fadeIn">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 max-w-lg mx-auto">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Crea una Nuova Stanza</h2>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="roomName" className="block text-sm font-medium text-slate-700 mb-1">Nome della Stanza</label>
                        <input type="text" id="roomName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Es. Amanti del Jazz" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Visibilità</label>
                        <div className="flex gap-4">
                            <button type="button" onClick={() => setPrivacy('public')} className={`flex-1 p-3 rounded-lg border-2 transition text-left ${privacy === 'public' ? 'border-teal-500 bg-teal-50' : 'border-slate-300 bg-white'}`}>
                                <h3 className="font-semibold text-slate-800">Pubblica</h3>
                                <p className="text-xs text-slate-500">Chiunque può vedere e unirsi a questa stanza.</p>
                            </button>
                            <button type="button" onClick={() => setPrivacy('private')} className={`flex-1 p-3 rounded-lg border-2 transition text-left ${privacy === 'private' ? 'border-teal-500 bg-teal-50' : 'border-slate-300 bg-white'}`}>
                                <h3 className="font-semibold text-slate-800">Privata</h3>
                                <p className="text-xs text-slate-500">Solo le persone invitate o approvate possono unirsi.</p>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-8 flex items-center justify-end gap-3">
                    <button type="button" onClick={onCancel} className="bg-slate-100 text-slate-700 font-semibold px-5 py-2 rounded-lg text-sm hover:bg-slate-200 transition">Annulla</button>
                    <button type="submit" className="bg-teal-500 text-white font-semibold px-5 py-2 rounded-lg text-sm hover:bg-teal-600 transition flex items-center gap-2 disabled:bg-teal-300" disabled={!name.trim()}><PlusIcon className="w-5 h-5" />Crea Stanza</button>
                </div>
            </form>
        </div>
    );
};

const EditRoomPage = ({ room, onCancel, onSave }: { room: Room; onCancel: () => void; onSave: (updatedRoom: Room) => void }) => {
    const [name, setName] = useState(room.name);
    const [privacy, setPrivacy] = useState<'public' | 'private'>(room.privacy);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSave({ ...room, name: name.trim(), privacy });
        }
    };
    return (
        <div className="container mx-auto p-4 animate-fadeIn">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 max-w-lg mx-auto">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Modifica Stanza</h2>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="roomName" className="block text-sm font-medium text-slate-700 mb-1">Nome della Stanza</label>
                        <input type="text" id="roomName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Es. Amanti del Jazz" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Visibilità</label>
                        <div className="flex gap-4">
                            <button type="button" onClick={() => setPrivacy('public')} className={`flex-1 p-3 rounded-lg border-2 transition text-left ${privacy === 'public' ? 'border-teal-500 bg-teal-50' : 'border-slate-300 bg-white'}`}>
                                <h3 className="font-semibold text-slate-800">Pubblica</h3>
                                <p className="text-xs text-slate-500">Chiunque può vedere e unirsi a questa stanza.</p>
                            </button>
                            <button type="button" onClick={() => setPrivacy('private')} className={`flex-1 p-3 rounded-lg border-2 transition text-left ${privacy === 'private' ? 'border-teal-500 bg-teal-50' : 'border-slate-300 bg-white'}`}>
                                <h3 className="font-semibold text-slate-800">Privata</h3>
                                <p className="text-xs text-slate-500">Solo le persone invitate o approvate possono unirsi.</p>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-8 flex items-center justify-end gap-3">
                    <button type="button" onClick={onCancel} className="bg-slate-100 text-slate-700 font-semibold px-5 py-2 rounded-lg text-sm hover:bg-slate-200 transition">Annulla</button>
                    <button type="submit" className="bg-teal-500 text-white font-semibold px-5 py-2 rounded-lg text-sm hover:bg-teal-600 transition flex items-center gap-2 disabled:bg-teal-300" disabled={!name.trim()}><SaveIcon className="w-5 h-5" />Salva Modifiche</button>
                </div>
            </form>
        </div>
    );
};

const ParticipantCard = ({ member, isHost, isSpeaking }: { member: RoomUser; isHost: boolean; isSpeaking?: boolean; }) => {
    const cardClasses = `
        relative aspect-video rounded-xl overflow-hidden shadow-lg 
        bg-slate-800 text-white flex items-center justify-center
        transition-all duration-300 w-full h-full
        ${isSpeaking ? 'ring-4 ring-teal-400 ring-offset-4 ring-offset-black' : 'ring-2 ring-slate-700'}
    `;

    return (
        <div className={cardClasses}>
            {member.isVideoOff ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800/50">
                    <div className="relative">
                        <img 
                            src={member.avatar} 
                            alt={member.username} 
                            className="w-24 h-24 rounded-full object-cover opacity-50" 
                        />
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                            <VideoCameraSlashIcon className="w-8 h-8 text-white/70" />
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <img src={member.avatar} alt={member.username} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                </>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm drop-shadow-md">{member.username}</span>
                    {isHost && <span className="text-xs bg-purple-500/80 text-white font-semibold px-2 py-0.5 rounded-full">Host</span>}
                </div>
                <div className={`p-1.5 rounded-full flex items-center justify-center ${member.isMuted ? 'bg-red-500/90' : 'bg-white/20'}`}>
                    {member.isMuted 
                        ? <MicrophoneSlashIcon className="w-4 h-4 text-white" /> 
                        : <MicrophoneIcon className="w-4 h-4 text-white" />
                    }
                </div>
            </div>
        </div>
    );
};

const ControlBar = ({ onLeave, onToggleMyMute, onToggleMyVideo, isMuted, isVideoOff, onToggleParticipantsPanel, isParticipantsPanelOpen }: { onLeave: () => void; onToggleMyMute: () => void; onToggleMyVideo: () => void; isMuted?: boolean; isVideoOff?: boolean; onToggleParticipantsPanel: () => void; isParticipantsPanelOpen: boolean; }) => (
    <div className="bg-slate-800/80 backdrop-blur-md rounded-full flex items-center gap-3 p-3 shadow-2xl">
        <button onClick={onToggleMyMute} className={`p-3 rounded-full transition-colors ${isMuted ? 'bg-red-500 text-white' : 'bg-slate-700/80 hover:bg-slate-600'}`} aria-label={isMuted ? 'Smuta' : 'Muta'}>
            {isMuted ? <MicrophoneSlashIcon className="w-6 h-6" /> : <MicrophoneIcon className="w-6 h-6" />}
        </button>
        <button onClick={onToggleMyVideo} className={`p-3 rounded-full transition-colors ${isVideoOff ? 'bg-red-500 text-white' : 'bg-slate-700/80 hover:bg-slate-600'}`} aria-label={isVideoOff ? 'Attiva video' : 'Disattiva video'}>
            {isVideoOff ? <VideoCameraSlashIcon className="w-6 h-6" /> : <VideoCameraIcon className="w-6 h-6" />}
        </button>
        <div className="w-px h-8 bg-slate-600 mx-2"></div>
        <button className="p-3 rounded-full bg-slate-700/80 hover:bg-slate-600 transition-colors" aria-label="Condividi schermo">
            <ScreenShareIcon className="w-6 h-6 text-teal-300" />
        </button>
        <button onClick={onToggleParticipantsPanel} className={`p-3 rounded-full transition-colors ${isParticipantsPanelOpen ? 'bg-teal-500/50' : 'bg-slate-700/80'} hover:bg-slate-600`} aria-label="Mostra partecipanti">
            <UsersIcon className="w-6 h-6 text-teal-300" />
        </button>
        <div className="w-px h-8 bg-slate-600 mx-2"></div>
        <button onClick={onLeave} className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors" aria-label="Termina chiamata">
            <PhoneIcon className="w-6 h-6" />
        </button>
    </div>
);

const JoinRequestsPanel = ({ requests, onAccept, onDecline }: { requests: JoinRequest[]; onAccept: (id: string) => void; onDecline: (id: string) => void; }) => (
    <div className="absolute bottom-24 right-4 w-80 bg-slate-800/80 backdrop-blur-md rounded-xl shadow-lg z-20 animate-fadeInUp">
        <div className="p-3 border-b border-slate-700">
            <h3 className="font-bold text-white text-sm">Richieste di Ingresso ({requests.length})</h3>
        </div>
        <div className="p-2 max-h-48 overflow-y-auto space-y-2 no-scrollbar">
            {requests.map(req => (
                <div key={req.id} className="bg-slate-700/50 p-2 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <img src={req.user.avatar} alt={req.user.username} className="w-8 h-8 rounded-full flex-shrink-0" />
                        <p className="font-semibold text-white text-xs truncate">{req.user.username}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => onDecline(req.id)} className="px-2 py-1 text-xs font-semibold text-slate-300 bg-slate-600 rounded-md hover:bg-slate-500">Rifiuta</button>
                        <button onClick={() => onAccept(req.id)} className="px-2 py-1 text-xs font-semibold text-white bg-teal-500 rounded-md hover:bg-teal-600">Accetta</button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const ParticipantsPanel = ({ isOpen, onClose, room, currentUser, onToggleMute, onToggleVideo, onRemoveParticipant }: { isOpen: boolean; onClose: () => void; room: Room; currentUser: UserProfile; onToggleMute: (username: string) => void; onToggleVideo: (username: string) => void; onRemoveParticipant: (username: string) => void; }) => {
    const isCurrentUserHost = room.host === currentUser.name;

    return (
        <div className={`fixed inset-0 z-30 transition-opacity duration-300 ${isOpen ? 'bg-black/50' : 'bg-transparent pointer-events-none'}`} onClick={onClose}>
            <div 
                className={`fixed top-0 right-0 h-full w-full max-w-sm bg-slate-800 shadow-2xl text-white transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                    <h3 className="font-bold text-lg">Partecipanti ({room.members.length})</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-700"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <ul className="p-2 space-y-1 overflow-y-auto h-[calc(100%-65px)] no-scrollbar">
                    {room.members.map(member => (
                        <li key={member.username} className="flex items-center justify-between p-2 rounded-lg group hover:bg-slate-700/50">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <img src={member.avatar} alt={member.username} className="w-10 h-10 rounded-full flex-shrink-0" />
                                <div className="truncate">
                                    <p className="font-semibold truncate">{member.username}</p>
                                    {room.host === member.username && <p className="text-xs text-purple-400">Host</p>}
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400 flex-shrink-0">
                                {member.isMuted && <MicrophoneSlashIcon className="w-5 h-5" />}
                                {member.isVideoOff && <VideoCameraSlashIcon className="w-5 h-5" />}
                                {isCurrentUserHost && member.username !== currentUser.name && (
                                    <div className="hidden group-hover:flex items-center gap-1">
                                        <button onClick={() => onToggleMute(member.username)} className="p-2 rounded-full hover:bg-slate-600 text-slate-300" title={member.isMuted ? 'Smuta' : 'Muta'}>
                                            <MicrophoneIcon className="w-5 h-5"/>
                                        </button>
                                        <button onClick={() => onToggleVideo(member.username)} className="p-2 rounded-full hover:bg-slate-600 text-slate-300" title={member.isVideoOff ? 'Attiva Video' : 'Disattiva Video'}>
                                            <VideoCameraIcon className="w-5 h-5"/>
                                        </button>
                                        <button onClick={() => onRemoveParticipant(member.username)} className="p-2 rounded-full hover:bg-red-500/50 text-red-400 hover:text-red-300" title="Rimuovi">
                                            <UserMinusIcon className="w-5 h-5"/>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const LiveRoomPage = ({ room, currentUser, onLeave, onAcceptRequest, onDeclineRequest, onRemoveParticipant, onToggleMute, onToggleVideo, }: { room: Room; currentUser: UserProfile; onLeave: () => void; onAcceptRequest: (reqId: string) => void; onDeclineRequest: (reqId:string) => void; onRemoveParticipant: (username: string) => void; onToggleMute: (username: string) => void; onToggleVideo: (username: string) => void; }) => {
    const isHost = room.host === currentUser.name;
    const [isParticipantsPanelOpen, setIsParticipantsPanelOpen] = useState(false);
    
    const currentUserInRoom = room.members.find(m => m.username === currentUser.name);

    const handleToggleMyMute = () => onToggleMute(currentUser.name);
    const handleToggleMyVideo = () => onToggleVideo(currentUser.name);
    
    const memberCount = room.members.length;
    let cardContainerClasses = '';

    if (memberCount === 1) {
        cardContainerClasses = 'w-full max-w-4xl h-auto';
    } else if (memberCount === 2) {
        cardContainerClasses = 'w-full sm:w-[48%] max-w-2xl h-auto';
    } else if (memberCount <= 4) {
        cardContainerClasses = 'w-full sm:w-[48%] max-w-2xl h-auto';
    } else if (memberCount <= 6) {
        cardContainerClasses = 'w-full sm:w-[48%] md:w-[31%] max-w-lg h-auto';
    } else {
        cardContainerClasses = 'w-full sm:w-[48%] md:w-[31%] lg:w-[23%] max-w-md h-auto';
    }

    return (
        <div className="fixed inset-0 bg-black text-white flex flex-col font-sans animate-fadeIn">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-purple-500 z-20"></div>

            <main className="flex-1 flex flex-wrap justify-center items-center content-center gap-6 p-6 overflow-y-auto pb-24">
                 {room.members.map(member => (
                    <div key={member.username} className={cardContainerClasses}>
                        <ParticipantCard 
                            member={member} 
                            isHost={room.host === member.username}
                            isSpeaking={!member.isMuted}
                        />
                    </div>
                 ))}
            </main>

            {isHost && room.joinRequests.length > 0 && (
                <JoinRequestsPanel requests={room.joinRequests} onAccept={onAcceptRequest} onDecline={onDeclineRequest} />
            )}

            <ParticipantsPanel 
                isOpen={isParticipantsPanelOpen}
                onClose={() => setIsParticipantsPanelOpen(false)}
                room={room}
                currentUser={currentUser}
                onToggleMute={onToggleMute}
                onToggleVideo={onToggleVideo}
                onRemoveParticipant={onRemoveParticipant}
            />

            <footer className="absolute bottom-0 left-0 right-0 p-4 flex justify-center z-10">
                <ControlBar 
                    onLeave={onLeave} 
                    onToggleMyMute={handleToggleMyMute}
                    onToggleMyVideo={handleToggleMyVideo}
                    isMuted={currentUserInRoom?.isMuted}
                    isVideoOff={currentUserInRoom?.isVideoOff}
                    onToggleParticipantsPanel={() => setIsParticipantsPanelOpen(prev => !prev)}
                    isParticipantsPanelOpen={isParticipantsPanelOpen}
                />
            </footer>
        </div>
    );
};

// FIX: Refactor RoomCard props into a separate type alias to resolve assignment errors.
type RoomCardProps = {
    room: Room;
    currentUser: UserProfile;
    onJoinRoom: (room: Room) => void;
    onNavigateToEdit: (room: Room) => void;
    onDeleteRoom: (roomId: string) => void;
};
// FIX: Refactored RoomCard into a standalone component to fix TypeScript errors and improve performance.
// FIX: Use React.FC to correctly type a functional component, which resolves errors related to the 'key' prop.
const RoomCard: React.FC<RoomCardProps> = ({ room, currentUser, onJoinRoom, onNavigateToEdit, onDeleteRoom }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
        <div>
           <div className="flex justify-between items-start">
               <div>
                   <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{room.tag}</span>
                   <h3 className="font-bold text-slate-800 mt-2 flex items-center gap-2">{room.name} {room.privacy === 'private' && <LockClosedIcon className="text-slate-400" />}</h3>
               </div>
               {room.host !== currentUser.name && <button onClick={() => onJoinRoom(room)} className="bg-teal-500 text-white font-semibold px-4 py-1.5 rounded-full text-sm hover:bg-teal-600 transition">Entra</button>}
               {room.host === currentUser.name && (
                   <div className="flex items-center gap-2">
                        <button onClick={() => onJoinRoom(room)} className="bg-teal-500 text-white font-semibold px-4 py-1.5 rounded-full text-sm hover:bg-teal-600 transition">Entra</button>
                        <button onClick={() => onNavigateToEdit(room)} aria-label="Modifica stanza" className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"><PencilIcon /></button>
                        <button onClick={() => onDeleteRoom(room.id)} aria-label="Elimina stanza" className="p-1.5 rounded-full hover:bg-red-100 text-red-500"><TrashIcon /></button>
                   </div>
               )}
           </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
            <div className="flex -space-x-2">
               {room.members.slice(0,3).map(member => (
                   <img key={member.username} className="w-8 h-8 rounded-full border-2 border-white" src={member.avatar} alt={member.username} />
               ))}
            </div>
           {room.members.length > 0 && <span className="text-sm text-slate-500">{room.members.length} {room.members.length > 1 ? 'partecipanti' : 'partecipante'}</span>}
           {room.members.length === 0 && <span className="text-sm text-slate-500">Nessuno qui... ancora!</span>}
        </div>
    </div>
);

const RoomsPage = ({ rooms, currentUser, onNavigateToCreate, onJoinByCode, onJoinRoom, onNavigateToEdit, onDeleteRoom }: { rooms: Room[]; currentUser: UserProfile; onNavigateToCreate: () => void; onJoinByCode: (code: string) => void; onJoinRoom: (room: Room) => void; onNavigateToEdit: (room: Room) => void; onDeleteRoom: (roomId: string) => void; }) => {
    const [code, setCode] = useState('');
    const handleJoinSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(code.trim()) onJoinByCode(code.trim());
    };

    const myRooms = rooms.filter(r => r.host === currentUser.name);
    const otherRooms = rooms.filter(r => r.host !== currentUser.name);

    return (
        <div className="container mx-auto p-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                <h2 className="text-2xl font-bold text-slate-800">Stanze</h2>
                <button onClick={onNavigateToCreate} className="w-full sm:w-auto bg-teal-500 text-white font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-teal-600 transition flex items-center justify-center gap-2">
                    <PlusIcon className="w-5 h-5" />
                    Crea una Stanza
                </button>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
                <h3 className="font-bold text-slate-800 mb-2">Entra con un Codice</h3>
                <form onSubmit={handleJoinSubmit} className="flex gap-2">
                    <input value={code} onChange={e => setCode(e.target.value)} type="text" placeholder="_ _ _ _ _ _" maxLength={6} className="flex-grow p-2 bg-slate-100 border border-slate-200 rounded-md text-center font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    <button type="submit" className="bg-slate-800 text-white font-semibold px-6 py-2 rounded-lg text-sm hover:bg-slate-900 transition disabled:bg-slate-400" disabled={!code.trim()}>Entra</button>
                </form>
            </div>
            
            {myRooms.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Le tue Stanze Create</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* FIX: Pass all required props to the standalone RoomCard component. */}
                        {myRooms.map(room => <RoomCard key={room.id} room={room} currentUser={currentUser} onJoinRoom={onJoinRoom} onNavigateToEdit={onNavigateToEdit} onDeleteRoom={onDeleteRoom} />)}
                    </div>
                </div>
            )}
            
            <div>
                 <h3 className="text-xl font-bold text-slate-800 mb-4">Stanze Live Attive</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* FIX: Pass all required props to the standalone RoomCard component. */}
                    {otherRooms.map(room => <RoomCard key={room.id} room={room} currentUser={currentUser} onJoinRoom={onJoinRoom} onNavigateToEdit={onNavigateToEdit} onDeleteRoom={onDeleteRoom} />)}
                </div>
                {otherRooms.length === 0 && <p className="text-slate-500 text-center py-4">Nessun'altra stanza attiva al momento.</p>}
            </div>
        </div>
    );
};

const ChatListPage = ({ onSelectChat }: { onSelectChat: (chatId: string) => void }) => {
    const { chats } = useChat();
    const [searchTerm, setSearchTerm] = useState('');
    const filteredChats = chats.filter(chat => chat.participant.username.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return (
        <div className="flex flex-col h-full animate-fadeIn">
            <div className="sticky top-16 bg-sky-50/80 backdrop-blur-sm z-30 px-4 pt-4 pb-2">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-slate-800">Soffi</h2>
                    <button className="text-slate-600 hover:text-teal-500">
                        <PencilSquareIcon className="w-7 h-7" />
                    </button>
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="w-5 h-5 text-slate-400" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Cerca tra i tuoi soffi..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                <ul className="divide-y divide-slate-200">
                    {filteredChats.map(chat => {
                        const lastMessage = chat.messages[chat.messages.length - 1];
                        return (
                            <li key={chat.id} onClick={() => onSelectChat(chat.id)} className="p-4 flex items-center space-x-4 cursor-pointer hover:bg-slate-50 transition-colors">
                                <div className="relative flex-shrink-0">
                                    <img className="w-14 h-14 rounded-full" src={chat.participant.avatar} alt={chat.participant.username} />
                                    {chat.participant.isOnline && <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-green-400 ring-2 ring-white"></span>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="text-md font-semibold text-slate-800 truncate">{chat.participant.username}</p>
                                        <p className="text-xs text-slate-500">{lastMessage.timestamp}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-1">
                                       <p className={`text-sm text-slate-500 truncate ${chat.unreadCount > 0 ? 'font-bold text-slate-800' : ''}`}>{lastMessage.text}</p>
                                       {chat.unreadCount > 0 && <span className="ml-2 text-xs text-white bg-teal-500 rounded-full px-2 py-0.5 font-semibold">{chat.unreadCount}</span>}
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

const ConversationPage = ({ chatId, currentUser, onBack }: { chatId: string, currentUser: UserProfile, onBack: () => void }) => {
    const { getChatById, sendMessage, markChatAsRead } = useChat();
    const chat = getChatById(chatId);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chat) {
            markChatAsRead(chatId);
        } else {
            // If chat is not found (e.g., while data is loading), go back to the list.
            const timer = setTimeout(() => onBack(), 100);
            return () => clearTimeout(timer);
        }
    }, [chat, chatId, markChatAsRead, onBack]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chat?.messages]);

    const handleSend = () => {
        if (newMessage.trim()) {
            sendMessage(chatId, newMessage.trim());
            setNewMessage('');
        }
    };

    if (!chat) {
        return null; // Render nothing while waiting for chat data or redirecting
    }

    return (
        <div className="fixed inset-0 bg-sky-50 flex flex-col z-50 animate-fadeIn">
            <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-40 shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center gap-3">
                    <button onClick={onBack} className="p-2 -ml-2 rounded-full text-slate-600 hover:bg-slate-100"><ArrowLeftIcon className="w-6 h-6" /></button>
                    <img className="w-10 h-10 rounded-full" src={chat.participant.avatar} alt={chat.participant.username} />
                    <h2 className="font-bold text-slate-800">{chat.participant.username}</h2>
                    <div className="flex-grow"></div>
                    <button className="p-2 rounded-full text-slate-600 hover:bg-slate-100"><VideoCameraIcon className="w-6 h-6" /></button>
                </div>
            </header>
            
            <main className="flex-1 overflow-y-auto p-4 space-y-2">
                {chat.messages.map((message, index) => {
                    const isMine = message.senderId === currentUser.id;
                    const prevMessage = index > 0 ? chat.messages[index-1] : null;
                    const isGrouped = prevMessage && prevMessage.senderId === message.senderId;

                    return (
                         <div key={message.id} className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'} ${isGrouped ? 'mt-1' : 'mt-4'}`}>
                            {!isMine && (
                                <img src={chat.participant.avatar} alt={chat.participant.username} className={`w-7 h-7 rounded-full self-start ${isGrouped ? 'opacity-0' : ''}`}/>
                            )}
                            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2.5 rounded-2xl text-white ${isMine ? 'bg-teal-500' : 'bg-slate-200 text-slate-800'}`}>
                                <p>{message.text}</p>
                            </div>
                         </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </main>

            <footer className="sticky bottom-0 bg-white p-2 border-t border-slate-200">
                <div className="container mx-auto flex items-center gap-2">
                     <textarea
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
                        placeholder="Scrivi un soffio..."
                        rows={1}
                        className="flex-1 bg-slate-100 rounded-2xl px-4 py-2 resize-none no-scrollbar focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                    <button onClick={handleSend} disabled={!newMessage.trim()} className="p-2 rounded-full bg-teal-500 text-white disabled:bg-slate-300 transition-colors">
                        <PaperAirplaneIcon className="w-6 h-6" />
                    </button>
                </div>
            </footer>
        </div>
    );
};


const BottomNav = ({ activeView, setActiveView }: { activeView: View; setActiveView: (view: View) => void; }) => {
    const navItems = [
        { id: 'home', icon: HomeIcon, label: 'Home' },
        { id: 'rooms', icon: RoomsIcon, label: 'Stanze' },
        { id: 'create', icon: null, label: 'Crea' },
        { id: 'chat', icon: ChatIcon, label: 'Chat' },
        { id: 'profile', icon: ProfileIcon, label: 'Profilo' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
            <div className="container mx-auto h-20 flex items-center justify-around">
                {navItems.map(item => {
                    if (item.id === 'create') {
                        return (
                            <button key={item.id} className="relative -top-6 w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-purple-400 text-white shadow-lg shadow-teal-500/30 flex items-center justify-center">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                            </button>
                        );
                    }
                    const Icon = item.icon!;
                    const isActive = activeView === item.id;
                    return (<button key={item.id} onClick={() => setActiveView(item.id as View)} className={`transition-colors ${isActive ? 'text-teal-500' : 'text-slate-500 hover:text-teal-500'}`}><Icon isActive={isActive} /></button>);
                })}
            </div>
        </nav>
    );
};

// --- AUTHENTICATION COMPONENTS ---

// FIX: Make children optional to resolve 'Property 'children' is missing' error which may be due to a linter misinterpretation.
const AuthLayout = ({ children }: { children?: React.ReactNode }) => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sky-50 p-4">
        <div className="text-center mb-8">
            <AnemosLogoIcon className="w-16 h-16 mx-auto" />
            <h1 className="text-3xl font-bold text-slate-800 mt-2">Benvenuto in Anemos</h1>
            <p className="text-slate-500">Dove le connessioni prendono il volo.</p>
        </div>
        <div className="w-full max-w-sm">
            {children}
        </div>
    </div>
);

const LoginPage = ({ onLogin, onSwitchToSignUp }: { onLogin: (username: string, pass: string) => Promise<boolean>; onSwitchToSignUp: () => void; }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const success = await onLogin(username, password);
        if (!success) {
            setError('Username o password non validi.');
        }
        setIsLoading(false);
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 animate-fadeIn">
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Accedi</h2>
            {error && <p className="bg-red-100 text-red-700 text-sm font-medium p-3 rounded-lg mb-4 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                    <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="es. aria@anemos.com" required className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900" />
                </div>
                <div>
                    <label htmlFor="password"  className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={e => setPassword(e.target.value)} required className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900" />
                        <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-slate-700">
                           {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                        </button>
                    </div>
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-teal-500 text-black font-semibold py-2.5 rounded-lg hover:bg-teal-600 transition disabled:bg-teal-300">{isLoading ? 'Accesso...' : 'Entra nel Vento'}</button>
            </form>
            <p className="text-center text-sm text-slate-500 mt-6">
                Non hai ancora un account? <button onClick={onSwitchToSignUp} className="font-semibold text-teal-600 hover:underline">Registrati</button>
            </p>
        </div>
    );
};

const SignUpPage = ({ onSignUp, onSwitchToLogin }: { onSignUp: (username: string, pass: string) => Promise<boolean>; onSwitchToLogin: () => void; }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Le password non coincidono.');
            return;
        }
        if (password.length < 8) {
            setError('La password deve essere di almeno 8 caratteri.');
            return;
        }
        setError('');
        setIsLoading(true);
        const success = await onSignUp(username, password);
        if (!success) {
            setError('Questo username è già stato preso.');
        }
        setIsLoading(false);
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 animate-fadeIn">
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Crea il tuo Soffio</h2>
            {error && <p className="bg-red-100 text-red-700 text-sm font-medium p-3 rounded-lg mb-4 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label htmlFor="username-signup" className="block text-sm font-medium text-slate-700 mb-1">Scegli il tuo username</label>
                    <div className="flex items-center">
                        <input type="text" id="username-signup" value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))} required className="block w-full px-3 py-2 bg-slate-50 border border-r-0 border-slate-300 rounded-l-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 z-10 text-slate-900" />
                        <span className="inline-flex items-center px-3 py-2 border border-l-0 border-slate-300 bg-slate-100 text-slate-500 text-sm rounded-r-md">@anemos.com</span>
                    </div>
                </div>
                 <div>
                    <label htmlFor="password-signup" className="block text-sm font-medium text-slate-700 mb-1">Crea una password</label>
                    <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} id="password-signup" value={password} onChange={e => setPassword(e.target.value)} required className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900" />
                        <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-slate-700">
                           {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                        </button>
                    </div>
                </div>
                <div>
                    <label htmlFor="confirm-password-signup" className="block text-sm font-medium text-slate-700 mb-1">Conferma password</label>
                    <input type="password" id="confirm-password-signup" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900" />
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-teal-500 text-black font-semibold py-2.5 rounded-lg hover:bg-teal-600 transition disabled:bg-teal-300">{isLoading ? 'Creazione...' : 'Registrati'}</button>
            </form>
            <p className="text-center text-sm text-slate-500 mt-6">
                Hai già un account? <button onClick={onSwitchToLogin} className="font-semibold text-teal-600 hover:underline">Accedi</button>
            </p>
        </div>
    );
};

const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState<View>('home');
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [chats, setChats] = useState<ChatConversation[]>([]);
    const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
    const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);
    const [activeChatId, setActiveChatId] = useState<string|null>(null);
    const [authView, setAuthView] = useState<'login' | 'signup'>('login');
    
    const debounceTimeoutRef = useRef<number | null>(null);
    const isInitialMount = useRef(true);


    // Effect for initial data loading from Google Sheet
    useEffect(() => {
        const loadData = async () => {
            const persistedData = await api.fetchData();
            if (persistedData && persistedData.users && persistedData.users.length > 0) {
                setUsers(persistedData.users);
                setRooms(persistedData.rooms);
                setChats(persistedData.chats);
            } else {
                // If no persisted data, use mock data and save it for the first time.
                console.log("No data found in sheet, initializing with mock data.");
                setUsers(mockUsers);
                setRooms(initialRoomsData);
                setChats(initialChatsData);
                api.saveData({ users: mockUsers, rooms: initialRoomsData, chats: initialChatsData });
            }
            // Use a timeout to ensure splash screen shows for a minimum duration for better UX
            const timer = setTimeout(() => setIsLoading(false), 1500);
            return () => clearTimeout(timer);
        };
        
        loadData();
    }, []);

    // Effect for persisting data changes back to Google Sheet
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        // Debounce the save operation to avoid excessive API calls
        debounceTimeoutRef.current = window.setTimeout(() => {
            api.saveData({ users, rooms, chats });
        }, 1500);

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [users, rooms, chats]);

    const handleLogin = async (username: string, pass: string): Promise<boolean> => {
        await new Promise(res => setTimeout(res, 500)); // Simulate network delay
        const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === pass);
        if (user) {
            const { password, ...userToSet } = user;
            setCurrentUser(userToSet);
            return true;
        }
        return false;
    };

    const handleSignUp = async (username: string, pass: string): Promise<boolean> => {
        await new Promise(res => setTimeout(res, 500)); // Simulate network delay
        const fullUsername = `${username.toLowerCase()}@anemos.com`;
        if (users.some(u => u.username === fullUsername)) {
            return false; // Username already exists
        }
        const newUser: UserProfile = {
            id: `user_${Date.now()}`,
            username: fullUsername,
            password: pass,
            name: username.charAt(0).toUpperCase() + username.slice(1),
            avatar: `https://picsum.photos/seed/${username}/200/200`,
            bio: 'Nuovo soffio nel vento di Anemos! 🌬️',
        };
        setUsers(prev => [...prev, newUser]);
        const { password, ...userToSet } = newUser;
        setCurrentUser(userToSet);
        return true;
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setView('home'); // Reset view
        setAuthView('login'); // Reset to login screen
    };

    const handleSaveProfile = (newUser: UserProfile) => {
        if (!currentUser) return;
        const updatedUser = { ...currentUser, ...newUser };
        setCurrentUser(updatedUser);
        // In a real app, this would also update the `users` array/database
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser, password: u.password } : u));
        setView('profile');
    };

    const handleCreateRoom = (name: string, privacy: 'public' | 'private') => {
        if (!currentUser) return;
        const newRoom: Room = {
            id: `user_${Date.now()}`,
            name,
            privacy,
            host: currentUser.name,
            tag: '#UserCreated',
            members: [{ username: currentUser.name, avatar: currentUser.avatar, isMuted: false, isVideoOff: false }],
            joinRequests: [],
            code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        };
        setRooms(prev => [newRoom, ...prev]);
        setCurrentRoom(newRoom);
        setView('live-room');
    };
    
    const handleLeaveRoom = () => {
        setCurrentRoom(null);
        setView('rooms');
    };
    
    const handleJoinAction = (roomToJoin: Room) => {
         if (!currentUser) return;
         if (roomToJoin.privacy === 'public') {
            const userExists = roomToJoin.members.some(m => m.username === currentUser.name);
            const members = userExists ? roomToJoin.members : [...roomToJoin.members, { username: currentUser.name, avatar: currentUser.avatar, isMuted: false, isVideoOff: false }];
            const roomWithUser = {...roomToJoin, members};
            setCurrentRoom(roomWithUser);
            setRooms(prevRooms => prevRooms.map(r => r.id === roomToJoin.id ? roomWithUser : r));
            setView('live-room');
        } else {
            const alreadyRequested = roomToJoin.joinRequests.some(req => req.user.username === currentUser.name);
            if (alreadyRequested) {
                alert('Hai già inviato una richiesta per questa stanza.');
                return;
            }
            const updatedRooms = rooms.map(r => r.id === roomToJoin.id ? {...r, joinRequests: [...r.joinRequests, { id: `req_${Date.now()}`, user: {username: currentUser.name, avatar: currentUser.avatar} }]} : r);
            setRooms(updatedRooms);
            alert('Richiesta di ingresso inviata!');
        }
    };
    
    const handleJoinRoom = (room: Room) => {
        if (!currentUser) return;
        if(room.members.find(m => m.username === currentUser.name)) {
            setCurrentRoom(room);
            setView('live-room');
            return;
        }
        handleJoinAction(room);
    };

    const handleJoinByCode = (code: string) => {
        const room = rooms.find(r => r.code.toUpperCase() === code.toUpperCase());
        if (!room) {
            alert("Stanza non trovata. Controlla il codice.");
            return;
        }
        handleJoinRoom(room);
    };
    
    const updateRoomState = (updatedRoom: Room) => {
        setCurrentRoom(updatedRoom);
        setRooms(prev => prev.map(r => r.id === updatedRoom.id ? updatedRoom : r));
    }

    const handleAcceptRequest = (reqId: string) => {
        if (!currentRoom) return;
        const request = currentRoom.joinRequests.find(r => r.id === reqId);
        if(!request) return;
        
        const updatedRoom = {
            ...currentRoom,
            members: [...currentRoom.members, { ...request.user, isMuted: false, isVideoOff: false }],
            joinRequests: currentRoom.joinRequests.filter(r => r.id !== reqId),
        };
        updateRoomState(updatedRoom);
    };

    const handleDeclineRequest = (reqId: string) => {
        if (!currentRoom) return;
        const updatedRoom = {
            ...currentRoom,
            joinRequests: currentRoom.joinRequests.filter(r => r.id !== reqId),
        };
        updateRoomState(updatedRoom);
    };
    
    const handleDeleteRoom = (roomId: string) => {
        if(window.confirm("Sei sicuro di voler eliminare questa stanza? L'azione è irreversibile.")) {
             setRooms(prev => prev.filter(r => r.id !== roomId));
        }
    };

    const handleNavigateToEdit = (room: Room) => {
        setRoomToEdit(room);
        setView('edit-room');
    };

    const handleUpdateRoom = (updatedRoom: Room) => {
        setRooms(prev => prev.map(r => r.id === updatedRoom.id ? updatedRoom : r));
        setRoomToEdit(null);
        setView('rooms');
    };
    
    const handleRemoveParticipant = (username: string) => {
        if (!currentRoom) return;
        const updatedRoom = {
            ...currentRoom,
            members: currentRoom.members.filter(m => m.username !== username)
        };
        updateRoomState(updatedRoom);
    };
    
    const handleToggleMute = (username: string) => {
        if (!currentRoom) return;
        const updatedRoom = {
            ...currentRoom,
            members: currentRoom.members.map(m => m.username === username ? { ...m, isMuted: !m.isMuted } : m)
        };
        updateRoomState(updatedRoom);
    };

    const handleToggleVideo = (username: string) => {
        if (!currentRoom) return;
        const updatedRoom = {
            ...currentRoom,
            members: currentRoom.members.map(m => m.username === username ? { ...m, isVideoOff: !m.isVideoOff } : m)
        };
        updateRoomState(updatedRoom);
    };
    
    const handleSelectChat = (chatId: string) => {
        setView('chat');
        setActiveChatId(chatId);
    };

    const renderView = () => {
        if (!currentUser) return null; // Should not happen if logic is correct
        switch (view) {
            case 'home': return (<div className="animate-fadeIn"><Stories /><Feed /></div>);
            case 'profile': return <ProfilePage user={currentUser} onEdit={() => setView('edit-profile')} onLogout={handleLogout} />;
            case 'edit-profile': return <EditProfilePage user={currentUser} onSave={handleSaveProfile} onCancel={() => setView('profile')} />;
            case 'rooms': return <RoomsPage rooms={rooms} currentUser={currentUser} onNavigateToCreate={() => setView('create-room')} onJoinByCode={handleJoinByCode} onJoinRoom={handleJoinRoom} onNavigateToEdit={handleNavigateToEdit} onDeleteRoom={handleDeleteRoom} />;
            case 'create-room': return <CreateRoomPage onCancel={() => setView('rooms')} onCreate={handleCreateRoom} />;
            case 'edit-room': return roomToEdit ? <EditRoomPage room={roomToEdit} onCancel={() => setView('rooms')} onSave={handleUpdateRoom} /> : <RoomsPage rooms={rooms} currentUser={currentUser} onNavigateToCreate={() => setView('create-room')} onJoinByCode={handleJoinByCode} onJoinRoom={handleJoinRoom} onNavigateToEdit={handleNavigateToEdit} onDeleteRoom={handleDeleteRoom} />;
            case 'live-room': return currentRoom ? <LiveRoomPage room={currentRoom} currentUser={currentUser} onLeave={handleLeaveRoom} onAcceptRequest={handleAcceptRequest} onDeclineRequest={handleDeclineRequest} onRemoveParticipant={handleRemoveParticipant} onToggleMute={handleToggleMute} onToggleVideo={handleToggleVideo} /> : <RoomsPage rooms={rooms} currentUser={currentUser} onNavigateToCreate={() => setView('create-room')} onJoinByCode={handleJoinByCode} onJoinRoom={handleJoinRoom} onNavigateToEdit={handleNavigateToEdit} onDeleteRoom={handleDeleteRoom} />;
            case 'chat': {
                if (activeChatId) {
                    return <ConversationPage chatId={activeChatId} currentUser={currentUser} onBack={() => setActiveChatId(null)} />;
                }
                return <ChatListPage onSelectChat={handleSelectChat} />;
            }
            default: return (<div className="animate-fadeIn"><Stories /><Feed /></div>);
        }
    };
    
    const activeView = useMemo(() => {
        if (view === 'profile' || view === 'edit-profile') return 'profile';
        if (view === 'rooms' || view === 'create-room' || view === 'live-room' || view === 'edit-room') return 'rooms';
        if (view === 'chat' && activeChatId) return 'chat';
        return view;
    }, [view, activeChatId]);

    const handleLogoClick = useCallback(() => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

    if (isLoading) return <SplashScreen />;
    
    if (!currentUser) {
      return (
          <AuthLayout>
              {authView === 'login' 
                  ? <LoginPage onLogin={handleLogin} onSwitchToSignUp={() => setAuthView('signup')} />
                  : <SignUpPage onSignUp={handleSignUp} onSwitchToLogin={() => setAuthView('login')} />
              }
          </AuthLayout>
      );
    }
    
    const isFullScreenView = (view === 'live-room' && currentRoom) || (view === 'chat' && activeChatId);


    return (
        <ChatProvider chats={chats} setChats={setChats} currentUser={currentUser}>
            <div className="bg-sky-50 min-h-screen font-sans text-slate-800 pb-20">
                 {!isFullScreenView && <Header onLogoClick={handleLogoClick} />}
                 <div className={!isFullScreenView ? "" : "h-screen"}>
                    {renderView()}
                 </div>
                 {!isFullScreenView && <BottomNav activeView={activeView} setActiveView={(v) => { setActiveChatId(null); setView(v); }} />}
            </div>
        </ChatProvider>
    );
};

// Mount the app
const rootEl = document.getElementById('root');
if (rootEl) {
    createRoot(rootEl).render(<App />);
} else {
    console.error('Root element not found.');
}