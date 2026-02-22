import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { ApolloProvider } from '@apollo/client/react'
import { client } from './lib/apolloClient'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ApolloProvider client={client}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ApolloProvider>
    </ErrorBoundary>
  </StrictMode>,
)
