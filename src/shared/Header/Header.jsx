import './Header.scss'
import Nav from '../../components/Nav/Nav'
import LogguedUserNav from '../../components/LogguedUserNav/LogguedUserNav'
import { useLocation } from "react-router-dom"

export default function Header() {
    
  const location = useLocation()

  return (
        <header>
            <div className="logo-head">
                <img src="/assets/SocialProgramminglogo.png" alt="Logo Social Programming" />
            </div>
            {
               location.pathname.includes('/admin') ? <LogguedUserNav /> : <Nav />
            
            }
            <div className="responsive-nav-btn">
                <i className="fas fa-bars"></i> 
                <i className="fas fa-user"></i>
            </div>

        </header>
  )
}
