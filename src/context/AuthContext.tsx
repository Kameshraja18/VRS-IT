import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true };
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload, isAuthenticated: true, loading: false };
    case 'LOGIN_FAILURE':
      return { ...state, user: null, isAuthenticated: false, loading: false };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, loading: false };
    default:
      return state;
  }
};

// Demo users for testing
const demoUsers: User[] = [
  // Admin accounts
  {
    id: '1',
    email: 'admin1@gmail.com',
    name: 'Dr. Principal Kumar',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2023-01-15'),
    lastLogin: new Date(),
    isOnline: true
  },
  {
    id: '2',
    email: 'admin2@gmail.com',
    name: 'Vice Principal Sharma',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2023-01-15'),
    lastLogin: new Date(),
    isOnline: true
  },
  // Staff accounts
  {
    id: '3',
    email: 'staff1@gmail.com',
    name: 'Dr. Rajesh Kumar',
    role: 'staff',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2020-08-15'),
    lastLogin: new Date(),
    isOnline: true
  },
  {
    id: '4',
    email: 'staff2@gmail.com',
    name: 'Prof. Priya Sharma',
    role: 'staff',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2021-08-15'),
    lastLogin: new Date(),
    isOnline: true
  },
  {
    id: '5',
    email: 'staff3@gmail.com',
    name: 'Dr. Suresh Babu',
    role: 'staff',
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2021-08-15'),
    lastLogin: new Date(),
    isOnline: true
  },
  {
    id: '6',
    email: 'staff4@gmail.com',
    name: 'Ms. Kavitha Reddy',
    role: 'staff',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2021-08-15'),
    lastLogin: new Date(),
    isOnline: true
  },
  {
    id: '7',
    email: 'staff5@gmail.com',
    name: 'Mr. Arun Kumar',
    role: 'staff',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2021-08-15'),
    lastLogin: new Date(),
    isOnline: true
  },
  // Student accounts
  {
    id: '8',
    email: 'student1@gmail.com',
    name: 'Karthik Raj',
    role: 'student',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2024-08-15'),
    lastLogin: new Date(),
    isOnline: false
  },
  {
    id: '9',
    email: 'student2@gmail.com',
    name: 'Priya Nair',
    role: 'student',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2024-08-15'),
    lastLogin: new Date(),
    isOnline: true
  },
  {
    id: '10',
    email: 'student3@gmail.com',
    name: 'Arjun Reddy',
    role: 'student',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2024-08-15'),
    lastLogin: new Date(),
    isOnline: false
  },
  {
    id: '11',
    email: 'student4@gmail.com',
    name: 'Sneha Patel',
    role: 'student',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2024-08-15'),
    lastLogin: new Date(),
    isOnline: true
  },
  {
    id: '12',
    email: 'student5@gmail.com',
    name: 'Vikram Singh',
    role: 'student',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2024-08-15'),
    lastLogin: new Date(),
    isOnline: false
  },
  {
    id: '13',
    email: 'student6@gmail.com',
    name: 'Divya Krishnan',
    role: 'student',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2024-08-15'),
    lastLogin: new Date(),
    isOnline: true
  },
  {
    id: '14',
    email: 'student7@gmail.com',
    name: 'Rahul Gupta',
    role: 'student',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2024-08-15'),
    lastLogin: new Date(),
    isOnline: false
  },
  {
    id: '15',
    email: 'student8@gmail.com',
    name: 'Meera Joshi',
    role: 'student',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2024-08-15'),
    lastLogin: new Date(),
    isOnline: true
  },
  {
    id: '16',
    email: 'student9@gmail.com',
    name: 'Aditya Kumar',
    role: 'student',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2024-08-15'),
    lastLogin: new Date(),
    isOnline: false
  },
  {
    id: '17',
    email: 'student10@gmail.com',
    name: 'Pooja Sharma',
    role: 'student',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2024-08-15'),
    lastLogin: new Date(),
    isOnline: true
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: false
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check demo users first
    const demoUser = demoUsers.find(u => u.email === email);
    
    if (demoUser && (
      (password === 'admin123' && demoUser.role === 'admin') ||
      (password === 'staff123' && demoUser.role === 'staff') ||
      (password === 'student123' && demoUser.role === 'student')
    )) {
      localStorage.setItem('user', JSON.stringify(demoUser));
      dispatch({ type: 'LOGIN_SUCCESS', payload: demoUser });
      return true;
    }

    // Try Supabase authentication for real users
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        // Get user profile from database
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) throw profileError;

        const user: User = {
          id: userProfile.id,
          email: userProfile.email,
          name: userProfile.name,
          role: userProfile.role,
          avatar: userProfile.avatar,
          createdAt: new Date(userProfile.created_at),
          lastLogin: new Date(),
          isOnline: true
        };

        localStorage.setItem('user', JSON.stringify(user));
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        return true;
      }
    } catch (error) {
      console.warn('Supabase login failed, using demo mode:', error);
    }

    dispatch({ type: 'LOGIN_FAILURE' });
    return false;
  };

  const logout = async () => {
    localStorage.removeItem('user');
    
    // Sign out from Supabase if authenticated
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};