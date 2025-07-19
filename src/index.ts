import { ItemAPI } from './components/ItemAPI';
import { API_URL, CDN_URL } from './utils/constants';
import './scss/styles.scss';


const api = new ItemAPI(API_URL, CDN_URL);

api.getItems().then(items => console.log(items));