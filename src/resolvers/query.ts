import { EXPIRETIME, MESSAGES } from './../config/constants';
import { IResolvers } from 'graphql-tools';
import { COLLECTIONS } from '../config/constants';
import JWT from '../lib/jwt';
import bcrypt from 'bcrypt';


const resolversQuery: IResolvers = {
    Query: {
        async users(_, __, { db }) {
            try {
                return {
                    status: true,
                    message: 'lista de usuarios cargada correctamente',
                    users: await db.collection(COLLECTIONS.USERS).find().toArray()
                };
            } catch (error) {
                console.log(error);
                return {
                    status: false,
                    message: 'error al cargar los usuarios, favor de comprobar',
                    users: [],
                };
            }
        },
        async login(_, { email, password }, { db }) {
            try {
                const user = await db.collection(COLLECTIONS.USERS).findOne({ email });
                if (user === null) {
                    return{
                        status: false,
                        message: 'error el usuario no existe, comprueba las credenciales',
                        token: null,
                    };
                }
                const passwordCheck = bcrypt.compareSync(password, user.password);
                if (passwordCheck !== null) {
                    delete user.password;
                    delete user.birthday;
                    delete user.registerDate;
                }
                return {
                    status: true,
                    message: 
                        !passwordCheck
                            ? 'error al ingresar el usuario, comprueba las credenciales' : 'Usuario ingresado de forma correcta',
                    token: 
                        !passwordCheck 
                            ? null
                            : new JWT().sign({ user}, EXPIRETIME.D3),
                    
                };
            } catch (error) {
                console.log(error);
                return {
                    status: false,
                    message: 'error al ingresar el usuario, comprueba las credenciales',
                    token: null,
                };
            }
        },
        me(_, __, { token }){
            console.log(token);
            let info = new JWT().verify(token);
            if (info === MESSAGES.TOKEN_VERIFICATION_FAILED) {
                return {
                    status: false,
                    message: info,
                    user: null
                };
            }
            return{
                
                status: true,
                message: 'usuario autenticado de forma correcta por el token',
                user: Object.values(info)[0]
            };
        }
    },
};
export default resolversQuery;