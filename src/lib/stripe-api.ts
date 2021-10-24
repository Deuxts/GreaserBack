export const STRIPE_OBJECTS = {
    CUSTOMERS: 'customers',
    TOKENS: 'tokens',
    CHARGES: 'charges'
};

export const STRIPE_ACTIONS = {
    CREATE: 'create',
    LIST: 'list',
    GET: 'retrieve',
    UPTATE: 'update',
    DELETE: 'del',
    CREATESOURCE: 'createSource',
    GET_SOURCE: 'retrieveSource',
    UPDATE:'updateSource',
    DELETE_CARD: 'deleteSource',
    LIST_CARDS: 'listSources',
};

class StripeApi {
    private stripe = require('stripe')(process.env.STRIPE_API_KEY, {
        apiVersion: process.env.STRIPE_API_VERSION
    });

    async execute(object: string, action: string, ...args: [
        (string | object), (string | object)?, (string | object)?
    ]){
        return await this.stripe[object][action](...args);
    }

    protected async getError(error: Error){
        {
            return {
                status: false,
                message: 'ERROR'.concat(error.message),
                hasMore: false,
                customer: undefined,
                card: undefined,
                cards: undefined,
            };
        }
    }

    protected async paginator(startingAfter: string, endingBefore: string){
        let pagination;
        if (startingAfter !== '' && endingBefore === '') {
            pagination = {starting_after: startingAfter};
        } else if (startingAfter === '' && endingBefore !== '') {
            pagination = {ending_begore: endingBefore};
        } else {
            pagination = {};
        }
        return pagination;
    }

}


export default StripeApi;