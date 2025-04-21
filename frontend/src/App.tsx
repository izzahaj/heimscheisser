import './App.css'
import TopNav from './common/layouts/TopNav'
import { BottomNav } from './features/ToiletMap/components/BottomNav'
import { ToiletMapPage } from './features/ToiletMap/pages'

function App() {

  return (
    <>
      <TopNav />
      <ToiletMapPage />
      <BottomNav />
    </>
  )
}

export default App
