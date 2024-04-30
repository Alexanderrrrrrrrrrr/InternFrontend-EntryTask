import {encoded, translations} from './data.js'

console.log("Let's rock")
console.log(encoded, translations)

export function decodeFields(encoded, translations) {
    const decoded = encoded.map(item => {
      const decodedItem = {};
      for (const key in item) {
        if (key.endsWith('Id')) {
          decodedItem[key] = translations[item[key]] || item[key];
        } else if (['groupId', 'service', 'formatSize', 'ca'].includes(key)) {
          decodedItem[key] = item[key];
        }
      }
      return decodedItem;
    });
  
    const uniqueIds = [...new Set(encoded.flatMap(item => Object.values(item)))];
  
    return { decoded, uniqueIds };
  }
  
  const { decoded, uniqueIds } = decodeFields(encoded, translations);
  console.log('Расшифрованные данные:', decoded);
  console.log('Уникальные id:', uniqueIds);