import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types/user";
import { getCurrentUser } from "@/mocks/users";
import api, { endpoints } from "@/services/api";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
      
        try {
          const response = await api.post(endpoints.auth.login, {
            email,
            password
          });

          const access_token = response.data.access_token; 
          if (access_token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            await AsyncStorage.setItem("auth-token", access_token);
            const userRes = await api.get(endpoints.users.current);
            const userData = userRes.data;
          
            set({ 
              user: userData, 
              isAuthenticated: true, 
              isLoading: false 
            });
            return true;
          } else {
            throw new Error("Invalid token received.");
          }
        } catch (error: any) {
          const message = error.response?.data?.message || "Login failed.";
          set({ error: message, isLoading: false });
          return false;
        }
      },
      
      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
      
        try {
          const response = await api.post(endpoints.auth.register, {
            name,
            email,
            password
          });          
          
          if (response.status == 201) {
            const r = await api.post(endpoints.auth.login, {
              email,
              password
            });

            const access_token = r.data;         
            if (access_token) {
              await AsyncStorage.setItem("auth-token", access_token);
              const userRes = await api.get(endpoints.users.current, {
                headers: {
                  Authorization: `Bearer ${access_token}`
                }
              });
              const userData = userRes.data;            
              set({ 
                user: userData, 
                isAuthenticated: true, 
                isLoading: false 
              });
              return true;
            } else {
              throw new Error("Invalid token received.");
            }
          } else {
            throw new Error("Registration failed.");
          }
        } catch (error: any) {
          console.log("REGISTER ERROR:", error?.response?.data || error);
          const message = error.response?.data?.message || "Registration failed.";
          set({ error: message, isLoading: false });
          return false;
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      updateProfile: async (userData) => {
        set({ isLoading: true, error: null });
      
        try {
          const res = await api.put("/users/current", userData);       
          set((state) => ({
            user: res.data ? { ...state.user, ...res.data } : null,
            isLoading: false,
          }));
        } catch (error: any) {
          const message = error.response?.data?.message || "Profile update failed.";
          set({ error: message, isLoading: false });
        }
      }      
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);