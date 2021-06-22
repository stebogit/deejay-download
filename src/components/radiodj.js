import axios from 'axios';

const URL = 'https://media.deejay.it';

const format = (date, glue = '') => date.split('-').join(glue);

const getHeaders = (date, showName, showCode) => ({'x-request': JSON.stringify({date, showName, showCode})});

export function getDJCI(date) {
  // https://media.deejay.it/2021/06/18/episodes/deejay_chiama_italia/deejay_chiama_italia-20210618.mp3
  const url = `${URL}/${format(date, '/')}/episodes/deejay_chiama_italia/deejay_chiama_italia-${format(date)}.mp3`;
  const headers = getHeaders(date, 'Deejay Chiama Italia', 'djci');
  return axios.head(url, {headers}).catch(error);
}

export function getDJCIOld(date) {
  // https://media.deejay.it/2020/07/24/episodes/deejay_chiama_italia/20200724.mp3
  const url = `${URL}/${format(date, '/')}/episodes/deejay_chiama_italia/${format(date)}.mp3`;
  const headers = getHeaders(date, 'Deejay Chiama Italia', 'djci');
  return axios.head(url, {headers}).catch(error);
}

export function getNoSpoiler(date) {
  // https://media.deejay.it/2020/07/24/episodes/no_spoiler/20200724.mp3
  // https://media.deejay.it/2021/06/20/episodes/no_spoiler/no_spoiler-20210620.mp3
  const url = `${URL}/${format(date, '/')}/episodes/no_spoiler/no_spoiler-${format(date)}.mp3`;
  const headers = getHeaders(date, 'No Spoiler', 'nosp');
  return axios.head(url, {headers});
}

export function getVolo(date) {
  // https://media.deejay.it/2020/08/21/episodes/il_volo_del_mattino/20200821.mp3
  // https://media.deejay.it/2020/08/21/episodes/il_volo_del_mattino/il_volo_del_mattino-20200821.mp3
  const url = `${URL}/${format(date, '/')}/episodes/il_volo_del_mattino/il_volo_del_mattino-${format(date)}.mp3`;
  const headers = getHeaders(date, 'Il Volo del Mattino', 'volo');
  return axios.head(url, {headers});
}

function error(e) {
  console.log(e);
  return e;
}
