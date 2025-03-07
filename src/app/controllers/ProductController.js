import * as Yup from 'yup';
import Product from '../models/Product';
import Category from '../models/Category';
import User from '../models/User';

//modelando e filtrando entradas
class ProductController {
    async store(request, response) {
        const schema = Yup.object({
            name: Yup.string().required(),
            price: Yup.number().required(),
            category_id: Yup.number().required(),
            offer: Yup.boolean(),
        });

        //fazendo a validação
        try {
            schema.validateSync(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }

        //--------------------------------------------------------------------
        //procurando usuario com o id do usuario primarykey com findByPk
        // saber se e Admin para acesso de usuario admin true para ter direito a criar o produto e
        const { admin: isAdmin } = await User.findByPk(request.userId);

        if (!isAdmin) {
            //fazendo a validação se nao for admin devolve erro 401 nao é admin
            //se ele for admin pula a validação e segue a criação da categoria
            return response.status(401).json();
        }

        //--------------------------------------------------------------------
        const { filename: path } = request.file; // encontrando path da imagem
        const { name, price, category_id, offer } = request.body;// encontrando name, price, category_id, offer

        //criando produtos com create
        const product = await Product.create({
            name,
            price,
            category_id,
            path,
            offer,
        });

        return response.status(201).json(product);
    }







    async update(request, response) {
            const schema = Yup.object({
                name: Yup.string(),
                price: Yup.number(),
                category_id: Yup.number(),
                offer: Yup.boolean(),
            });

            try {
                schema.validateSync(request.body, { abortEarly: false });
            } catch (err) {
                return response.status(400).json({ error: err.errors });
            }

            //--------------------------------------------------------------------
            //procurando usuario com o id do usuario primarykey com findByPk
            // saber se e Admin para acesso de usuario admin true para ter direito a criar o produto e
            const { admin: isAdmin } = await User.findByPk(request.userId);

            if (!isAdmin) {
                //fazendo a validação se nao for admin devolve erro 401 nao é admin
                //se ele for admin pula a validação e segue a criação da categoria
                return response.status(401).json();
        }
        
            //-----------filtrando o findProduct pelo id caso ele exista segue ---------------------------
            const { id } = request.params; //pegando id

            const findProduct = await Product.findByPk(id); //pegando pela primary key se ele existe

        //caso findProduct não exista ele retorna status 400 erro
        if (!findProduct) {
            return response
                .status(400)
                .json({ error: 'Make sure your product ID is correct' })
        }



            //--------------------------------------------------------------------
        let path; //declarando path
        if (request.file) {
            path = request.file.filename // caso path de request.file exista path recebe request.file.filename
        }
        
        //  const { filename: path } = request.file; // apagou essa linha e substituiu pela de cima na confirmação //encontrando path da imagem
        const { name, price, category_id, offer } = request.body;// encontrando name, price, category_id, offer

            //update de produtos 
        await Product.update({
                name,
                price,
                category_id,
                path,
                offer,
            }, {
                //segundo objedo falando onde vamos fazer o update neste caso no id
                where: {
                    id,
                },
        });

            return response.status(200).json();
        }





    //--------------------------------------------------------------------
    //listar Produtos com findAll obs Admin: false pode listar normalmente
    async index(request, response) {
        const products = await Product.findAll({
            include: {
                model: Category,
                as: 'category',
                attributes: ['id', 'name'],
            },
        });

        return response.json(products);
    }
    //--------------------------------------------------------------------
}

export default new ProductController();

