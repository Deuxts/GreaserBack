import { IResolvers } from 'graphql-tools';
import StripeCostumerService from '../../../services/stripe/customer.service';


const resolversStripeCustomerMutation: IResolvers = {
    Mutation: {
        async createCustomer(_, {name, email}, {db}){
            return new StripeCostumerService().create(name, email, db);
        },
        async updateCustomer(_, {id, customer}){
            return new StripeCostumerService().update(id, customer);
        },
        async deleteCustomer(_, {id}, {db}){
            return new StripeCostumerService().delete(id, db);
        }
    }
};

export default resolversStripeCustomerMutation;