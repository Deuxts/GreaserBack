import GMR from 'graphql-merge-resolvers';
import resolversChargeType from './charge';

const typeStripeResolvers = GMR.merge([
    resolversChargeType
]);

export default typeStripeResolvers;