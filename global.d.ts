declare global {
    interface Window {
        wpUser: {
            restUrl: string
            nonce: string
            public?: boolean
        };
    }
}
export {};

