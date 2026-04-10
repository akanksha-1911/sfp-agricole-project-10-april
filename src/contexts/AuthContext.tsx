// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { apiService } from '../services/apiService';
// import { toast } from 'sonner'; 

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   isAdmin: boolean;
//   points: number;
//   createdAt: string;
//   orders: any[];
// }

// interface AuthContextType {
//   user: User | null;
//   login: (email: string, password: string) => Promise<boolean>;
//   signup: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
//   logout: () => void;
//   updateUser: (user: User) => void;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   error: string | null;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     // Check for stored user data on mount
//     const storedUser = localStorage.getItem('currentUser');
//     const storedLoginFlag = localStorage.getItem('user_logged');
    
//     if (storedUser && storedLoginFlag === 'true') {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const login = async (email: string, password: string): Promise<boolean> => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const response = await apiService.login({
//         username: email,
//         password: password
//       });

//       console.log('Full login response:', response);

//       // Check if login was successful using user_logged flag
//       if (response && response.status === true && response.code === 200 && response.data?.user_logged === true) {
//         // Create user object from response
//         const loggedInUser: User = {
//           id: response.data.user_id || Date.now().toString(),
//           name: response.data.user_name || email.split('@')[0],
//           email: email,
//           phone: '',
//           isAdmin: false,
//           points: 0,
//           createdAt: new Date().toISOString(),
//           orders: []
//         };

//         setUser(loggedInUser);
        
//         // Store user data and login flag
//         localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
//         localStorage.setItem('user_logged', 'true');
//         localStorage.setItem('user_id', response.data.user_id);
//         localStorage.setItem('user_name', response.data.user_name);
        
//         return true;
//       }
      
//       // Handle different response formats
//       if (response && response.message) {
//         setError(response.message);
//       } else {
//         setError('Invalid credentials. Please try again.');
//       }
      
//       return false;
//     } catch (error: any) {
//       console.error('Login error details:', error);
      
//       // Provide user-friendly error messages
//       if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
//         setError('Cannot connect to server. Please check your internet connection.');
//       } else if (error.message.includes('non-JSON')) {
//         setError('Server error. Please try again later or contact support.');
//       } else {
//         setError(error.message || 'Login failed. Please try again.');
//       }
      
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const signup = async (name: string, email: string, phone: string, password: string): Promise<boolean> => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const response = await apiService.register({
//         st_name: name,
//         st_contact_number: phone,
//         st_password: password,
//         st_email: email
//       });

//       console.log('Registration response:', response);

//       // Check if registration was successful
//       if (response && response.status === true && response.code === 200) {
//         // Don't auto-login, just return success
//         return true;
//       }
      
//       // Handle registration error
//       if (response && response.message) {
//         setError(response.message);
//       } else {
//         setError('Registration failed. Please try again.');
//       }
      
//       return false;
//     } catch (error: any) {
//       console.error('Signup error details:', error);
      
//       if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
//         setError('Cannot connect to server. Please check your internet connection.');
//       } else {
//         setError(error.message || 'Registration failed. Please try again.');
//       }
      
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('currentUser');
//     localStorage.removeItem('user_logged');
//     localStorage.removeItem('user_id');
//     localStorage.removeItem('user_name');
    
//     // Note: Cart and wishlist data remains in localStorage with user-specific keys
//     // They won't be cleared on logout, but will be loaded when user logs back in
    
//     toast.success('Logged out successfully', {
//       duration: 1000
//     });
//   };

//   const updateUser = (updatedUser: User) => {
//     setUser(updatedUser);
//     localStorage.setItem('currentUser', JSON.stringify(updatedUser));
//   };

//   return (
//     <AuthContext.Provider value={{
//       user,
//       login,
//       signup,
//       logout,
//       updateUser,
//       isAuthenticated: !!user,
//       isLoading,
//       error
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { toast } from 'sonner'; 

interface User {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  pincode?: string;
  state?: string;
  state_id?: string;
  country?: string;
  country_id?: string;
  isAdmin: boolean;
  points: number;
  createdAt: string;
  orders: any[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
  refreshUserProfile: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('currentUser');
    const storedLoginFlag = localStorage.getItem('user_logged');
    const storedUserId = localStorage.getItem('user_id');
    
    if (storedUser && storedLoginFlag === 'true' && storedUserId) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // Fetch fresh profile data
      refreshUserProfile();
    }
  }, []);

  const refreshUserProfile = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    try {
      const response = await apiService.getUserProfile(userId);
      if (response.status && response.code === 200 && response.data && response.data[0]) {
        const profileData = response.data[0];
        
        // REMOVED: countries and states lookup since they're not available here
        // We'll just use the names directly from the API response
        
        const updatedUser: User = {
          user_id: profileData.user_id,
          name: profileData.user_name,
          email: profileData.user_email,
          phone: profileData.user_contact_number || '',
          address: profileData.user_address || '',
          city: profileData.user_city || '',
          pincode: profileData.user_pincode || '',
          state: profileData.user_state || '',
          state_id: '', // We'll set this when editing profile
          country: profileData.user_country || '',
          country_id: '', // We'll set this when editing profile
          isAdmin: user?.isAdmin || false,
          points: user?.points || 0,
          createdAt: user?.createdAt || new Date().toISOString(),
          orders: user?.orders || []
        };
        
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error refreshing user profile:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.login({
        username: email,
        password: password
      });

      console.log('Full login response:', response);

      // Check if login was successful using user_logged flag
      if (response && response.status === true && response.code === 200 && response.data?.user_logged === true) {
        const userId = response.data.user_id;
        
        // Fetch the complete user profile
        const profileResponse = await apiService.getUserProfile(userId);
        
        if (profileResponse.status && profileResponse.code === 200 && profileResponse.data && profileResponse.data[0]) {
          const profileData = profileResponse.data[0];
          
          // Create user object from profile data
          const loggedInUser: User = {
            user_id: profileData.user_id,
            name: profileData.user_name,
            email: profileData.user_email,
            phone: profileData.user_contact_number || '',
            address: profileData.user_address || '',
            city: profileData.user_city || '',
            pincode: profileData.user_pincode || '',
            state: profileData.user_state || '',
            state_id: '',
            country: profileData.user_country || '',
            country_id: '',
            isAdmin: response.data.is_admin === 'yes' || false,
            points: parseInt(response.data.points) || 0,
            createdAt: new Date().toISOString(),
            orders: []
          };

          setUser(loggedInUser);
          
          // Store user data
          localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
          localStorage.setItem('user_logged', 'true');
          localStorage.setItem('user_id', profileData.user_id);
          localStorage.setItem('user_name', profileData.user_name);
          localStorage.setItem('user_email', profileData.user_email);
          
          toast.success(`Welcome back, ${profileData.user_name}!`);
          return true;
        } else {
          // Fallback if profile fetch fails
          const loggedInUser: User = {
            user_id: userId,
            name: response.data.user_name || email.split('@')[0],
            email: email,
            phone: '',
            address: '',
            city: '',
            pincode: '',
            state: '',
            state_id: '',
            country: '',
            country_id: '',
            isAdmin: false,
            points: 0,
            createdAt: new Date().toISOString(),
            orders: []
          };

          setUser(loggedInUser);
          localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
          localStorage.setItem('user_logged', 'true');
          localStorage.setItem('user_id', userId);
          localStorage.setItem('user_name', loggedInUser.name);
          localStorage.setItem('user_email', email);
          
          toast.success(`Welcome back, ${loggedInUser.name}!`);
          return true;
        }
      }
      
      // Handle different response formats
      if (response && response.message) {
        setError(response.message);
        toast.error(response.message);
      } else {
        const errorMsg = 'Invalid credentials. Please try again.';
        setError(errorMsg);
        toast.error(errorMsg);
      }
      
      return false;
    } catch (error: any) {
      console.error('Login error details:', error);
      
      let errorMsg = 'Login failed. Please try again.';
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMsg = 'Cannot connect to server. Please check your internet connection.';
      } else if (error.message.includes('non-JSON')) {
        errorMsg = 'Server error. Please try again later or contact support.';
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, phone: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.register({
        st_name: name,
        st_contact_number: phone,
        st_password: password,
        st_email: email
      });

      console.log('Registration response:', response);

      // Check if registration was successful
      if (response && response.status === true && response.code === 200) {
        toast.success('Registration successful! Please login.');
        return true;
      }
      
      // Handle registration error
      const errorMsg = response?.message || 'Registration failed. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    } catch (error: any) {
      console.error('Signup error details:', error);
      
      let errorMsg = 'Registration failed. Please try again.';
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMsg = 'Cannot connect to server. Please check your internet connection.';
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('user_logged');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    
    toast.success('Logged out successfully', {
      duration: 1000
    });
  };

  const updateUser = (updatedData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Update individual fields in localStorage
      if (updatedData.name) localStorage.setItem('user_name', updatedData.name);
      if (updatedData.email) localStorage.setItem('user_email', updatedData.email);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      updateUser,
      refreshUserProfile,
      isAuthenticated: !!user,
      isLoading,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};