import { IResolvers } from 'graphql-tools';
import { IStripeCustomer } from '../../../interfaces/stripe/customer.interface';
import StripeApi, { STRIPE_ACTIONS, STRIPE_OBJECTS } from '../../../lib/stripe-api';
import StripeCostumerService from '../../../services/stripe/customer.service';

const resolversStripeCustomerQuery: IResolvers = {
    Query: {
        async customers(_, { limit, startingAfter, endingBefore }) {
            return new StripeCostumerService().list(limit,startingAfter,endingBefore);
        },
        async customer(_, { id }){
            return new StripeCostumerService().get(id);
        }
    },
};

export default resolversStripeCustomerQuery;