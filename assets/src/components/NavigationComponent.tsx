import {NavigationArguments} from "../types/common";
import './NavigationComponent.css';
import logo from '../../images/logo.svg';

export const NavigationComponent = ({menuOptions, page, setPage}: NavigationArguments) => {
    return (
        <ul className='navigation'>

            {menuOptions.map(option => (
                <li className={page === option.link ? 'active' : ''}
                    onClick={() => setPage(option.link)}
                    style={option.alignRight ? {float:'right'} : {}}
                >
                    <a href={'#' + option.link}>{option.label}</a>
                </li>
            ))}
            <li className='logo' style={{float: 'right'}}>
                <img src={logo}  alt={'Logo'}/>
            </li>
        </ul>
    )
}
