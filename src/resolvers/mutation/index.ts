import GMR from 'graphql-merge-resolvers';
import resolversMailMation from './email';
import resolversGenreMation from './genres';
import mutationStripeResolvers from './stripe';
import resolversUserMutation from './user';

const mutationResolvers = GMR.merge([
    resolversUserMutation,
    resolversGenreMation,
    resolversMailMation,
    mutationStripeResolvers
]);

export default mutationResolvers;