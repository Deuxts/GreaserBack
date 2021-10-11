import { IResolvers } from 'graphql-tools';
import GenresService from '../../services/genre.service';

const resolversGenreMutation: IResolvers = {
    Query: {
        async genres(_, __, { db }) {
            return new GenresService(_, __, { db }).items();
        },
        async genre(_, { id }, { db }) {
            return new GenresService(_, { id }, { db }).details();
        }
    }
};

export default resolversGenreMutation;