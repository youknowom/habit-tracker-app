import { create } from "zustand";
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/src/services/firebase";
import { AppUser } from "@/src/types/user";

interface AuthState {
  user: User | null;
  userData: AppUser | null;
  loading: boolean;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserData: (userData: AppUser) => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
  let unsubscribe: (() => void) | null = null;

  const initialize = () => {
    if (unsubscribe) return;

    set({ loading: true });
    unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          set({ 
            user, 
            userData: userDoc.data() as AppUser,
            loading: false,
            initialized: true 
          });
        } else {
          // User document doesn't exist yet (new signup)
          set({ 
            user, 
            userData: null,
            loading: false,
            initialized: true 
          });
        }
      } else {
        set({ 
          user: null, 
          userData: null,
          loading: false,
          initialized: true 
        });
      }
    });
  };

  return {
    user: null,
    userData: null,
    loading: true,
    initialized: false,
    
    initialize,

    signIn: async (email: string, password: string) => {
      await signInWithEmailAndPassword(auth, email, password);
    },

    signUp: async (email: string, password: string) => {
      await createUserWithEmailAndPassword(auth, email, password);
    },

    signOut: async () => {
      await signOut(auth);
      set({ user: null, userData: null });
    },

    updateUserData: async (userData: AppUser) => {
      const { user } = get();
      if (!user) return;

      await setDoc(doc(db, "users", user.uid), userData, { merge: true });
      set({ userData });
    },
  };
});

