import axios from 'axios';

const deejay = axios.create({
  baseURL: 'https://media.deejay.it',
  validateStatus: (status) => status < 400,
});

/* for debug */
// deejay.interceptors.request.use(
//   (config) => {
//     console.log(axios.getUri(config));
//     return config;
//   },
//   null,
//   {synchronous: true},
// );

const format = (date, glue = '') => date.split('-').join(glue);

const getHeaders = (date, showName, showCode) => ({headers: {'x-request': JSON.stringify({date, showName, showCode})}});

export function getDJCI(date) {
  // https://media.deejay.it/2021/06/18/episodes/deejay_chiama_italia/deejay_chiama_italia-20210618.mp3
  const headers = getHeaders(date, 'Deejay Chiama Italia', 'djci');
  return [
    deejay.head(
      `/${format(date, '/')}/episodes/deejay_chiama_italia/deejay_chiama_italia-${format(date)}.mp3`,
      headers,
    ),
    deejay.head(`/${format(date, '/')}/episodes/deejay_chiama_italia/${format(date)}.mp3`, headers),
  ];
}

export function getNoSpoiler(date) {
  // https://media.deejay.it/2021/06/20/episodes/no_spoiler/no_spoiler-20210620.mp3
  const headers = getHeaders(date, 'No Spoiler', 'nosp');
  return [
    deejay.head(`/${format(date, '/')}/episodes/no_spoiler/no_spoiler-${format(date)}.mp3`, headers),
    deejay.head(`/${format(date, '/')}/episodes/no_spoiler/${format(date)}.mp3`, headers),
  ];
}

export function getVolo(date) {
  // https://media.deejay.it/2020/08/21/episodes/il_volo_del_mattino/il_volo_del_mattino-20200821.mp3
  const headers = getHeaders(date, 'Il Volo del Mattino', 'volo');
  return [
    deejay.head(`/${format(date, '/')}/episodes/il_volo_del_mattino/il_volo_del_mattino-${format(date)}.mp3`, headers),
    deejay.head(`/${format(date, '/')}/episodes/il_volo_del_mattino/${format(date)}.mp3`, headers),
  ];
}
