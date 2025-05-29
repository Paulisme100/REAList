import "./Header.css"
import {AiFillPlusCircle, AiOutlineUser} from 'react-icons/ai'
import { Link } from 'react-router-dom'
import AuthStore from '../stores/UserAuthStore'
import AgencyAuthStore from "../stores/AgencyAuthStore"

const Header = () => {

    const {user, login, logout} = AuthStore()
    const {agency, login: loginAgency, logout: logoutAgency} = AgencyAuthStore()
    let path = '/'
    if(user || agency)
    {
        path = '/add-property'
    }
    else {
        path = '/login'
    }

    return(
        <>
            <header className='navbar'>
                <div className='navbar-content'>
                    <div className="logo">
                        <Link to='/'>
                            <h1>REAList</h1>
                        </Link>
                    </div>

                    <div className='ad-prop action'>                   
                        <Link to={path}>
                            <div style={{textAlign: 'center'}}>
                                <p>
                                    <AiFillPlusCircle style={{margin: '0 auto', fontSize: '1.5em', cursor: 'pointer'}}></AiFillPlusCircle>
                                </p>
                            </div>
                            <div>
                                Advertise <br/> Property
                            </div>
                        </Link>
                        
                    </div>

                    <div className='userArea action' style={{cursor: 'pointer'}}>
                        {
                            user ? (
                                <Link to='/profile'>
                                    <AiOutlineUser />
                                    <p>{user.name}</p>
                                </Link>
                                ) : agency ? (
                                <Link to='/agency-main'>
                                    <AiOutlineUser />
                                    <p>{agency.company_name}</p>
                                </Link>
                                ) : (
                                <Link to='/login'>
                                    <AiOutlineUser />
                                    <p>No user</p>
                                </Link>
                                )                            
                        }
                        
                    </div>
                   
                </div>
            </header>
        </>
    )

}

export default Header