import { faTwitter, faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Footer = () => {
    return ( 
        <footer className="bg-gray-900 text-white mt-2 py-4">
            <ul className="flex w-full justify-center">
                <li className="mx-4">
                    <a href=""></a>
                    <FontAwesomeIcon icon={faTwitter} width={25} />
                </li>
                <li className="mx-4">
                    <a href=""></a>
                    <FontAwesomeIcon icon={faInstagram} width={25} />
                </li>
                <li className="mx-4">
                    <a href=""></a>
                    <FontAwesomeIcon icon={faYoutube} width={25} />
                </li>
            </ul>

            <p className="text-sm text-center my-2">copyright &copy; 2023</p>
        </footer>
     );
}
 
export default Footer;