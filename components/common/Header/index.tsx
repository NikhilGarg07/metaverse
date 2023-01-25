import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressBook, faHome, faPerson } from '@fortawesome/free-solid-svg-icons'

const Header = () => {
  return (
    <header className='bg-gray-900 items-center leading-10 h-10'>
      <nav>
        <ul className='flex text-white justify-center'>
          <li className='mr-4'><a href="/"><FontAwesomeIcon icon={faHome} /> Home</a></li>
          <li className='mr-4'><a href="/about">About</a></li>
          <li className='mr-4'><a href="/contact"><FontAwesomeIcon icon={faAddressBook} />Contact</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;