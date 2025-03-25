import { Toaster } from "sonner"
import AppRoutes from "./router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" richColors closeButton />
      <AppRoutes />
    </QueryClientProvider>
  )
}

export default App