import axios from '../axios';

export const contactAPI = {
  submitContactForm: async (formData) => {
    try {
      const response = await axios.post('/contact/submit', formData);
      return response.data;
    } catch (error) {
      console.error('Contact form submission failed:', error);
      throw error;
    }
  },

  getContactInfo: async () => {
    try {
      const response = await axios.get('/contact/info');
      return response.data;
    } catch (error) {
      console.error('Fetching contact info failed:', error);
      throw error;
    }
  },
};
