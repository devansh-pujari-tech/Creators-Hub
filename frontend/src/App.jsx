//creaters hub
import { useState } from 'react'
import './App.css'

function App() {
  return (
    <div className="App">
      <h1>Frontend-Backend Connectivity Test</h1>
      <ConnectionTest />
    </div>
  )
}

function ConnectionTest() {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch('/api/test')
      if (response.ok) {
        const data = await response.json()
        setMessage(`Success: ${data.message} at ${data.timestamp}`)
      } else {
        setError(`Error: ${response.status} ${response.statusText}`)
      }
    } catch (err) {
      setError(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="connection-test">
      <button onClick={testConnection} disabled={loading}>
        {loading ? 'Testing...' : 'Test Connection'}
      </button>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  )
}

export default App