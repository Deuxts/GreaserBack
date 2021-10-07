import { SECRET_KEY, MESSAGES, EXPIRETIME } from './../config/constants';
import jwt from 'jsonwebtoken';
import { IJwt } from '../interfaces/jwt.interface';
class JWT{
    private secrectKey = SECRET_KEY as string;
    //caducidad de 24 horas
    sign(data: IJwt, expiresIn: number = EXPIRETIME.H24){
        return jwt.sign(
            {user: data.user},
            this.secrectKey,
            { expiresIn }, //caducidad en horas 
        );
    }

    verify(token: string){
        try {
            return jwt.verify(token, this.secrectKey);
        } catch (e) {
            return MESSAGES.TOKEN_VERIFICATION_FAILED;
        }
    }
}

export default JWT;