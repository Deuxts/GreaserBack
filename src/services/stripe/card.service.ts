
import { Db } from 'mongodb';
import { COLLECTIONS } from '../../config/constants';
import { IStripeCard } from '../../interfaces/stripe/card.interface';
import { IStripeCustomer } from '../../interfaces/stripe/customer.interface';
import { IUser } from '../../interfaces/user.interface';
import { findOneElement } from '../../lib/db-operations';
import StripeApi, { STRIPE_ACTIONS, STRIPE_OBJECTS } from '../../lib/stripe-api';
import UsersService from '../users.service';


class StripeCardService extends StripeApi{
    // lista de clientes
    async createToken(card: IStripeCard){
        return await new StripeApi().execute(
            STRIPE_OBJECTS.TOKENS,
            STRIPE_ACTIONS.CREATE,
            {
                card: {
                    number: card.number,
                    exp_month: card.expMonth,
                    exp_year: card.expYear,
                    cvc: card.cvc,
                },
            }
        ).then( (result:{id: string}) => {
            console.log(result);
            
            return {
                status: true,
                message: `token ${result.id} se ha creado`,
                token: result.id
            };
        }).catch((error:Error) => this.getError(error));
    }

    async createCard(customer: string, tokenCard: string){
        return await this.execute(
            STRIPE_OBJECTS.CUSTOMERS,
            STRIPE_ACTIONS.CREATESOURCE,
            customer,
            {source: tokenCard}
        ).then( (result:IStripeCard) => {
            console.log(result);
            
            return {
                status: true,
                message: `tarjeta ${result.id} se ha vinculado`,
                id: result.id,
                card: result
            };
        }).catch((error:Error) => this.getError(error));
    }

    async get(customer: string, card: string){
        return await this.execute(
            STRIPE_OBJECTS.CUSTOMERS,
            STRIPE_ACTIONS.GET_SOURCE,
            customer,
            card
        ).then( (result:IStripeCard) => {
            return {
                status: true,
                message: `detalles de la tarjera: ${result.id}`,
                id: result.id,
                card: result
            };
        }).catch((error:Error) => this.getError(error));
    }

    async update (customer: string, card: string, details: object){
        return await this.execute(
            STRIPE_OBJECTS.CUSTOMERS,
            STRIPE_ACTIONS.UPDATE,
            customer,
            card,
            details
        ).then( (result:IStripeCard) => {
            return {
                status: true,
                message: `tarjeta: ${result.id} actualizada`,
                id: result.id,
                card: result
            };
        }).catch((error:Error) => this.getError(error));
    }

    async delete(customer: string, card: string){
        return await this.execute(
            STRIPE_OBJECTS.CUSTOMERS,
            STRIPE_ACTIONS.DELETE_CARD,
            customer,
            card,
        ).then( (result:{id: string, deleted: boolean}) => {
            return {
                status: true,
                message: result.deleted ? `tarjeta: ${result.id} eliminada`: `TARJETA NO ELIMINADA`,
                id: result.id
            };
        }).catch((error:Error) => this.getError(error));
    }

    async list(customer: string, limit: number = 5, startingAfter: string = '', endingBefore: string = ''){
        const pagination = this.paginator(startingAfter, endingBefore);
        return await this.execute(
            STRIPE_OBJECTS.CUSTOMERS,
            STRIPE_ACTIONS.LIST_CARDS,
            customer,
            {object: 'card', limit, ...pagination},
        ).then( (result:{has_more: boolean, data: Array<IStripeCard>}) => {
            return {
                status: true,
                message: `tarjeta: MOSTRADA`,
                cards: result.data,
                hasMore: result.has_more
            };
        }).catch((error:Error) => this.getError(error));
    }

    async removeOtherCards(customer: string, noDeleteCard: string) {
        const listCards = (await this.list(customer)).cards;
        listCards?.map(async(item: IStripeCard) => {
            if (item.id !== noDeleteCard && noDeleteCard !== '') {
                await this.delete(customer, item.id || '');
            }
        });
    }

}

export default StripeCardService;