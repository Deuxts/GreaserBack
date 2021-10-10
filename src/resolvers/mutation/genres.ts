import { IResolvers } from 'graphql-tools';
import GenreService from '../../services/genre.service';

const resolversGenreMation: IResolvers = {
    Mutation: {
        addGenre(_, variables, context){
            return new GenreService(_,variables, context).insert();
        },
        updateGenre(_, variables, context){
            return new GenreService(_,variables, context).modify();
        },
        deleteGenre(_, variables, context){
            return new GenreService(_,variables, context).delete();
        }
    }
};

export default resolversGenreMation;