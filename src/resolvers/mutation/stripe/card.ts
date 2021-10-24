import { IResolvers } from 'graphql-tools';
import StripeApi, { STRIPE_ACTIONS, STRIPE_OBJECTS } from '../../../lib/stripe-api';
import StripeCardService from '../../../services/stripe/card.service';
import StripeCostumerService from '../../../services/stripe/customer.service';


const resolversStripeCardMutation: IResolvers = {
    Mutation: {
        async createCardToken(_, {card}){
            return new StripeCardService().createToken(card);
        },
        async createCard(_, {customer, tokenCard}){
            return new StripeCardService().createCard(customer, tokenCard);
        },
        async updateCard(_, {customer, card, details}){
            return new StripeCardService().update(customer, card, details);
        },
        async deleteCard(_, {customer, card}){
            return new StripeCardService().delete(customer, card);
        }
    }
};

export default resolversStripeCardMutation;