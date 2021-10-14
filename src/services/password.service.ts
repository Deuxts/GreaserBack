import { IContextData } from './../interfaces/context-data.interface';
import ResolversOperationsService from './resolvers-operations.service';
import MailService from './email.service';
import JWT from '../lib/jwt';
import { findOneElement } from '../lib/db-operations';
import { COLLECTIONS, EXPIRETIME } from '../config/constants';
import bcrypt from 'bcrypt';


class PasswordService extends ResolversOperationsService {
    constructor(root: object, variables: object, context: IContextData) {
        super(root, variables, context);
    }
    async sendMail() {
        const email = this.getVariables().user?.email || '';
        if (email === undefined || email === '') {
        return {
            status: false,
            message: 'El email no se ha definido correctamente',
        };
        }
        //buscar info del usuario
        const user = await findOneElement(this.getDb(), COLLECTIONS.USERS, {email});
        // console.log(user);
        //si el usuario no existe se envia un mensaje
        if (user === undefined || user === null) {
            return{
                status: false,
                message: `Usuario con el email ${email} no existe`
            };
        }
        const newUser = {
            id: user.id,
            email
        };
        const token = new JWT().sign({user: newUser}, EXPIRETIME.M20);
        console.log(token);
        const html = `<h1><a href="${process.env.CLIENT_URL}/#/reset/${token}">Para cambiar tú contraseña haz click aqui!</a></h1>`;
        const mail = {
            subject: 'Cambio de contraseña',
            to: email,
            html
        };
        return new MailService().send(mail);
    }

    async change() {
        const id = this.getVariables().user?.id;
        let password = this.getVariables().user?.password;
        // comprobar el ID
        if (id === undefined || id === '') {
            return {
                status: false,
                message: ' el ID no es correcto'
            };
        }
        // comprobar el password
        if (password === undefined || password === '' || password === '1234') {
            return {
                status: false,
                message: ' ingrese una mejor contraseña'
            };
        }
        // encryptar el password
        password = bcrypt.hashSync(password, 10);
        // actualizar 
        const result = await this.update(COLLECTIONS.USERS,{ id },{ password },'users') ;
        return {
        status: result.status,
        message: (result.status) ? 'Contraseña cambiada correctamente' :
                                    result.message
        };
    }
}

export default PasswordService;