import {NavigationArguments} from "../types/common";
import './NavigationComponent.css';
import logo from '../../images/logo.svg';

export const NavigationComponent = ({menuOptions, page, setPage}: NavigationArguments) => {
    return (
        <ul className='navigation'>
            <li className='logo'>
                <img src={logo}  alt={'Logo'}/>
            </li>
            {menuOptions.map(option => (
                <li className={page === option.link ? 'active' : ''}
                    onClick={() => setPage(option.link)}
                    style={option.alignRight ? {float:'right'} : {}}
                >
                    <a href={'#' + option.link}>{option.label}</a>
                </li>
            ))}
        </ul>
    )
}
