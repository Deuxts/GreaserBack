import GMR from 'graphql-merge-resolvers';
import resolversCategoryType from './category';
import resolversProductType from './product';
import resolversProductsType from './shop-products';

const typeResolvers = GMR.merge([
    resolversProductsType,
    resolversCategoryType,
    resolversProductType,
]);

export default typeResolvers;