import { entryPages } from './constant';
export function isEntryPage(pathname: string) {
  let entryPage = false;
  entryPages.map((page: string) => {
    if (pathname.includes(page)) {
      return (entryPage = true);
    }
  });
  return entryPage;
}

export const formatDateTime = (data) => {
  return new Date(data).toLocaleString('tr-TR');
};
