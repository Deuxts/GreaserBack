import { countElements } from './../../lib/db-operations';
import { IResolvers } from 'graphql-tools';
import GenresService from '../../services/genre.service';
import { COLLECTIONS } from '../../config/constants';
import { pagination } from '../../lib/pagination';

const resolversGenreMutation: IResolvers = {
    Query: {
        async genres(_, variables, { db }) {
            console.log(await countElements(db, COLLECTIONS.GENRES));
            console.log(await pagination(db, COLLECTIONS.GENRES, 2, 5));
            return new GenresService(_, {pagination: variables}, { db }).items();
        },
        async genre(_, { id }, { db }) {
            return new GenresService(_, { id }, { db }).details();
        }
    }
};

export default resolversGenreMutation;