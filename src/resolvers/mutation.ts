import { IResolvers } from 'graphql-tools';
import { COLLECTIONS } from '../config/constants';
import bcrypt from 'bcrypt';


const resolversMutation: IResolvers = {
    Mutation: {
        async register(_, { user }, { db }) {
            //comprobar que el usuario no existe
            const userCheck = await db.collection(COLLECTIONS.USERS).
                findOne({ email: user.email });
            if (userCheck !== null) {
                return {
                    status: false,
                    message: `El correo ${user.email} ya esta registrado`,
                    user: null
                };
            }
            //comprobar ultimo usuario para asignar el ID
            const lastUser = await db.collection(COLLECTIONS.USERS).
                find().
                limit(1).
                sort({ registerDate: -1 }).toArray();
            if (lastUser.length === 0) {
                user.id = 1;
            } else {
                user.id = lastUser[0].id + 1;
            }
            //asignar fecha del formato ISO
            user.registerDate = new Date().toISOString();
            //encryptado del password
            user.password = bcrypt.hashSync(user.password, 10);
            //guardar en la coleccion
            return await db.
                collection(COLLECTIONS.USERS).
                insertOne(user)
                .then(async () => {
                    return {
                        status: true,
                        message: `El correo ${user.email} se registro correctamente`,
                        user
                    };
                }).catch((err: Error) => {
                    console.log(err.message);
                    return {
                        status: true,
                        message: `Error inesperado, intenta de nuevo`,
                        user: null
                    };
                });
        }
    }
};
export default resolversMutation;