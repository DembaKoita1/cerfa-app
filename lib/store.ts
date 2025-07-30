// /lib/store.ts
export const dataStore: CerfaForm[] = [];

export function addEntry(data: CerfaForm) {
  dataStore.push(data);
}

export function getLastEntry(): CerfaForm | undefined {
  return dataStore[dataStore.length - 1];
}