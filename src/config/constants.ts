import environment from './environment';

if (process.env.NODE_ENV !== 'production'){
    const env= environment;
}

export const SECRET_KEY = process.env.SECRET || 'D3uxTsGr3as3r5tor3D4v1d4r145V1rg3n';

export enum COLLECTIONS{
    USERS='users',
    GENRES = 'genres'
}

export enum MESSAGES{
    TOKEN_VERIFICATION_FAILED = 'token no valido, inicia sesion de nuevo'
}

/**
 *  H = horas
 *  M = minutos
 *  D = dias
 */

export enum EXPIRETIME{
    H1 = 60 * 60,
    H24 = 24 * H1,
    M15 = H1 / 4,
    M20 = H1 / 3,
    D3 = H24 * 3,
}

export enum ACTIVE_VALUES_ITEMS{
    ALL = 'ALL',
    INACTIVE = 'INACTIVE',
    ACTIVE = 'ACTIVE'
}