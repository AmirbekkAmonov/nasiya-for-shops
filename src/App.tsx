import { useState, useEffect } from "react"
import { Toaster } from "sonner"
import AppRoutes from "./router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500); 
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <img src="/imgs/LOGO.svg" alt="" className="loading-logo" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" richColors closeButton />
      <AppRoutes />
    </QueryClientProvider>
  )
}

export default App
