import GMR from 'graphql-merge-resolvers';
import resolversCategoryType from './category';
import resolversProductType from './product';
import resolversProductsType from './shop-products';
import typeStripeResolvers from './stripe';

const typeResolvers = GMR.merge([
    resolversProductsType,
    resolversCategoryType,
    resolversProductType,
    typeStripeResolvers
]);

export default typeResolvers;