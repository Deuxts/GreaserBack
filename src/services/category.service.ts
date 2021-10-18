import { COLLECTIONS } from './../config/constants';
import ResolversOperationsService from './resolvers-operations.service';

class CategoryService extends ResolversOperationsService{
    collection = COLLECTIONS.CATEGORY;
    constructor(root: object, variables: object, context:object){
        super(root, variables, context);
    }

    async details(){
        const result = await this.get(this.collection);
        return { 
            status: result.status, 
            message: result.message, 
            category: result.item 
        };
    }
}

export default CategoryService;