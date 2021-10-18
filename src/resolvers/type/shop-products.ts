import { IResolvers } from 'graphql-tools';
import CategoryService from '../../services/category.service';
import ProductService from '../../services/product.service';

const resolversProductsType: IResolvers = {
    shopProduct:{
        productId: (parent) => parent.product_id,
        platformId: (parent) => parent.platform_id,
        product: async (parent, __, { db }) => {
            const result = await new ProductService(
                {}, 
                {id: parent.product_id},{db}).details();
            return await result.product;
        },
        category: async (parent, __, { db }) => {
            const result = await new CategoryService(
                {}, 
                {id: parent.platform_id},{db}).details();
            return await result.category;
        },
    },
    
};

export default resolversProductsType;