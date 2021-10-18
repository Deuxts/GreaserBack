import { IResolvers } from 'graphql-tools';

const resolversCategoryType: IResolvers = {
    Category: {
        active: (parent) => (parent.active !== false) ?true: false
    }
};

export default resolversCategoryType;