import { transport } from '../config/mailer';
import { IMailOptions } from '../interfaces/email.interface';

class MailService {
    send(mail: IMailOptions){
        return new Promise((resolve, reject) => {
            transport.sendMail({
                from: '"🌊🌊🌊 Greaser Store" <greaser.store.online@gmail.com>', // sender address
                to: mail.to, // persona que lo va a recibir 
                subject: mail.subject, // asunto
                html: mail.html, // mensaje
            }, (error, _) => {
                (error) ? reject({
                    status:false,
                    message: 'error'
                }) : resolve({
                    status:true,
                    message: 'Email enviado correctamente a : ' + mail.to,
                    mail
                });
            });
        });
    }
}

export default MailService;