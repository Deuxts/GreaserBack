import GMR from 'graphql-merge-resolvers';
import resolversMailMutation from './email';
import resolversGenreMation from './genres';
import resolversShopProductMutation from './shop-product';
import mutationStripeResolvers from './stripe';
import resolversUserMutation from './user';

const mutationResolvers = GMR.merge([
    resolversUserMutation,
    resolversGenreMation,
    resolversMailMutation,
    mutationStripeResolvers,
    resolversShopProductMutation
]);

export default mutationResolvers;