import { PubSub } from 'apollo-server-express';
import { Db } from 'mongodb';
import { COLLECTIONS } from '../../config/constants';
import { IStock } from '../../interfaces/stock.interface';
import { IStripeCard } from '../../interfaces/stripe/card.interface';
import { IStripeCharge } from '../../interfaces/stripe/charge.interface';
import { IPayment } from '../../interfaces/stripe/payment.interface';
import { IUser } from '../../interfaces/user.interface';
import { findOneElement } from '../../lib/db-operations';
import StripeApi, { STRIPE_ACTIONS, STRIPE_OBJECTS } from '../../lib/stripe-api';
import shopProductsService from '../shop-product.service';
import UsersService from '../users.service';
import StripeCardService from './card.service';
import StripeCostumerService from './customer.service';


class StripeChargeService extends StripeApi{
    private async getClient(customer: string){
        return new StripeCostumerService().get(customer);
    }
    
    async order(payment: IPayment, stockChange:Array<IStock>, db:Db, pubsub: PubSub){
        //verificar cliente
        const userData = await this.getClient(payment.customer);
        if (userData && userData.status) {
            if (payment.token !== undefined) {
                // vincular cliente - tarjeta
                const cardCreate = await new StripeCardService().createCard(
                    payment.customer, payment.token
                );
                // Actualizar la tarjeta si usa otra
                await new StripeCostumerService().update(
                    payment.customer, {
                        default_source: cardCreate.card?.id
                    }
                );
                // eliminar tarjetas no usadas, solo se debe conservar 1 en preferencia
                await new StripeCardService().removeOtherCards(payment.customer, cardCreate.card?.id || '');
                
            }else if (payment.token === undefined && userData.customer?.default_source === null) {
                return {
                    status: false,
                    message: 'Cliente sin metodos de pago'
                };
            }
        } else {
            return {
                status: false,
                message: 'Cliente no valido, no se puede continuar con el pago'
            };
        }
        //realizar pago
        delete payment.token;
        payment.amount = Math.round((+payment.amount + Number.EPSILON) * 100)/100;
        payment.amount *= 100;
        return this.execute(
            STRIPE_OBJECTS.CHARGES,
            STRIPE_ACTIONS.CREATE,
            payment
        ).then((result: object) => {
            new shopProductsService({},{}, {db}).updateStock(stockChange, pubsub);
            return{
                status: true,
                message: 'El pago se completo de forma exitosa',
                charge: result
            };
        }).catch((error: Error) => this.getError(error));
    }   

    async list(customer: string, limit: number, startingAfter:string, endingBefore:string){
        const pagination = await this.paginator(startingAfter, endingBefore);
        return this.execute(
            STRIPE_OBJECTS.CHARGES,
            STRIPE_ACTIONS.LIST,
            {limit, customer, ...pagination}
        ).then((result: {has_more: boolean, data: Array<IStripeCharge>}) => {
            return {
                status: true,
                message: 'lista cargada con exito',
                hasMore: result.has_more,
                charges: result.data
            };
        }).catch((error:Error) => this.getError(error));
    }

}

export default StripeChargeService;