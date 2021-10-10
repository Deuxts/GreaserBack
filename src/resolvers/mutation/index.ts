import GMR from 'graphql-merge-resolvers';
import resolversGenreMation from './genres';
import resolversUserMutation from './user';

const mutationResolvers = GMR.merge([
    resolversUserMutation,
    resolversGenreMation
]);

export default mutationResolvers;