type AsyncStorage = {
    [K in keyof Storage]: (...args: Parameters<Storage[K]>) => Promise<ReturnType<Storage[K]>>;
}


interface AnkiStorage {
    localStorage: AsyncStorage
}

declare function getAnkiStorage(page?: string): Promise<AnkiStorage>;

export { getAnkiStorage };