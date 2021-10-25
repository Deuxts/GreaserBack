import { IResolvers } from 'graphql-tools';
import shopProductsService from '../../services/shop-product.service';

const resolversShopProductMutation: IResolvers = {
    Mutation: {
        updateStock(_, {update}, {db}){
            console.log(update);
            return new shopProductsService(_, {}, {db}).updateStock(update);
            
        }
    }
};

export default resolversShopProductMutation;