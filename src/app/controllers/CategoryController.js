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

        const { filename: path } = request.file;
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
            path,
        });

        return response.status(201).json({ id, name });
    }






//UPDATE DA CATEGORIA
    async update(request, response) {
            const schema = Yup.object({
                name: Yup.string(),
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

            //--------------------------------------------------------------------
            const { id } = request.params    
        
        const categoryExists = await Category.findByPk(id);

        if (!categoryExists) {
            return response.status(400).json({ message: 'Make sure your category ID is correct' });
        }
        
        let path; //declarando path
        if (request.file) {
        // caso path de request.file exista path recebe request.file.filename
            path = request.file.filename
        }
             
        const { name } = request.body;

        

        //se existir name eu verifico o codigo
        if (name) {
             //verificando no banco de dados se a categoria existe pelo nome where name
            const categoryNameExists = await Category.findOne({
                where: {
                    name,
                },
            });
            // caso a categoria ja exista ele devolve que ela ja existe
            //o id veio como string colocou o + para deixar ele como number
            if (categoryNameExists && categoryNameExists.id !== +id) {
                return response.status(400).json({ error: 'Category already exists' });
            }
        }
        
        //caso a categoria não existe passamos para o codigo a baixo criando o update total da categoria
        await Category.update({
            name,
            path,
        }, {
            where: {
                id,
            }
        })

            return response.status(200).json();
        }











    async index(request, response) {
        const categories = await Category.findAll();
        
        //console.log({userId: request .userId });

        return response.json(categories);
    }
}

export default new CategoryController();