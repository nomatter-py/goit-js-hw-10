import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import countryList from '../templates/country-list.hbs';
import countryCard from '../templates/country-card.hbs';
import { refs } from './refs';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const onSearchInput = evt => {
    let name = refs.searchBox.value.trim();
    if (name === '') {
        refreshListMarkup();
        return
    };
    fetchCountries(name).then(countries => {
        handleDataList(countries);
    });
};

function handleDataList(countries) {
    if (!countries) {
        return;
    }
    renderList(countries);
}

function renderList(countries) {
    let list;  
    if (countries.length === 0) refreshListMarkup();
    if (countries.length > 1 && countries.length < 10) {
        refreshListMarkup();
        list = countryList(countries);
        refs.countryList.insertAdjacentHTML('beforeend', list);
    } else if (countries.length === 1) {
        refreshListMarkup();
        countries[0].formattedLanguage = Object.values(countries[0].languages).join(',');
        list = countryCard(countries[0]);
        refs.countryInfo.insertAdjacentHTML('beforeend', list);
    } else {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    }
}


function refreshListMarkup() {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
}

refs.searchBox.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY));
