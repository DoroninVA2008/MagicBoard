export interface Tale {
  id: number;
  imageUrl: string;
  name: string;
  author: string;
}

export interface TaleHeader {
  forName: string;
  linkAll: string;
}

export interface TalesResponse {
  header: TaleHeader;
  tales: Tale[];
}

// Сырые данные — как в db.json
const RAW_TALES = [
  {
    forName: 'Для всей семьи',
    linkAll: 'https://',
  },
  {
    id: 1,
    inDev: 'В разработке',
    imageUrl: 'https://www.radionetplus.ru/uploads/posts/2013-12/1387478876_krasivye-fotki-1.jpeg',
    name: 'Красная шапочка',
    author: 'Шарль Перро',
  },
  {
    id: 2,
    inDev: 'В разработке',
    imageUrl: 'https://www.radionetplus.ru/uploads/posts/2013-12/thumbs/1387478932_krasivye-fotki-1.jpg',
    name: 'Винни-Пух',
    author: 'Алан Милн',
  },
  {
    id: 3,
    inDev: 'В разработке',
    imageUrl: 'https://www.radionetplus.ru/uploads/posts/2013-12/thumbs/1387478932_krasivye-fotki-1.jpg',
    name: 'Золотой ключик',
    author: 'Алексей Толстой',
  },
];

// Удобный экспорт — уже разбитый на header + tales
export const TALES_RESPONSE: TalesResponse = {
  header: RAW_TALES.find((item) => 'forName' in item) as TaleHeader,
  tales: RAW_TALES.filter(
    (item) => 'id' in item && 'imageUrl' in item && 'name' in item,
  ) as Tale[],
};

export const TALES_DATA: Tale[] = TALES_RESPONSE.tales;
export const TALES_HEADER: TaleHeader = TALES_RESPONSE.header;
export const TALES_HEADER_NAME: string = TALES_RESPONSE.header.forName;