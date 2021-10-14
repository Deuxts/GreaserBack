import nodemailer from 'nodemailer';

export const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.USER_EMAIL, // generated ethereal user
      pass: process.env.USER_PASSWORD, // generated ethereal password
    }
});

transport.verify().then(() => {
    console.log('✓✓✓✓✓✓✓✓✓✓✓✓✓✓ NODE MAILER ✓✓✓✓✓✓✓✓✓✓✓✓✓');
    console.log('✓                                      ✓');
    console.log('✓         Conexión establecida         ✓');
    console.log('✓                                      ✓');
    console.log('✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓');
}).catch( error => {
    
    console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
    console.log('X                                       X');
    console.log('X        Conexión NO establecida        X');
    console.log('X                                       X');
    console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
});

