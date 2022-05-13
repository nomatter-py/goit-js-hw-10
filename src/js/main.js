import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const refs = {
    searchBox: document.getElementById('search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};


const onSearchInput = evt => {
    let name = refs.searchBox.value.trim();
    refreshListMarkup();
    if (name === '') return;
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
    if (countries.length === 0) refs.countryList.innerHTML = '';
    if (countries.length > 1 && countries.length < 10) {
        list = countries
        .map(item => {
            let name = item.name.common;
            let flag = item.flags.png;
            return `<li class="country-item">
                        <img src="${flag}" alt="${name}" width="40" />
                        <span class="country-name">${name}</span>
                    </li>`;
        })
        .join('');
        refs.countryList.insertAdjacentHTML('beforeend', list);
    } else if (countries.length === 1) {
        list = countries
        .map(item => {
            let { name, capital, flags, languages, population } = item;
            return `<div class="country-card">
                        <div class="country-card_header-wrapper">
                            <img src="${flags.png}" alt="${name.common}" width="40" />
                            <h1 class="country-card-name">${name.common}</h1>
                        </div>
                        <ul class="country-card-features" style="list-style: none; padding:0;">
                            <li><span style="font-weight: bold">Capital: </span>${capital}</li>
                            <li><span style="font-weight: bold">Population: </span>${population}</li>
                            <li><span style="font-weight: bold">Languages: </span>${Object.values(item.languages).join(',')}</li>
                        </ul>
                    </div>`;
        })
        .join('');
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
