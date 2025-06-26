import { create } from 'zustand';

const useInputStore = create((set) => ({
  inputValue: {
    prompt: ""
  },
  
  // Action to update input value
  setInputValue: (newValue) => set((state) => ({
    inputValue: { ...state.inputValue, ...newValue }
  })),
  
  // Action to update just the prompt
  setPrompt: (prompt) => set((state) => ({
    inputValue: { ...state.inputValue, prompt }
  })),
  
  // Action to clear input
  clearInput: () => set(() => ({
    inputValue: { prompt: "" }
  })),

  // New actions for API response
  setApiResponse: (response) => set(() => ({
    apiResponse: response,
    isLoading: false,
    error: null
  })),
  
  setLoading: (loading) => set(() => ({
    isLoading: loading
  })),
  
  setError: (error) => set(() => ({
    error: error,
    isLoading: false
  })),
  
  clearApiResponse: () => set(() => ({
    apiResponse: null,
    error: null,
    isLoading: false
  })),

  setProjectRespose: (response) => set(()=> ({
    projectResponse: response,
    isLoading: false,
    error: null
  }))
}));

export default useInputStore;