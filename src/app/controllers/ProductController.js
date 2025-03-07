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

        //--------------------------------------------------------------------
        const { filename: path } = request.file; // encontrando path da imagem
        const { name, price, category_id } = request.body;// encontrando name, price, category_id

        //criando produtos com create
        const product = await Product.create({
            name,
            price,
            category_id,
            path
        });

        return response.status(201).json(product);
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

