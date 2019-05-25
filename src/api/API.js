
import { API_URL } from '../constants';

class API {
  constructor() {
    this.BASE_URL = 'https://api.elections.openknowledge.be/format-i';
    this.headers = {
      Accept: 'application/json'
    };
  }

  get fetchOptions() {
    return {
      headers: this.headers
    }
  }

  handleResponse = async (response) => {
    if (!response.ok) {
      if (!response.statusText) throw Error('unknown error');
      throw Error(response.statusText);
    }
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) return response.json();
    return response;
  }

  getEntities = (type = 'CK', year = 2019) => {
    return fetch(`${this.BASE_URL}/entities/${year}/${type}`, this.fetchOptions).then(this.handleResponse);
  }

  getGroups = (type = 'CK', year = 2019) => {
    return fetch(`${this.BASE_URL}/groups/${year}/${type}`, this.fetchOptions).then(this.handleResponse);
  }

  getLists = (type = 'CK', year = 2019) => {
    return fetch(`${this.BASE_URL}/lists/${year}/${type}`, this.fetchOptions).then(this.handleResponse);
  }

  getCandidates = (type = 'CK', year = 2019) => {
    return fetch(`${this.BASE_URL}/candidates/${year}/${type}`, this.fetchOptions).then(this.handleResponse);
  }
}

export default API;
