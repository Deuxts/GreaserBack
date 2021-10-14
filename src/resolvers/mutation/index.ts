import GMR from 'graphql-merge-resolvers';
import resolversMailMation from './email';
import resolversGenreMation from './genres';
import resolversUserMutation from './user';

const mutationResolvers = GMR.merge([
    resolversUserMutation,
    resolversGenreMation,
    resolversMailMation
]);

export default mutationResolvers;