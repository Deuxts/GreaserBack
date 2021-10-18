import GMR from 'graphql-merge-resolvers';
import resolversUserQuery from './user';
import resolversProductsQuery from './shop-product';
import resolversGenreQuery from './genre';

const queryResolvers = GMR.merge([
    resolversUserQuery,
    resolversProductsQuery,
    resolversGenreQuery
]);

export default queryResolvers;