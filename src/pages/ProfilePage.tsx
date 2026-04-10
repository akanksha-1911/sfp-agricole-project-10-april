// import React, { useState, useEffect } from 'react';
// import { motion } from 'motion/react';
// import { User, Mail, Phone, MapPin, Building, CreditCard, Lock } from 'lucide-react';
// import { Button } from '../app/components/ui/button';
// import { Card } from '../app/components/ui/card';
// import { Input } from '../app/components/ui/input';
// import { Label } from '../app/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../app/components/ui/select';
// import { toast } from 'sonner';
// import { apiService } from '../services/apiService';
// import { useAuth } from '../contexts/AuthContext';

// interface PageProps {
//   onNavigate: (page: string) => void;
// }

// interface Country {
//   country_id: string;
//   country_name: string;
// }

// interface State {
//   state_id: string;
//   state_name: string;
//   country_name: string;
//   country_id: string;
// }

// export const ProfilePage: React.FC<PageProps> = ({ onNavigate }) => {
//   const { user, updateUser, refreshUserProfile } = useAuth();
//   const [formData, setFormData] = useState({
//     user_id: '',
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//     city: '',
//     pincode: '',
//     state_id: '',
//     state_name: '',
//     country_id: '',
//     country_name: '',
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
  
//   const [countries, setCountries] = useState<Country[]>([]);
//   const [states, setStates] = useState<State[]>([]);
//   const [filteredStates, setFilteredStates] = useState<State[]>([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPasswordFields, setShowPasswordFields] = useState(false);

//   // Fetch countries and states on mount
//   useEffect(() => {
//     fetchCountries();
//     fetchStates();
//   }, []);

//   // Load user data when user changes
//   useEffect(() => {
//     if (user?.user_id) {
//       loadUserData();
//     }
//   }, [user, states, countries]);

//   const loadUserData = () => {
//     if (user) {
//       // Find country_id from country_name
//       const countryObj = countries.find(c => c.country_name === user.country);
//       // Find state_id from state_name
//       const stateObj = states.find(s => s.state_name === user.state);
      
//       setFormData(prev => ({
//         ...prev,
//         user_id: user.user_id || '',
//         name: user.name || '',
//         email: user.email || '',
//         phone: user.phone || '',
//         address: user.address || '',
//         city: user.city || '',
//         pincode: user.pincode || '',
//         state_id: stateObj?.state_id || '',
//         state_name: user.state || '',
//         country_id: countryObj?.country_id || '',
//         country_name: user.country || ''
//       }));
      
//       // Filter states based on country
//       if (countryObj?.country_id) {
//         const filtered = states.filter(s => s.country_id === countryObj.country_id);
//         setFilteredStates(filtered);
//       }
//     }
//   };

//   const fetchCountries = async () => {
//     try {
//       const data = await apiService.getCountries();
//       setCountries(data);
//     } catch (error) {
//       console.error('Error fetching countries:', error);
//       toast.error('Failed to load countries');
//     }
//   };

//   const fetchStates = async () => {
//     try {
//       const data = await apiService.getStates();
//       setStates(data);
//     } catch (error) {
//       console.error('Error fetching states:', error);
//       toast.error('Failed to load states');
//     }
//   };

//   const handleCountryChange = (countryId: string) => {
//     const selectedCountry = countries.find(c => c.country_id === countryId);
    
//     // Filter states based on selected country
//     const filtered = states.filter(s => s.country_id === countryId);
//     setFilteredStates(filtered);
    
//     setFormData(prev => ({
//       ...prev,
//       country_id: countryId,
//       country_name: selectedCountry?.country_name || '',
//       state_id: '',
//       state_name: ''
//     }));
//   };

//   const handleStateChange = (stateId: string) => {
//     const selectedState = states.find(s => s.state_id === stateId);
//     setFormData(prev => ({
//       ...prev,
//       state_id: stateId,
//       state_name: selectedState?.state_name || ''
//     }));
//   };

//   const handleUpdateProfile = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setIsLoading(true);

//   try {
//     // Send IDs for state and country, not names
//     const response = await apiService.updateUserProfile({
//       user_id: formData.user_id,
//       name: formData.name,
//       st_contact_number: formData.phone,
//       st_email: formData.email,
//       address: formData.address,
//       city: formData.city,
//       pincode: formData.pincode,
//       state_id: formData.state_id,    
//       country_id: formData.country_id  
//     });

//     if (response.status && response.code === 200) {
//       toast.success('Profile updated successfully!');
//       setIsEditing(false);
      
//       // Update user context with the new data 
//       updateUser({
//         name: formData.name,
//         email: formData.email,
//         phone: formData.phone,
//         address: formData.address,
//         city: formData.city,
//         pincode: formData.pincode,
//         state: formData.state_name,
//         country: formData.country_name
//       });
      
//       // Refresh profile to ensure data consistency
//       await refreshUserProfile();
//     } else {
//       // Handle validation errors (status false but code 404 or other)
//       if (response.message && typeof response.message === 'object') {
//         // If message is an object with field-specific errors
//         const errors = response.message;
        
//         // Display each error message
//         Object.keys(errors).forEach((field) => {
//           const errorMessage = errors[field];
//           toast.error(errorMessage, {
//             duration: 4000,
//             position: 'top-right'
//           });
//         });
        
//         // Also set form-specific errors for fields if needed
//         if (errors.st_email) {
//           // Highlight email field with error (you can add a state for field errors)
//           toast.error(`Email: ${errors.st_email}`);
//         }
//         if (errors.st_contact_number) {
//           toast.error(`Phone: ${errors.st_contact_number}`);
//         }
//       } else if (response.message) {
//         // If message is a string
//         toast.error(response.message);
//       } else {
//         throw new Error('Failed to update profile');
//       }
//     }
//   } catch (error: any) {
//     console.error('Error updating profile:', error);
    
//     // Handle network or parsing errors
//     if (error.message === 'Failed to fetch') {
//       toast.error('Network error. Please check your connection.');
//     } else if (error.message === 'Server returned unexpected response format') {
//       toast.error('Server error. Please try again later.');
//     } else {
//       toast.error(error.message || 'Failed to update profile. Please try again.');
//     }
//   } finally {
//     setIsLoading(false);
//   }
// };

//   const handleChangePassword = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (formData.newPassword !== formData.confirmPassword) {
//       toast.error('New password and confirm password do not match');
//       return;
//     }

//     if (formData.newPassword.length < 6) {
//       toast.error('Password must be at least 6 characters long');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await apiService.changePassword({
//         user_id: formData.user_id,
//         current_password: formData.currentPassword,
//         new_password: formData.newPassword
//       });

//       if (response.status && response.code === 200) {
//         toast.success('Password changed successfully!');
//         setFormData(prev => ({
//           ...prev,
//           currentPassword: '',
//           newPassword: '',
//           confirmPassword: ''
//         }));
//         setShowPasswordFields(false);
//       } else {
//         throw new Error(response.message || 'Failed to change password');
//       }
//     } catch (error) {
//       console.error('Error changing password:', error);
//       toast.error('Failed to change password. Please check your current password.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <Card className="p-12 text-center max-w-md">
//           <User className="w-20 h-20 text-gray-300 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold mb-2">Not Logged In</h2>
//           <p className="text-gray-600 mb-6">Please login to view your profile</p>
//           <Button onClick={() => onNavigate('login')} className="bg-gradient-to-r from-green-600 to-emerald-500">
//             Login Now
//           </Button>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="relative bg-gradient-to-r from-green-600 to-emerald-500 text-white py-20">
//         <div className="container mx-auto px-4">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center"
//           >
//             <h1 className="text-5xl font-bold mb-4">My Profile</h1>
//             <p className="text-xl opacity-90">Manage your account details</p>
//           </motion.div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-16">
//         <div className="max-w-3xl mx-auto">
//           {/* Profile Information Card */}
//           <Card className="p-8 mb-8">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold">Profile Information</h2>
//               {!isEditing ? (
//                 <Button
//                   onClick={() => setIsEditing(true)}
//                   className="bg-gradient-to-r from-green-600 to-emerald-500"
//                 >
//                   Edit Profile
//                 </Button>
//               ) : (
//                 <div className="flex gap-2">
//                   <Button
//                     variant="outline"
//                     onClick={() => {
//                       setIsEditing(false);
//                       loadUserData();
//                     }}
//                     disabled={isLoading}
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               )}
//             </div>

//             <form onSubmit={handleUpdateProfile}>
//               <div className="space-y-4">
//                 <div>
//                   <Label htmlFor="profile-name">Full Name *</Label>
//                   <Input
//                     id="profile-name"
//                     value={formData.name}
//                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                     disabled={!isEditing || isLoading}
//                     required
//                     className={!isEditing ? "bg-gray-50" : ""}
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="profile-email">Email Address *</Label>
//                   <Input
//                     id="profile-email"
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                     disabled={!isEditing || isLoading}
//                     required
//                     className={!isEditing ? "bg-gray-50" : ""}
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="profile-phone">Phone Number *</Label>
//                   <Input
//                     id="profile-phone"
//                     value={formData.phone}
//                     onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                     disabled={!isEditing || isLoading}
//                     required
//                     className={!isEditing ? "bg-gray-50" : ""}
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="profile-address">Address</Label>
//                   <Input
//                     id="profile-address"
//                     value={formData.address}
//                     onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//                     disabled={!isEditing || isLoading}
//                     className={!isEditing ? "bg-gray-50" : ""}
//                     placeholder="Enter your address"
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="profile-city">City</Label>
//                     <Input
//                       id="profile-city"
//                       value={formData.city}
//                       onChange={(e) => setFormData({ ...formData, city: e.target.value })}
//                       disabled={!isEditing || isLoading}
//                       className={!isEditing ? "bg-gray-50" : ""}
//                       placeholder="Enter your city"
//                     />
//                   </div>

//                   <div>
//                     <Label htmlFor="profile-pincode">Pincode</Label>
//                     <Input
//                       id="profile-pincode"
//                       value={formData.pincode}
//                       onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
//                       disabled={!isEditing || isLoading}
//                       className={!isEditing ? "bg-gray-50" : ""}
//                       placeholder="Enter pincode"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="profile-country">Country</Label>
//                     {isEditing ? (
//                       <Select
//                         value={formData.country_id}
//                         onValueChange={handleCountryChange}
//                         disabled={isLoading}
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select Country" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {countries.map((country) => (
//                             <SelectItem key={country.country_id} value={country.country_id}>
//                               {country.country_name}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     ) : (
//                       <Input
//                         id="profile-country"
//                         value={formData.country_name}
//                         disabled
//                         className="bg-gray-50"
//                       />
//                     )}
//                   </div>

//                   <div>
//                     <Label htmlFor="profile-state">State</Label>
//                     {isEditing ? (
//                       <Select
//                         value={formData.state_id}
//                         onValueChange={handleStateChange}
//                         disabled={isLoading || !formData.country_id}
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder={formData.country_id ? "Select State" : "Select Country First"} />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {filteredStates.map((state) => (
//                             <SelectItem key={state.state_id} value={state.state_id}>
//                               {state.state_name}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     ) : (
//                       <Input
//                         id="profile-state"
//                         value={formData.state_name}
//                         disabled
//                         className="bg-gray-50"
//                       />
//                     )}
//                   </div>
//                 </div>

//                 {isEditing && (
//                   <div className="pt-4">
//                     <Button
//                       type="submit"
//                       className="w-full bg-gradient-to-r from-green-600 to-emerald-500"
//                       disabled={isLoading}
//                     >
//                       {isLoading ? 'Saving...' : 'Save Changes'}
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </form>
//           </Card>

//           {/* Change Password Card */}
//           <Card className="p-8">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold">Change Password</h2>
//               {!showPasswordFields ? (
//                 <Button
//                   onClick={() => setShowPasswordFields(true)}
//                   variant="outline"
//                 >
//                   Change Password
//                 </Button>
//               ) : (
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setShowPasswordFields(false);
//                     setFormData(prev => ({
//                       ...prev,
//                       currentPassword: '',
//                       newPassword: '',
//                       confirmPassword: ''
//                     }));
//                   }}
//                 >
//                   Cancel
//                 </Button>
//               )}
//             </div>

//             {showPasswordFields && (
//               <form onSubmit={handleChangePassword}>
//                 <div className="space-y-4">
//                   <div>
//                     <Label htmlFor="current-password">Current Password *</Label>
//                     <Input
//                       id="current-password"
//                       type="password"
//                       value={formData.currentPassword}
//                       onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
//                       required
//                       placeholder="Enter your current password"
//                     />
//                   </div>

//                   <div>
//                     <Label htmlFor="new-password">New Password *</Label>
//                     <Input
//                       id="new-password"
//                       type="password"
//                       value={formData.newPassword}
//                       onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
//                       required
//                       placeholder="Enter new password (min. 6 characters)"
//                     />
//                   </div>

//                   <div>
//                     <Label htmlFor="confirm-password">Confirm New Password *</Label>
//                     <Input
//                       id="confirm-password"
//                       type="password"
//                       value={formData.confirmPassword}
//                       onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
//                       required
//                       placeholder="Confirm your new password"
//                     />
//                   </div>

//                   <Button
//                     type="submit"
//                     className="w-full bg-gradient-to-r from-green-600 to-emerald-500"
//                     disabled={isLoading}
//                   >
//                     {isLoading ? 'Updating...' : 'Update Password'}
//                   </Button>
//                 </div>
//               </form>
//             )}

//             {!showPasswordFields && (
//               <div className="text-center py-4 text-gray-500">
//                 <p>Keep your account secure with a strong password</p>
//               </div>
//             )}
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };


import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, Building, CreditCard, Lock, Loader2  } from 'lucide-react';
import { Button } from '../app/components/ui/button';
import { Card } from '../app/components/ui/card';
import { Input } from '../app/components/ui/input';
import { Label } from '../app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../app/components/ui/select';
import { toast } from 'sonner';
import { apiService } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';

interface PageProps {
  onNavigate: (page: string) => void;
}

interface Country {
  country_id: string;
  country_name: string;
}

interface State {
  state_id: string;
  state_name: string;
  country_name: string;
  country_id: string;
}

interface FieldErrors {
  st_email?: string;
  st_contact_number?: string;
  name?: string;
  address?: string;
  city?: string;
  pincode?: string;
  state?: string;
  country?: string;
  general?: string;
}

export const ProfilePage: React.FC<PageProps> = ({ onNavigate }) => {
  const { user, updateUser, refreshUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    user_id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    state_id: '',
    state_name: '',
    country_id: '',
    country_name: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [filteredStates, setFilteredStates] = useState<State[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  // Fetch countries and states on mount
  useEffect(() => {
    fetchCountries();
    fetchStates();
  }, []);

  // Load user data when user changes
  useEffect(() => {
    if (user?.user_id) {
      loadUserData();
    }
  }, [user, states, countries]);

  const loadUserData = () => {
    if (user) {
      // Find country_id from country_name
      const countryObj = countries.find(c => c.country_name === user.country);
      // Find state_id from state_name
      const stateObj = states.find(s => s.state_name === user.state);
      
      setFormData(prev => ({
        ...prev,
        user_id: user.user_id || '',
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        pincode: user.pincode || '',
        state_id: stateObj?.state_id || '',
        state_name: user.state || '',
        country_id: countryObj?.country_id || '',
        country_name: user.country || ''
      }));
      
      // Filter states based on country
      if (countryObj?.country_id) {
        const filtered = states.filter(s => s.country_id === countryObj.country_id);
        setFilteredStates(filtered);
      }
    }
  };

  const fetchCountries = async () => {
    try {
      const data = await apiService.getCountries();
      setCountries(data);
    } catch (error) {
      console.error('Error fetching countries:', error);
      toast.error('Failed to load countries');
    }
  };

  const fetchStates = async () => {
    try {
      const data = await apiService.getStates();
      setStates(data);
    } catch (error) {
      console.error('Error fetching states:', error);
      toast.error('Failed to load states');
    }
  };

  const handleCountryChange = (countryId: string) => {
    const selectedCountry = countries.find(c => c.country_id === countryId);
    
    // Filter states based on selected country
    const filtered = states.filter(s => s.country_id === countryId);
    setFilteredStates(filtered);
    
    setFormData(prev => ({
      ...prev,
      country_id: countryId,
      country_name: selectedCountry?.country_name || '',
      state_id: '',
      state_name: ''
    }));
    
    // Clear field errors when user makes changes
    if (fieldErrors.country) {
      setFieldErrors(prev => ({ ...prev, country: undefined }));
    }
  };

  const handleStateChange = (stateId: string) => {
    const selectedState = states.find(s => s.state_id === stateId);
    setFormData(prev => ({
      ...prev,
      state_id: stateId,
      state_name: selectedState?.state_name || ''
    }));
    
    // Clear field errors when user makes changes
    if (fieldErrors.state) {
      setFieldErrors(prev => ({ ...prev, state: undefined }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear specific field error when user starts typing
    const errorFieldMap: { [key: string]: keyof FieldErrors } = {
      'name': 'name',
      'email': 'st_email',
      'phone': 'st_contact_number',
      'address': 'address',
      'city': 'city',
      'pincode': 'pincode'
    };
    
    const errorField = errorFieldMap[field];
    if (errorField && fieldErrors[errorField]) {
      setFieldErrors(prev => ({ ...prev, [errorField]: undefined }));
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFieldErrors({}); // Clear all previous errors

    try {
      // Send IDs for state and country, not names
      const response = await apiService.updateUserProfile({
        user_id: formData.user_id,
        name: formData.name,
        st_contact_number: formData.phone,
        st_email: formData.email,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        state_id: formData.state_id,
        country_id: formData.country_id
      });

      console.log('Update profile response received:', response);

      // Check if the response indicates success (status true AND code 200)
      if (response.status === true && response.code === 200) {
        toast.success('Profile updated successfully!', {
          duration: 3000,
          position: 'top-right'
        });
        setIsEditing(false);
        
        // Update user context with the new data
        updateUser({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          state: formData.state_name,
          country: formData.country_name
        });
        
        // Refresh profile to ensure data consistency
        await refreshUserProfile();
        
      } else {
        // Handle validation errors (status false, code 404 or other)
        if (response.message) {
          // Check if message is an object with field-specific errors
          if (typeof response.message === 'object' && response.message !== null) {
            const errors = response.message;
            setFieldErrors(errors);
            
            // Display each error message in toast
            const errorMessages: string[] = [];
            Object.keys(errors).forEach((field) => {
              const errorMessage = errors[field];
              errorMessages.push(errorMessage);
              toast.error(errorMessage, {
                duration: 4000,
                position: 'top-right'
              });
            });
            
            // Show a summary toast if there are multiple errors
            if (errorMessages.length > 1) {
              toast.error(`Please fix ${errorMessages.length} errors in the form`, {
                duration: 5000,
                position: 'top-right'
              });
            }
            
          } else if (typeof response.message === 'string') {
            // If message is a string
            const errorMessage = response.message;
            toast.error(errorMessage, {
              duration: 4000,
              position: 'top-right'
            });
            setFieldErrors({ general: errorMessage });
          } else {
            throw new Error('Failed to update profile');
          }
        } else {
          throw new Error('Failed to update profile');
        }
      }
      
    } catch (error: any) {
      console.error('Error updating profile:', error);
      
      // Handle different types of errors
      if (error.message === 'Failed to fetch') {
        const errorMsg = 'Network error. Please check your internet connection.';
        toast.error(errorMsg, {
          duration: 5000,
          position: 'top-right'
        });
        setFieldErrors({ general: errorMsg });
      } else if (error.message === 'Server returned unexpected response format') {
        const errorMsg = 'Server error. Please try again later.';
        toast.error(errorMsg, {
          duration: 5000,
          position: 'top-right'
        });
        setFieldErrors({ general: errorMsg });
      } else {
        toast.error(error.message || 'Failed to update profile. Please try again.', {
          duration: 4000,
          position: 'top-right'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validate password length
  if (formData.newPassword.length < 6) {
    toast.error('Password must be at least 6 characters long', {
      duration: 4000,
      position: 'top-right'
    });
    return;
  }

  // Check if passwords match
  if (formData.newPassword !== formData.confirmPassword) {
    toast.error('New password and confirm password do not match', {
      duration: 4000,
      position: 'top-right'
    });
    return;
  }

  setIsLoading(true);
  try {
    const response = await apiService.changePassword({
      user_id: formData.user_id,
      username: formData.email, // Using email as username
      password: formData.newPassword
    });

    console.log('Change password API response:', response);

    // Check if password change was successful
    if (response.status === true && response.code === 200) {
      toast.success(response.message || 'Password changed successfully!', {
        duration: 3000,
        position: 'top-right'
      });
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        newPassword: '',
        confirmPassword: ''
      }));
      
      // Close password change form
      setShowPasswordFields(false);
      
    } else if (response.status === false) {
      // Handle validation errors
      if (response.message && typeof response.message === 'object') {
        const errors = response.message;
        Object.keys(errors).forEach((field) => {
          toast.error(errors[field], {
            duration: 4000,
            position: 'top-right'
          });
        });
      } else if (response.message) {
        toast.error(response.message, {
          duration: 4000,
          position: 'top-right'
        });
      } else {
        toast.error('Failed to change password. Please try again.', {
          duration: 4000,
          position: 'top-right'
        });
      }
    } else {
      throw new Error(response.message || 'Failed to change password');
    }
    
  } catch (error: any) {
    console.error('Error changing password:', error);
    
    if (error.message === 'Failed to fetch') {
      toast.error('Network error. Please check your connection.', {
        duration: 5000,
        position: 'top-right'
      });
    } else {
      toast.error(error.message || 'Failed to change password. Please try again.', {
        duration: 4000,
        position: 'top-right'
      });
    }
  } finally {
    setIsLoading(false);
  }
};

  // Helper function to check if a field has error
  const hasError = (fieldName: keyof FieldErrors): boolean => {
    return !!fieldErrors[fieldName];
  };

  // Helper function to get error message for a field
  const getErrorMessage = (fieldName: keyof FieldErrors): string => {
    return fieldErrors[fieldName] || '';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-12 text-center max-w-md">
          <User className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Not Logged In</h2>
          <p className="text-gray-600 mb-6">Please login to view your profile</p>
          <Button onClick={() => onNavigate('login')} className="bg-gradient-to-r from-green-600 to-emerald-500">
            Login Now
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative bg-gradient-to-r from-green-600 to-emerald-500 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-4">My Profile</h1>
            <p className="text-xl opacity-90">Manage your account details</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Display general error if exists */}
          {fieldErrors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{fieldErrors.general}</p>
            </div>
          )}

          {/* Profile Information Card */}
          <Card className="p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Profile Information</h2>
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-500"
                >
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      loadUserData();
                      setFieldErrors({}); // Clear errors when cancelling
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <form onSubmit={handleUpdateProfile}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="profile-name">Full Name *</Label>
                  <Input
                    id="profile-name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing || isLoading}
                    required
                    className={`${!isEditing ? "bg-gray-50" : ""} ${
                      hasError('name') ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                  {hasError('name') && (
                    <p className="text-red-500 text-sm mt-1">{getErrorMessage('name')}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="profile-email">Email Address *</Label>
                  <Input
                    id="profile-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing || isLoading}
                    required
                    className={`${!isEditing ? "bg-gray-50" : ""} ${
                      hasError('st_email') ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                  {hasError('st_email') && (
                    <p className="text-red-500 text-sm mt-1">{getErrorMessage('st_email')}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="profile-phone">Phone Number *</Label>
                  <Input
                    id="profile-phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing || isLoading}
                    required
                    className={`${!isEditing ? "bg-gray-50" : ""} ${
                      hasError('st_contact_number') ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                  {hasError('st_contact_number') && (
                    <p className="text-red-500 text-sm mt-1">{getErrorMessage('st_contact_number')}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="profile-address">Address</Label>
                  <Input
                    id="profile-address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing || isLoading}
                    className={`${!isEditing ? "bg-gray-50" : ""} ${
                      hasError('address') ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                    placeholder="Enter your address"
                  />
                  {hasError('address') && (
                    <p className="text-red-500 text-sm mt-1">{getErrorMessage('address')}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="profile-city">City</Label>
                    <Input
                      id="profile-city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      disabled={!isEditing || isLoading}
                      className={`${!isEditing ? "bg-gray-50" : ""} ${
                        hasError('city') ? "border-red-500 focus:ring-red-500" : ""
                      }`}
                      placeholder="Enter your city"
                    />
                    {hasError('city') && (
                      <p className="text-red-500 text-sm mt-1">{getErrorMessage('city')}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="profile-pincode">Pincode</Label>
                    <Input
                      id="profile-pincode"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      disabled={!isEditing || isLoading}
                      className={`${!isEditing ? "bg-gray-50" : ""} ${
                        hasError('pincode') ? "border-red-500 focus:ring-red-500" : ""
                      }`}
                      placeholder="Enter pincode"
                    />
                    {hasError('pincode') && (
                      <p className="text-red-500 text-sm mt-1">{getErrorMessage('pincode')}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="profile-country">Country</Label>
                    {isEditing ? (
                      <>
                        <Select
                          value={formData.country_id}
                          onValueChange={handleCountryChange}
                          disabled={isLoading}
                        >
                          <SelectTrigger className={hasError('country') ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select Country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country.country_id} value={country.country_id}>
                                {country.country_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {hasError('country') && (
                          <p className="text-red-500 text-sm mt-1">{getErrorMessage('country')}</p>
                        )}
                      </>
                    ) : (
                      <Input
                        id="profile-country"
                        value={formData.country_name}
                        disabled
                        className="bg-gray-50"
                      />
                    )}
                  </div>

                  <div>
                    <Label htmlFor="profile-state">State</Label>
                    {isEditing ? (
                      <>
                        <Select
                          value={formData.state_id}
                          onValueChange={handleStateChange}
                          disabled={isLoading || !formData.country_id}
                        >
                          <SelectTrigger className={hasError('state') ? "border-red-500" : ""}>
                            <SelectValue placeholder={formData.country_id ? "Select State" : "Select Country First"} />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredStates.map((state) => (
                              <SelectItem key={state.state_id} value={state.state_id}>
                                {state.state_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {hasError('state') && (
                          <p className="text-red-500 text-sm mt-1">{getErrorMessage('state')}</p>
                        )}
                      </>
                    ) : (
                      <Input
                        id="profile-state"
                        value={formData.state_name}
                        disabled
                        className="bg-gray-50"
                      />
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-500"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                )}
              </div>
            </form>
          </Card>

          {/* Change Password Card */}
            <Card className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Change Password</h2>
                {!showPasswordFields ? (
                <Button
                    onClick={() => setShowPasswordFields(true)}
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50"
                >
                    Change Password
                </Button>
                ) : (
                <Button
                    variant="outline"
                    onClick={() => {
                    setShowPasswordFields(false);
                    setFormData(prev => ({
                        ...prev,
                        newPassword: '',
                        confirmPassword: ''
                    }));
                    }}
                >
                    Cancel
                </Button>
                )}
            </div>

            {showPasswordFields && (
                <form onSubmit={handleChangePassword}>
                <div className="space-y-4">
                    <div>
                    <Label htmlFor="new-password">New Password *</Label>
                    <Input
                        id="new-password"
                        type="password"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        required
                        placeholder="Enter new password (min. 8 characters)"
                        className="focus:ring-green-500 focus:border-green-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter your min 8 and 20 max digit password</p>
                    </div>

                    <div>
                    <Label htmlFor="confirm-password">Confirm New Password *</Label>
                    <Input
                        id="confirm-password"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                        placeholder="Confirm your new password"
                        className="focus:ring-green-500 focus:border-green-500"
                    />
                    </div>

                    <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600"
                    disabled={isLoading}
                    >
                    {isLoading ? (
                        <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                        </>
                    ) : (
                        'Update Password'
                    )}
                    </Button>
                </div>
                </form>
            )}

            {!showPasswordFields && (
                <div className="text-center py-6 text-gray-500">
                <Lock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Keep your account secure with a strong password</p>
                <p className="text-sm mt-2">Password should be at least 6 characters long</p>
                </div>
            )}
            </Card>
        </div>
      </div>
    </div>
  );
};