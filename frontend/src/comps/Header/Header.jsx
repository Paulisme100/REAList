import "./Header.css"
import {AiFillPlusCircle, AiOutlineUser} from 'react-icons/ai'
import { Link } from 'react-router-dom'
import AuthStore from '../stores/AuthStore'

const Header = () => {

    const {user, login, logout} = AuthStore()
    let path = '/'
    if(user)
    {
        path = '/add-property'
    }
    else {
        path = '/login'
    }

    return(
        <>
            <div className='navbar'>
                <div>
                    <Link to='/'>
                        <h1>REAList</h1>
                    </Link>
                </div>
                <div className='ad-prop'>                   
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

                <div className='userArea' style={{cursor: 'pointer'}}>
                    {
                        user ? (
                            <Link to='/profile'>
                                <AiOutlineUser></AiOutlineUser>
                                <p>{user.name}</p>
                            </Link>
                            
                        ) : (
                            <Link to='/login'>
                                <AiOutlineUser></AiOutlineUser>
                                <p>No user</p>
                            </Link>
                        )
                    }
                    
                </div>
            </div>
        </>
    )

}

export default Header