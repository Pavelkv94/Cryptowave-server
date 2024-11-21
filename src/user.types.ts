export interface IUserLogin {
    email: string;
    password: string;
    tg_nickname?: string;
}

export interface IUser {
    id: string;
    email: string;
    createdAt: string;
    emailConfirmation: {
        confirmationCode: string;
        expirationDate: string;
        isConfirmed: boolean;
    };
    balance: number;
    avatar_url: string;
    tg_nickname: string;
    chat_id: string;
}
export interface ILoginOutput {
    accessToken: string;
}
export interface IUserHistoryItem {
    coin: string;
    date: string;
    note: string;
    operation: string;
    price_per_coin: string;
    quantity: string;
    tg_nickname: string;
    total: string;
    user_id: string;
    id: string;
}
