import { FileUpload } from './components/FileUpload'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import './styles/globals.css'
import './styles/style.css'

export function App() {
  return (
    <div className="desktop">
      <div className="div">
        <Header />
        <FileUpload />
        <Footer />
      </div>
    </div>
  )
}
