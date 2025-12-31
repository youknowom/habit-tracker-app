import { create } from "zustand";
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "@/src/services/firebase";
import { Habit, HabitCompletion } from "@/src/types/habit";
import { getTodayDate } from "@/src/utils/dateHelpers";
import { useAuthStore } from "./authStore";

interface HabitState {
  habits: Habit[];
  completions: HabitCompletion[];
  loading: boolean;
  fetchHabits: () => Promise<void>;
  fetchCompletions: (startDate?: string, endDate?: string) => Promise<void>;
  addHabit: (habit: Omit<Habit, "id" | "createdAt" | "streak"> & { userId?: string }) => Promise<string>;
  updateHabit: (habitId: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
  toggleCompletion: (habitId: string, date?: string) => Promise<void>;
  getTodayCompletions: () => HabitCompletion[];
  getCompletionRate: () => number;
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  completions: [],
  loading: false,

  fetchHabits: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    set({ loading: true });
    try {
      const habitsRef = collection(db, "habits");
      const q = query(habitsRef, where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      
      const habits: Habit[] = [];
      snapshot.forEach((doc) => {
        habits.push({ id: doc.id, ...doc.data() } as Habit);
      });

      set({ habits, loading: false });
    } catch (error) {
      console.error("Error fetching habits:", error);
      set({ loading: false });
    }
  },

  fetchCompletions: async (startDate?: string, endDate?: string) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      const completionsRef = collection(db, "completions");
      let q = query(completionsRef, where("userId", "==", user.uid));
      
      if (startDate) {
        q = query(q, where("date", ">=", startDate));
      }
      if (endDate) {
        q = query(q, where("date", "<=", endDate));
      }

      const snapshot = await getDocs(q);
      const completions: HabitCompletion[] = [];
      snapshot.forEach((doc) => {
        completions.push({ id: doc.id, ...doc.data() } as HabitCompletion);
      });

      set({ completions });
    } catch (error) {
      console.error("Error fetching completions:", error);
    }
  },

  addHabit: async (habitData) => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error("User not authenticated");

    const habit: Omit<Habit, "id"> = {
      ...habitData,
      userId: user.uid,
      streak: 0,
      createdAt: Date.now(),
    };

    const docRef = await addDoc(collection(db, "habits"), habit);
    const newHabit: Habit = { id: docRef.id, ...habit };
    
    set((state) => ({ habits: [...state.habits, newHabit] }));
    return docRef.id;
  },

  updateHabit: async (habitId: string, updates: Partial<Habit>) => {
    const habitRef = doc(db, "habits", habitId);
    await updateDoc(habitRef, updates);
    
    set((state) => ({
      habits: state.habits.map((h) =>
        h.id === habitId ? { ...h, ...updates } : h
      ),
    }));
  },

  deleteHabit: async (habitId: string) => {
    await deleteDoc(doc(db, "habits", habitId));
    set((state) => ({
      habits: state.habits.filter((h) => h.id !== habitId),
    }));
  },

  toggleCompletion: async (habitId: string, date: string = getTodayDate()) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    const { completions } = get();
    const existing = completions.find(
      (c) => c.habitId === habitId && c.date === date
    );

    if (existing) {
      // Toggle completion
      const completionRef = doc(db, "completions", existing.id);
      await updateDoc(completionRef, { completed: !existing.completed });
      
      set((state) => ({
        completions: state.completions.map((c) =>
          c.id === existing.id ? { ...c, completed: !c.completed } : c
        ),
      }));
    } else {
      // Create new completion
      const completion: Omit<HabitCompletion, "id"> = {
        habitId,
        userId: user.uid,
        date,
        completed: true,
        createdAt: Date.now(),
      };

      const docRef = await addDoc(collection(db, "completions"), completion);
      const newCompletion: HabitCompletion = { id: docRef.id, ...completion };
      
      set((state) => ({
        completions: [...state.completions, newCompletion],
      }));
    }

    // Update streak
    const { completions: allCompletions } = get();
    const habitCompletions = allCompletions
      .filter((c) => c.habitId === habitId && c.completed)
      .sort((a, b) => a.date.localeCompare(b.date));

    let streak = 0;
    const today = getTodayDate();
    let currentDate = new Date(today);

    for (let i = habitCompletions.length - 1; i >= 0; i--) {
      const completionDate = new Date(habitCompletions[i].date);
      const daysDiff = Math.floor(
        (currentDate.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === 0 || daysDiff === 1) {
        streak++;
        currentDate = new Date(completionDate);
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    await get().updateHabit(habitId, { streak });
  },

  getTodayCompletions: () => {
    const { completions } = get();
    const today = getTodayDate();
    return completions.filter((c) => c.date === today && c.completed);
  },

  getCompletionRate: () => {
    const { habits, completions } = get();
    const today = getTodayDate();
    const todayCompletions = completions.filter(
      (c) => c.date === today && c.completed
    );
    
    if (habits.length === 0) return 0;
    return Math.round((todayCompletions.length / habits.length) * 100);
  },
}));

