import GMR from 'graphql-merge-resolvers';
import resolversUserQuery from './user';
import resolversProductsQuery from './shop-product';
import resolversGenreQuery from './genre';
import QueryStripeResolvers from './stripe';

const queryResolvers = GMR.merge([
    resolversUserQuery,
    resolversProductsQuery,
    resolversGenreQuery,
    QueryStripeResolvers
]);

export default queryResolvers;