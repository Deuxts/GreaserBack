import { IResolvers } from 'graphql-tools';
import { IStripeCustomer } from '../../../interfaces/stripe/customer.interface';
import StripeApi, { STRIPE_ACTIONS, STRIPE_OBJECTS } from '../../../lib/stripe-api';
import StripeCardService from '../../../services/stripe/card.service';
import StripeCostumerService from '../../../services/stripe/customer.service';

const resolversStripeCardQuery: IResolvers = {
    Query: {
        async card(_, { customer, card }){
            return new StripeCardService().get(customer, card);
        },
        async cards(_, { customer, limit, startingAfter, endingBefore}){
            return new StripeCardService().list(customer, limit,startingAfter,endingBefore);
        }
    },
};

export default resolversStripeCardQuery;