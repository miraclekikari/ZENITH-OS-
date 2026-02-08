import { library } from '@fortawesome/fontawesome-svg-core';
import { faHeart, faComment, faShare, faRedo, faSpinner, faCheck, faTimes, faLink, faSearch, faUser, faCog, faPlusSquare, faFlask, faGraduationCap, faGlobeAmericas, faSlidersH, faShieldAlt, faSatellite, faStethoscope, faSyncAlt, faDatabase, faTable, faUnlink, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

// Configurer la library FontAwesome
export const configureFontAwesome = () => {
  library.add(
    faHeart, faComment, faShare, faRedo, faSpinner, faCheck, faTimes, faLink, faSearch, 
    faUser, faCog, faPlusSquare, faFlask, faGraduationCap, faGlobeAmericas, faSlidersH, 
    faShieldAlt, faSatellite, faStethoscope, faSyncAlt, faDatabase, faTable, faUnlink, 
    faCheckCircle, faTimesCircle
  );
};

export default configureFontAwesome;
