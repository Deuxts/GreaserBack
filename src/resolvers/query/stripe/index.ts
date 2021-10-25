import GMR from 'graphql-merge-resolvers';
import resolversStripeCardQuery from './card';
import resolversStripeChargeQuery from './charge';
import resolversStripeCustomerQuery from './customer';

const QueryStripeResolvers = GMR.merge([
    resolversStripeCustomerQuery,
    resolversStripeCardQuery,
    resolversStripeChargeQuery
]);

export default QueryStripeResolvers;