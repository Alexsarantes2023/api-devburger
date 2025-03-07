import * as Yup from 'yup';
import Category from '../models/Category';
import User from '../models/User';

class CategoryController {
    async store(request, response) {
        const schema = Yup.object({
            name: Yup.string().required(),
        });


   try {
            schema.validateSync(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }

        
        //procurando usuario com o id do usuario primarykey com findByPk
        // saber se e Admin para acesso de usuario admin true
        const { admin: isAdmin } = await User.findByPk(request.userId);

        if (!isAdmin) {
            //fazendo a validação se nao for admin devolve erro 401 nao é admin
            //se ele for admin pula a validação e segue a criação da categoria
            return response.status(401).json();
        }

        const { name } = request.body;

        const categoryExists = await Category.findOne({
            where: {
                name,
            },
        });

        if (categoryExists) {
            return response.status(400).json({ error: 'Category already exists' });
        }
     
        const { id } = await Category.create({
            name,
        });

        return response.status(201).json({ id, name });
    }
    async index(request, response) {
        const categories = await Category.findAll();
        
        //console.log({userId: request .userId });

        return response.json(categories);
    }
}

export default new CategoryController();