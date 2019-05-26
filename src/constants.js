import BaseAPI from './api/API';

export const API = new BaseAPI();

export const ELECTION_TYPES = [
  'CK',
  'VL',
  'WL',
  'BR',
  'DE',
  'EU'
];

export const ELECTION_TYPE_MAP = {
  CK: {
    fr: 'Chambre',
    nl: 'Kamer'
  },
  VL: {
    fr: 'Parlement flamand',
    nl: 'Vlaams Parlement'
  },
  WL: {
    fr: 'Parlement régional wallon ',
    nl: 'Waals Parlement'
  },
  BR: {
    fr: 'Parlement de la Région de Bruxelles-Capitale',
    nl: 'Brussels Hoofdstedelijk Parlement'
  },
  DE: {
    fr: 'Parlement de la Communauté germanophone',
    nl: 'Parlement van de Duitstalige Gemeenschap'
  },
  EU: {
    fr: 'Parlement européen',
    nl: 'Europees Parlement'
  }
};


export const TRANSLATIONS = {

}
