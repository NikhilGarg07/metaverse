import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressBook, faHome, faPerson } from '@fortawesome/free-solid-svg-icons'

const Header = () => {
  return (
    
<div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
    <ul className="flex flex-wrap -mb-px justify-center">
        <li className="mr-2">
            <a href="/" className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">Home</a>
        </li>
        <li className="mr-2">
            <a href="/about" className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">About</a>
        </li>
    </ul>
</div>

  );
}

export default Header;