//293.

import { async } from 'regenerator-runtime';
import { TIMEOUT_SECONDS } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SECONDS)]); // race između timeout funkcije i getJson
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
    // s ovom linijom iznad rejectamo getJSON Promise, te se javi greška na model.js, jer se nije automatski propagirala do async getJSON funkcije
  }
};

// tu bila getJSON metoda

// export const sendJSON = async function (url, uploadData) {
//   try {
//     const fetchPromise = fetch(url, {
//       method: 'POST',<<<<<<<<<<<<<<<
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(uploadData),
//     });
//     const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SECONDS)]); // race između timeout funkcije i getJson
//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data;
//   } catch (err) {
//     throw err;
//     // s ovom linijom iznad rejectamo getJSON Promise, te se javi greška na model.js, jer se nije automatski propagirala do async getJSON funkcije
//   }
// };
