import { Db } from 'mongodb';
import { COLLECTIONS } from '../../config/constants';
import { IStripeCustomer } from '../../interfaces/stripe/customer.interface';
import { IUser } from '../../interfaces/user.interface';
import { findOneElement } from '../../lib/db-operations';
import StripeApi, { STRIPE_ACTIONS, STRIPE_OBJECTS } from '../../lib/stripe-api';
import UsersService from '../users.service';


class StripeCostumerService extends StripeApi{
    // lista de clientes
    async list(limit: number, startingAfter: string, endingBefore: string){
        let pagination;
            pagination = {};
            if (startingAfter !== '' && endingBefore === '') {
                pagination = { starting_after: startingAfter};
            } else if (startingAfter === '' && endingBefore !== '') {
                pagination = { ending_before: endingBefore};
            } else {
                pagination = {};
            }
            return await new StripeApi().execute(
                STRIPE_OBJECTS.CUSTOMERS,
                STRIPE_ACTIONS.LIST,
                {limit, ...pagination}
            ).then((result: {has_more: boolean, data: Array<IStripeCustomer>}) => {
                return {
                    status: true,
                    message: 'lista cargada con exito',
                    hasMore: result.has_more,
                    customers: result.data
                };
            }).catch((error:Error) => this.getError(error));
    }

    async get(id: string){
        return await new StripeApi().execute(
            STRIPE_OBJECTS.CUSTOMERS,
            STRIPE_ACTIONS.GET,
            id
        ).then(async (result: IStripeCustomer) => {
            return {
                status: true,
                message: `Cliente ${result.name} se ha encontrado`,
                customer: result
            };
        }).catch((error:Error) => this.getError(error));
    }

    async create(name: string, email: string, db: Db){
        //fragmento de la api de Stripe para agregar indiscriminadamente, por ello debemos verificar si existe o no el usuario
            //vamos a buscar primero (obtener los datos)
            const userCheckExist: {data: Array<IStripeCustomer>} = await new StripeApi().execute(
                STRIPE_OBJECTS.CUSTOMERS,
                STRIPE_ACTIONS.LIST,
                {email}
            );
            // verificamos el tamaño, es decir, si tiene un tamaño es por que si existe
            if (userCheckExist.data.length > 0) {
                return {
                    status: false,
                    message: `Ya existe un cliente con este correo: ${email}`
                };
            }
            return await new StripeApi().execute(
                STRIPE_OBJECTS.CUSTOMERS,
                STRIPE_ACTIONS.CREATE,
                {
                    name,
                    email,
                    description: `${name} (${email})`
                }
            ).then(async (result: IStripeCustomer) => {
                //debemos actualizar al usuario de la base de datos y agregar el id de stripe que debera tener como cliente
                const user: IUser = await findOneElement(db, COLLECTIONS.USERS, {email});
                if (user) {
                    user.stripeCustomer = result.id;
                    const resultUserOperation = await new UsersService({}, {user}, {db}).modify();
                    // si no se ejecuta el movimiento debemos de borrar
                }
                //recuperamos el mensaje
                return {
                    status: true,
                    message: `Cliente ${name} creado correctamente`,
                    customer: result
                };
            }).catch((error:Error) => this.getError(error));
    }

    async update(id: string, customer: IStripeCustomer){
        return await new StripeApi().execute(
            STRIPE_OBJECTS.CUSTOMERS,
            STRIPE_ACTIONS.UPTATE,
            id,
            customer
        ).then( (result: IStripeCustomer) => {
            return {
                status: true,
                message: `Usuario Actualizado`,
                customer: result
            };
        }).catch((error:Error) => this.getError(error));
    }

    async delete(id:string, db: Db){
        return await new StripeApi().execute(
            STRIPE_OBJECTS.CUSTOMERS,
            STRIPE_ACTIONS.DELETE,
            id,
        ).then( async (result: {id: string, deleted: boolean}) => {
            if (result.deleted) {
                const resultOperation = await db
                .collection(COLLECTIONS.USERS)
                .updateOne({stripeCustomer: result.id}, { $unset: {stripeCustomer: result.id} });
                return {
                    status: result.deleted && resultOperation ? true : false,
                    message: result.deleted && resultOperation ? `El usuario ya no es cliente en Stripe` 
                                                                : `El usuario no se actualizo en mongo pero si en Stripe`,
                };
            }
            return {
                status: true,
                message: `Usuario no borrado, comprueba por favor`,
            };
        }).catch((error:Error) => this.getError(error));
    }
}

export default StripeCostumerService;