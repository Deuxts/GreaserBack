import GMR from 'graphql-merge-resolvers';
import resolversStripeCardQuery from './card';
import resolversStripeCustomerQuery from './customer';

const QueryStripeResolvers = GMR.merge([
    resolversStripeCustomerQuery,
    resolversStripeCardQuery
]);

export default QueryStripeResolvers;