import { IResolvers } from 'graphql-tools';
import StripeCostumerService from '../../../services/stripe/customer.service';

const resolversChargeType: IResolvers = {
    StripeCharge: {
        typeOrder: (parent) => parent.object,
        amount: (parent) => parent.amount/100,
        receiptEmail: async (parent) => {
            if(parent.receipt_email){
                return parent.receipt_email;
            }
            // en caso de no encontrar el email desde la pai
            const userData = await new StripeCostumerService().get(parent.customer);
            return(userData.customer?.email) ? userData.customer?.email : '';
        },
        receiptUrl: (parent) => parent.receipt_url,
        card: (parent) => parent.payment_method,
        created: (parent) => new Date(parent.created * 1000).toISOString(),
    }
};

export default resolversChargeType;