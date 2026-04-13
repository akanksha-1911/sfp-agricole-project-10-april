// apiService.ts
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import { Product } from '../types';

export interface BannerSlideData {
  banner_id: string;
  banner_title: string;
  banner_caption: string;
  banner_image: string;
}

export interface TestimonialData {
  testimonial_id: string;
  testimonial_name: string;
  testimonial_review: string;
  testimonial_image: string;
}

export const apiService = {

      async getTestimonials(): Promise<TestimonialData[]> {
      try {
        const url = `${API_BASE_URL}${API_ENDPOINTS.TESTIMONIALS}`;
        console.log('Fetching testimonials from:', url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          if (data.status && data.code === 200 && data.data) {
            return data.data;
          }
          throw new Error(data.message || 'Failed to fetch testimonials');
        } else {
          console.warn('Non-JSON response for testimonials');
          return [];
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        return [];
      }
    },

async getProducts() {
  try {
    const url = `${API_BASE_URL}/api/get_products`;
    console.log('Fetching products from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      if (data.status && data.code === 200 && data.data) {
        return data.data;
      }
      throw new Error(data.message || 'Failed to fetch products');
    } else {
      console.warn('Non-JSON response for products');
      return [];
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
},

    async postFeedback(feedbackData: {
      st_name: string;
      st_phone: string;
      st_email: string;
      st_message: string;
      st_subject: string;
    }) {
      try {
        console.log('Sending feedback request with form-data:', { 
          ...feedbackData, 
          st_message: '***' 
        });
        
        // Create FormData object using URLSearchParams
        const formData = new URLSearchParams();
        formData.append('st_name', feedbackData.st_name);
        formData.append('st_phone', feedbackData.st_phone);
        formData.append('st_email', feedbackData.st_email);
        formData.append('st_message', feedbackData.st_message);
        formData.append('st_subject', feedbackData.st_subject);
        
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FEEDBACK}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
          body: formData.toString(),
        });
        
        console.log('Feedback response status:', response.status);
        
        // Check if response is OK
        if (!response.ok) {
          const text = await response.text();
          console.error('Feedback failed with status:', response.status);
          console.error('Response text:', text.substring(0, 500));
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        
        // Parse response
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('Feedback response data:', data);
          return data;
        } else {
          const text = await response.text();
          console.error('Non-JSON response:', text);
          throw new Error('Server returned unexpected response format');
        }
      } catch (error) {
        console.error('Feedback error:', error);
        throw error;
      }
    },

    async getProductDetail(productId: string) {
      try {
        const url = `${API_BASE_URL}/api/get_product_detail?product_id=${productId}`;
        console.log('Fetching product detail from:', url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          if (data.status && data.code === 200 && data.data) {
            return data.data;
          }
          throw new Error(data.message || 'Failed to fetch product details');
        } else {
          console.warn('Non-JSON response for product detail');
          return null;
        }
      } catch (error) {
        console.error('Error fetching product detail:', error);
        throw error;
      }
    },

  // Get Home Banner Slides
  async getHomeBanner(): Promise<BannerSlideData[]> {
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.HOME_BANNER}`;
      console.log('Fetching home banner from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (data.status && data.code === 200 && data.data) {
          return data.data;
        }
        throw new Error(data.message || 'Failed to fetch banner slides');
      } else {
        console.warn('Non-JSON response for banner');
        return [];
      }
    } catch (error) {
      console.error('Error fetching home banner:', error);
      return [];
    }
  },

  // User Registration - Using FormData
  async register(userData: {
    st_name: string;
    st_contact_number: string;
    st_password: string;
    st_email: string;
  }) {
    try {
      console.log('Sending registration request with form-data:', { 
        ...userData, 
        st_password: '***' 
      });
      
      // Create FormData object
      const formData = new URLSearchParams();
      formData.append('st_name', userData.st_name);
      formData.append('st_contact_number', userData.st_contact_number);
      formData.append('st_password', userData.st_password);
      formData.append('st_email', userData.st_email);
      
      const response = await fetch(`${API_BASE_URL}/api/registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: formData.toString(),
      });
      
      console.log('Registration response status:', response.status);
      
      // Check if response is OK
      if (!response.ok) {
        const text = await response.text();
        console.error('Registration failed with status:', response.status);
        console.error('Response text:', text.substring(0, 500));
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      
      // Try to parse as JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('Registration response data:', data);
        return data;
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        
        // Try to extract PHP error messages
        if (text.includes('PHP Error')) {
          throw new Error('Server configuration error. Please contact support.');
        }
        throw new Error('Invalid server response format');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // User Login - Using FormData
  async login(credentials: {
    username: string;
    password: string;
  }) {
    try {
      console.log('Sending login request with form-data for:', credentials.username);
      
      // Create FormData object
      const formData = new URLSearchParams();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);
      
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: formData.toString(),
      });
      
      console.log('Login response status:', response.status);
      
      // Check if response is OK
      if (!response.ok) {
        const text = await response.text();
        console.error('Login failed with status:', response.status);
        console.error('Response text:', text.substring(0, 500));
        
        // Check for PHP errors in response
        if (text.includes('PHP Error')) {
          throw new Error('Server configuration error. Please contact support.');
        }
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      
      // Parse response
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('Login response data:', data);
        return data;
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        
        // Try to extract meaningful message
        if (text.includes('successfully loggedin')) {
          // If response contains success message but not JSON, try to parse manually
          console.log('Login appears successful from text response');
          return {
            status: true,
            code: 200,
            message: "You have successfully loggedin.",
            data: {
              user_logged: true,
              user_name: credentials.username.split('@')[0],
              user_id: Date.now().toString()
            }
          };
        }
        
        throw new Error('Server returned unexpected response format');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },


    // Add to cart
    async addToCart(cartData: {
      user_id: string;
      product_id: string;
      qty: number;
      price: number;
      total_price: number;
    }) {
      try {
        console.log('Sending add to cart request:', cartData);
        
        // Create FormData object
        const formData = new URLSearchParams();
        formData.append('user_id', cartData.user_id);
        formData.append('product_id', cartData.product_id);
        formData.append('qty', cartData.qty.toString());
        formData.append('price', cartData.price.toString());
        formData.append('total_price', cartData.total_price.toString());
        
        const response = await fetch(`${API_BASE_URL}/api/add_to_cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
          body: formData.toString(),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('Add to cart response:', data);
          return data;
        } else {
          const text = await response.text();
          console.error('Non-JSON response:', text);
          throw new Error('Server returned unexpected response format');
        }
      } catch (error) {
        console.error('Add to cart error:', error);
        throw error;
      }
    },

    // Add this method to your apiService object in apiService.ts

// Get CMS content
async getCMSContent(): Promise<any> {
  try {
    const url = `${API_BASE_URL}/api/get_cms`;
    console.log('Fetching CMS content from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      if (data.status && data.code === 200 && data.data) {
        return data.data;
      }
      throw new Error(data.message || 'Failed to fetch CMS content');
    } else {
      console.warn('Non-JSON response for CMS content');
      return null;
    }
  } catch (error) {
    console.error('Error fetching CMS content:', error);
    return null;
  }
},

    // Get cart
    async getCart(userId: string) {
      try {
        const url = `${API_BASE_URL}/api/get_cart?user_id=${userId}`;
        console.log('Fetching cart from:', url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          if (data.status && data.code === 200) {
            return data.data;
          }
          return [];
        } else {
          console.warn('Non-JSON response for cart');
          return [];
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        return [];
      }
    },

    // Update cart
    async updateCart(cartData: {
      user_id: string;
      product_id: string;
      qty: number;
      price: number;
      total_price: number;
    }) {
      try {
        console.log('Sending update cart request:', cartData);
        
        const formData = new URLSearchParams();
        formData.append('user_id', cartData.user_id);
        formData.append('product_id', cartData.product_id);
        formData.append('qty', cartData.qty.toString());
        formData.append('price', cartData.price.toString());
        formData.append('total_price', cartData.total_price.toString());
        
        const response = await fetch(`${API_BASE_URL}/api/update_cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
          body: formData.toString(),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('Update cart response:', data);
          return data;
        } else {
          const text = await response.text();
          console.error('Non-JSON response:', text);
          throw new Error('Server returned unexpected response format');
        }
      } catch (error) {
        console.error('Update cart error:', error);
        throw error;
      }
    },

    // Remove from cart
    async removeFromCart(userId: string, productId: string) {
      try {
        console.log('Sending remove from cart request:', { user_id: userId, product_id: productId });
        
        const formData = new URLSearchParams();
        formData.append('user_id', userId);
        formData.append('product_id', productId);
        
        const response = await fetch(`${API_BASE_URL}/api/remove_from_cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
          body: formData.toString(),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('Remove from cart response:', data);
          return data;
        } else {
          const text = await response.text();
          console.error('Non-JSON response:', text);
          throw new Error('Server returned unexpected response format');
        }
      } catch (error) {
        console.error('Remove from cart error:', error);
        throw error;
      }
    },
      // Categories - GET request
      async getCategories() {
        try {
          const url = `${API_BASE_URL}/api/get_category`;
          console.log('Fetching categories from:', url);
          
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            if (data.status && data.code === 200) {
              return data.data;
            }
            throw new Error(data.message || 'Failed to fetch categories');
          } else {
            console.warn('Non-JSON response for categories');
            return [];
          }
        } catch (error) {
          console.error('Error fetching categories:', error);
          return [];
        }
      },

      // Add to wishlist
      async addToWishlist(userId: string, productId: string) {
        try {
          console.log('Sending add to wishlist request:', { user_id: userId, product_id: productId });
          
          const formData = new URLSearchParams();
          formData.append('user_id', userId);
          formData.append('product_id', productId);
          
          const response = await fetch(`${API_BASE_URL}/api/add_to_wishlist`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json',
            },
            body: formData.toString(),
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            console.log('Add to wishlist response:', data);
            return data;
          } else {
            const text = await response.text();
            console.error('Non-JSON response:', text);
            throw new Error('Server returned unexpected response format');
          }
        } catch (error) {
          console.error('Add to wishlist error:', error);
          throw error;
        }
      },

      // Remove from wishlist
      async removeFromWishlist(userId: string, productId: string) {
        try {
          console.log('Sending remove from wishlist request:', { user_id: userId, product_id: productId });
          
          const formData = new URLSearchParams();
          formData.append('user_id', userId);
          formData.append('product_id', productId);
          
          const response = await fetch(`${API_BASE_URL}/api/remove_from_wishlist`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json',
            },
            body: formData.toString(),
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            console.log('Remove from wishlist response:', data);
            return data;
          } else {
            const text = await response.text();
            console.error('Non-JSON response:', text);
            throw new Error('Server returned unexpected response format');
          }
        } catch (error) {
          console.error('Remove from wishlist error:', error);
          throw error;
        }
      },

      // Get wishlist
      async getWishlist(userId: string) {
        try {
          const url = `${API_BASE_URL}/api/get_wishlist?user_id=${userId}`;
          console.log('Fetching wishlist from:', url);
          
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            if (data.status && data.code === 200) {
              return data.data;
            }
            return [];
          } else {
            console.warn('Non-JSON response for wishlist');
            return [];
          }
        } catch (error) {
          console.error('Error fetching wishlist:', error);
          return [];
        }
      },

  // Companies - GET request
  async getCompanies() {
    try {
      const url = `${API_BASE_URL}/api/get_company`;
      console.log('Fetching companies from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (data.status && data.code === 200) {
          return data.data;
        }
        throw new Error(data.message || 'Failed to fetch companies');
      } else {
        console.warn('Non-JSON response for companies');
        return [];
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      return [];
    }
  },

  // Get User Profile
  async getUserProfile(userId: string) {
    try {
      const url = `${API_BASE_URL}/api/get_profile?user_id=${userId}`;
      console.log('Fetching user profile from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (data.status && data.code === 200 && data.data) {
          return data;
        }
        throw new Error(data.message || 'Failed to fetch user profile');
      } else {
        throw new Error('Server returned unexpected response format');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },
  
  // // Update User Profile - Fix the parameter names to match what the server expects
  // async updateUserProfile(profileData: {
  //   user_id: string;
  //   name: string;
  //   st_contact_number: string;
  //   st_email: string;
  //   address: string;
  //   city: string;
  //   pincode: string;
  //   state_id: string;    
  //   country_id: string; 
  // }) {
  //   try {
  //     console.log('Sending update profile request:', profileData);
      
  //     const formData = new URLSearchParams();
  //     formData.append('user_id', profileData.user_id);
  //     formData.append('name', profileData.name);
  //     formData.append('st_contact_number', profileData.st_contact_number);
  //     formData.append('st_email', profileData.st_email);
  //     formData.append('address', profileData.address);
  //     formData.append('city', profileData.city);
  //     formData.append('pincode', profileData.pincode);
  //     formData.append('state', profileData.state_id);
  //     formData.append('country', profileData.country_id);
    
  //     console.log('Form data being sent:', Object.fromEntries(formData));
      
  //     const response = await fetch(`${API_BASE_URL}/api/update_profile`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/x-www-form-urlencoded',
  //         'Accept': 'application/json',
  //       },
  //       body: formData.toString(),
  //     });
      
  //     console.log('Update profile response status:', response.status);
  //     console.log('Update profile response headers:', response.headers.get('content-type'));
      
  //     if (!response.ok) {
  //       const text = await response.text();
  //       console.error('Update profile failed with status:', response.status);
  //       console.error('Response text:', text.substring(0, 500));
  //       throw new Error(`Server error: ${response.status} ${response.statusText}`);
  //     }
      
  //     const contentType = response.headers.get('content-type');
  //     if (contentType && contentType.includes('application/json')) {
  //       const data = await response.json();
  //       console.log('Update profile response:', data);
  //       return data;
  //     } else {
  //       const text = await response.text();
  //       console.error('Non-JSON response:', text);
        
  //       // If the response is HTML but contains a success message, try to extract it
  //       if (text.includes('Profile updated') || text.includes('success')) {
  //         console.log('Profile update appears successful from HTML response');
  //         return {
  //           status: true,
  //           code: 200,
  //           message: "Profile updated",
  //           data: []
  //         };
  //       }
        
  //       throw new Error('Server returned unexpected response format');
  //     }
  //   } catch (error) {
  //     console.error('Update profile error:', error);
  //     throw error;
  //   }
  // },

  // Update User Profile - Fix to handle validation errors properly
async updateUserProfile(profileData: {
  user_id: string;
  name: string;
  st_contact_number: string;
  st_email: string;
  address: string;
  city: string;
  pincode: string;
  state_id: string;    
  country_id: string; 
}) {
  try {
    console.log('Sending update profile request:', profileData);
    
    const formData = new URLSearchParams();
    formData.append('user_id', profileData.user_id);
    formData.append('name', profileData.name);
    formData.append('st_contact_number', profileData.st_contact_number);
    formData.append('st_email', profileData.st_email);
    formData.append('address', profileData.address);
    formData.append('city', profileData.city);
    formData.append('pincode', profileData.pincode);
    formData.append('state', profileData.state_id);
    formData.append('country', profileData.country_id);
  
    console.log('Form data being sent:', Object.fromEntries(formData));
    
    const response = await fetch(`${API_BASE_URL}/api/update_profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: formData.toString(),
    });
    
    console.log('Update profile response status:', response.status);
    
    // Parse the response regardless of status code
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('Update profile response data:', data);
      
      // Return the data along with the status code
      // Don't throw error for 404 if it's a validation error
      return {
        ...data,
        httpStatus: response.status
      };
    } else {
      const text = await response.text();
      console.error('Non-JSON response:', text);
      
      // If the response is HTML but contains a success message, try to extract it
      if (text.includes('Profile updated') || text.includes('success')) {
        console.log('Profile update appears successful from HTML response');
        return {
          status: true,
          code: 200,
          message: "Profile updated",
          data: []
        };
      }
      
      // Return error response structure
      return {
        status: false,
        code: response.status,
        message: "Server returned unexpected response format",
        data: []
      };
    }
  } catch (error) {
    console.error('Update profile error:', error);
    // Return error response structure instead of throwing
    return {
      status: false,
      code: 500,
      message: error instanceof Error ? error.message : "Network error occurred",
      data: []
    };
  }
},


  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const url = `${API_BASE_URL}/api/get_featured_products`;
      console.log('Fetching featured products from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (data.status && data.code === 200 && data.data) {
          // Transform API response to match Product type
          const products: Product[] = data.data.map((item: any) => ({
            id: item.product_id,
            name: item.product_name,
            price: parseFloat(item.product_price),
            mrp: parseFloat(item.product_mrp),
            category: item.product_category_name,
            brand: item.product_brand_name,
            company: item.product_company_name,
            images: [item.product_image],
            discount: parseFloat(item.product_mrp) > parseFloat(item.product_price)
              ? Math.round(((parseFloat(item.product_mrp) - parseFloat(item.product_price)) / parseFloat(item.product_mrp)) * 100)
              : 0,
            region: '',
            stock: 100,
            tags: [],
            description: '',
            isActive: true,
            isSpecialOffer: true
          }));
          return products;
        }
        throw new Error(data.message || 'Failed to fetch featured products');
      } else {
        console.warn('Non-JSON response for featured products');
        return [];
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  },


// Get Latest Products
async getLatestProducts(): Promise<Product[]> {
  try {
    const url = `${API_BASE_URL}/api/get_latest_products`;
    console.log('Fetching latest products from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      if (data.status && data.code === 200 && data.data) {
        // Transform API response to match Product type
        const products: Product[] = data.data.map((item: any) => ({
          id: item.product_id,
          name: item.product_name,
          price: parseFloat(item.product_price),
          mrp: parseFloat(item.product_mrp),
          category: item.product_category_name,
          brand: item.product_brand_name,
          company: item.product_company_name,
          images: [item.product_image],
          discount: parseFloat(item.product_mrp) > parseFloat(item.product_price)
            ? Math.round(((parseFloat(item.product_mrp) - parseFloat(item.product_price)) / parseFloat(item.product_mrp)) * 100)
            : 0,
          region: '',
          stock: 100,
          tags: [],
          description: '',
          isActive: true,
          isSpecialOffer: false
        }));
        return products;
      }
      throw new Error(data.message || 'Failed to fetch latest products');
    } else {
      console.warn('Non-JSON response for latest products');
      return [];
    }
  } catch (error) {
    console.error('Error fetching latest products:', error);
    return [];
  }
},

  // Get Countries
  async getCountries() {
    try {
      const url = `${API_BASE_URL}/api/get_countries`;
      console.log('Fetching countries from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (data.status && data.code === 200 && data.data) {
          return data.data;
        }
        throw new Error(data.message || 'Failed to fetch countries');
      } else {
        console.warn('Non-JSON response for countries');
        return [];
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
      return [];
    }
  },

  // Get States
  async getStates() {
    try {
      const url = `${API_BASE_URL}/api/get_states`;
      console.log('Fetching states from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (data.status && data.code === 200 && data.data) {
          return data.data;
        }
        throw new Error(data.message || 'Failed to fetch states');
      } else {
        console.warn('Non-JSON response for states');
        return [];
      }
    } catch (error) {
      console.error('Error fetching states:', error);
      return [];
    }
  },

  // Place Order / Checkout
  async placeOrder(orderData: {
    user_id: string;
    shipping_address: {
      full_name: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      state: string;
      country: string;
      pincode: string;
    };
    order_items: Array<{
      product_id: string;
      quantity: number;
      price: number;
      total_price: number;
    }>;
    payment_method: string;
    total_amount: number;
  }) {
    try {
      console.log('Sending place order request:', orderData);
      
      const response = await fetch(`${API_BASE_URL}/api/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      console.log('Place order response status:', response.status);
      
      // Check if response is OK
      if (!response.ok) {
        const text = await response.text();
        console.error('Place order failed with status:', response.status);
        console.error('Response text:', text.substring(0, 500));
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      
      // Parse response
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('Place order response data:', data);
        return data;
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned unexpected response format');
      }
    } catch (error) {
      console.error('Place order error:', error);
      throw error;
    }
  },

  // Change Password
  async changePassword(passwordData: {
    user_id: string;
    username: string; 
    password: string;   
  }) {
    try {
      console.log('Sending change password request');
      
      const formData = new URLSearchParams();
      formData.append('user_id', passwordData.user_id);
      formData.append('username', passwordData.username);
      formData.append('password', passwordData.password);
      
      const response = await fetch(`${API_BASE_URL}/api/change_password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: formData.toString(),
      });
      
      console.log('Change password response status:', response.status);
      
      // Parse the response regardless of status code
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('Change password response data:', data);
        return data;
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned unexpected response format');
      }
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  // Tags - GET request
  async getTags() {
    try {
      const url = `${API_BASE_URL}/api/get_tags`;
      console.log('Fetching tags from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (data.status && data.code === 200) {
          return data.data;
        }
        throw new Error(data.message || 'Failed to fetch tags');
      } else {
        console.warn('Non-JSON response for tags');
        return [];
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
      return [];
    }
  },
};