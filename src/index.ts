import { ApiItems } from './components/ApiItems';
import { API_URL, CDN_URL } from './utils/constants';
import './scss/styles.scss';


const api = new ApiItems(API_URL, CDN_URL);

api.getItems().then(items => console.log(items));