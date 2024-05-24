import {NavigationArguments} from "../types";
import './NavigationComponent.css';

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
        </ul>
    )
}
