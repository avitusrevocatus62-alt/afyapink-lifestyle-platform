export type Lang = 'sw' | 'en';
export type Role = 'USER' | 'PROFESSIONAL' | 'CONTENT_REVIEWER' | 'ADMIN';
export type Tab = 'home' | 'gundua' | 'safari' | 'wellness' | 'mimi' | 'admin';
export type ArticleStatus = 'draft' | 'review' | 'approved' | 'published' | 'archived';

export interface LocalizedText {
  sw: string;
  en: string;
}

export interface Recipe {
  id: string;
  title: LocalizedText;
  desc: LocalizedText;
  category: string;
  time: number;
  servings: number;
  ingredients: LocalizedText[];
  steps: LocalizedText[];
  cyclePhase: string;
}

export interface Workout {
  id: string;
  title: LocalizedText;
  desc: LocalizedText;
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  phase: string;
  exercises: { name: LocalizedText; reps: string; rest: number }[];
}

export interface SleepLog {
  date: string;
  hours: number;
  quality: number;
}

export interface MoodEntry {
  date: string;
  mood: string;
  note: string;
}

export interface WeightLog {
  date: string;
  weight: number;
  waist: number;
}

export interface WellnessData {
  waterLogs: Record<string, number>;
  sleepLogs: SleepLog[];
  moodLogs: MoodEntry[];
  weightLogs: WeightLog[];
  completedWorkouts: Record<string, number>;
  savedRecipes: string[];
  waterStreak: number;
}

export interface UserProfile {
  name: string;
  age: string;
  stage: string;
  interests: string[];
  goals: string[];
  role: Role;
  lang: Lang;
  onboarded: boolean;
  consent: boolean;
  notifications: boolean;
  water: number;
  mood: string;
  bookmarks: string[];
  journeyProgress: Record<string, number>;
  completedSteps: Record<string, string[]>;
  wellness: WellnessData;
  dailyWaterTarget: number;
}

export interface Article {
  id: string;
  category: string;
  status: ArticleStatus;
  readTime: number;
  title: LocalizedText;
  excerpt: LocalizedText;
  body: LocalizedText;
  author: string;
}

export interface SelfCheck {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  icon: string;
  questions: { q: LocalizedText; options: { label: LocalizedText; score: number }[] }[];
  results: { low: LocalizedText; mid: LocalizedText; high: LocalizedText };
}

export interface Journey {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  weeks: number;
  milestones: LocalizedText[];
  color: string;
}

export interface Professional {
  id: string;
  name: string;
  specialty: LocalizedText;
  location: LocalizedText;
  verified: boolean;
  rating: number;
}

export interface WizardMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface KPI {
  label: LocalizedText;
  value: string;
  delta: string;
}