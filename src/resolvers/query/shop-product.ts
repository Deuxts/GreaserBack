import { IResolvers } from 'graphql-tools';
import shopProductsService from '../../services/shop-product.service';
const resolversProductsQuery: IResolvers = {
  Query: {
    shopProducts(_, { page, itemsPage, active }, context) {
      return new shopProductsService(
        _,
        {
          pagination: { page, itemsPage },
        },
        context
      ).items(active);
    },
    shopProductsCategory(_, { page, itemsPage, active, category, random }, context) {
      return new shopProductsService(
        _,
        {
          pagination: { page, itemsPage },
        },
        context
      ).items(active, category, random);
    },
    shopProductsOffersLast(_, { page, itemsPage, active, random, topPrice, lastUnits}, context) {
      let otherFilters = {};
      console.log(lastUnits);
      console.log(page);
      console.log(topPrice);
      
      
      if (lastUnits > 0 && topPrice > 10) {
        otherFilters = {
          $and: [
            {price: {$lte: topPrice}},
            {stock: {$lte: topPrice}}
          ]
        };
      } else if (lastUnits <= 0 && topPrice > 10) {
        otherFilters =  {price: {$lte: topPrice}};
      } else if (lastUnits > 0 && topPrice <= 10) {
        otherFilters =  {stock: {$lte: lastUnits}};
      }
      return new shopProductsService(
        _,
        {
          pagination: { page, itemsPage },
        },
        context
      ).items(active, ['-1'], random, otherFilters);
    },
    shopProductDetails(_, {id}, context){
      return new shopProductsService(
        _,
        {
          id,
        },
        context
      ).details();
    }
  },
};

export default resolversProductsQuery;
