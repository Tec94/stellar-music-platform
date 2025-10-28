import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';

export interface UserProfile {
  email: string;
  username: string;
  bio: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  xp: number;
  questsCompleted: number;
}

export interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video';
  src: string;
  uploadedAt: string;
}

export interface ChatMessage {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

export interface AppState {
  user: UserProfile | null;
  media: MediaItem[];
  chatMessages: ChatMessage[];
  register: (payload: { email: string; password: string }) => void;
  updateProfile: (payload: { username: string; bio: string }) => void;
  completeOnboarding: () => void;
  addMedia: (item: MediaItem) => void;
  setMedia: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  addChatMessage: (item: ChatMessage) => void;
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  upgradeTier: (tier: UserProfile['tier']) => void;
  incrementQuestCompletion: () => void;
}

const STORAGE_KEY = 'adventure-quest-state';

const DEFAULT_MEDIA: MediaItem[] = [
  {
    id: 'seed-image-1',
    name: 'Sunset Overlook.jpg',
    type: 'image',
    src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAABhvgbIAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAilBMVEVHcEyWlZmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpmXlpkAAAB4E/HaAAAAKXRSTlMAAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKSorALNm0QAAAGlJREFUGFdjYIABRkYmZgYQZmJmZA5CBhY2dg5CQpZWePgEUlBRXUFVcQpVuHwCUEhQSKqirqisrGxs7S1submFnaOjpeXm5uYOlAXiCUkpaSXlFhGWlZGVo4IEEAHwyFUy6o5TcAAAAASUVORK5CYII=',
    uploadedAt: new Date().toISOString()
  },
  {
    id: 'seed-video-1',
    name: 'Waterfall.mp4',
    type: 'video',
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    uploadedAt: new Date().toISOString()
  }
];

const defaultState: AppState = {
  user: null,
  media: [],
  chatMessages: [],
  register: () => {},
  updateProfile: () => {},
  completeOnboarding: () => {},
  addMedia: () => {},
  setMedia: () => {},
  addChatMessage: () => {},
  setChatMessages: () => {},
  upgradeTier: () => {},
  incrementQuestCompletion: () => {}
};

const AppStateContext = createContext<AppState>(defaultState);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [media, setMedia] = useState<MediaItem[]>(DEFAULT_MEDIA);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { user: UserProfile | null; media: MediaItem[]; chatMessages: ChatMessage[] };
        setUser(parsed.user);
        setMedia(parsed.media ?? DEFAULT_MEDIA);
        setChatMessages(parsed.chatMessages ?? []);
      } catch (error) {
        console.error('Failed to parse stored state', error);
      }
    }
  }, []);

  useEffect(() => {
    const payload = JSON.stringify({ user, media, chatMessages });
    localStorage.setItem(STORAGE_KEY, payload);
  }, [user, media, chatMessages]);

  const register = (payload: { email: string; password: string }) => {
    setUser({
      email: payload.email,
      username: '',
      bio: '',
      tier: 'Bronze',
      xp: 0,
      questsCompleted: 0
    });
  };

  const updateProfile = (payload: { username: string; bio: string }) => {
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        username: payload.username,
        bio: payload.bio
      };
    });
  };

  const completeOnboarding = () => {
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        xp: prev.xp + 150,
        questsCompleted: prev.questsCompleted + 1
      };
    });
  };

  const addMedia = (item: MediaItem) => {
    setMedia((prev) => [item, ...prev]);
  };

  const addChatMessage = (item: ChatMessage) => {
    setChatMessages((prev) => [...prev.slice(-49), item]);
  };

  const upgradeTier = (tier: UserProfile['tier']) => {
    setUser((prev) => (prev ? { ...prev, tier } : prev));
  };

  const incrementQuestCompletion = () => {
    setUser((prev) => (prev ? { ...prev, questsCompleted: prev.questsCompleted + 1, xp: prev.xp + 500 } : prev));
  };

  const value = useMemo(
    () => ({
      user,
      media,
      chatMessages,
      register,
      updateProfile,
      completeOnboarding,
      addMedia,
      setMedia,
      addChatMessage,
      setChatMessages,
      upgradeTier,
      incrementQuestCompletion
    }),
    [user, media, chatMessages]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  return useContext(AppStateContext);
}

export function createMediaItemFromFile(file: File, dataUrl: string): MediaItem {
  return {
    id: uuid(),
    name: file.name,
    type: file.type.startsWith('video') ? 'video' : 'image',
    src: dataUrl,
    uploadedAt: new Date().toISOString()
  };
}

export function createChatMessage(author: string, content: string): ChatMessage {
  return {
    id: uuid(),
    author,
    content,
    timestamp: new Date().toISOString()
  };
}
