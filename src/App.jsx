import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Current from './pages/Current'
import Claude from './pages/Claude'
import New from './pages/New'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Current />} />
        <Route path="/claude" element={<Claude />} />
        <Route path="/new" element={<New />} />
      </Routes>
    </BrowserRouter>
  )
}
