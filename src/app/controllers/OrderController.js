import * as Yup from 'yup';
import Order from '../schemas/Order';
import Product from '../models/Product';
import Category from '../models/Category';
import User from '../models/User';


// id e quantity vem da nossa requisição e nao do banco de dados
class OrderController {
    async store(request, response) {
        const schema = Yup.object({
            products: Yup.array().required().of(
                Yup.object({
                    id: Yup.number().required(),
                    quantity: Yup.number().required(),
                }),
            ),

        });

        try {
            schema.validateSync(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }

        const { products } = request.body;

        const productsIds = products.map((product) => product.id);

        const findProducts = await Product.findAll({
            where: {
                id: productsIds,
            },
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['name'],
                },
            ],
        });

        // mapeando o que foi recebido do banco de dados e formatando para um novo array ja criando um objeto declarado
        const formattedProducts = findProducts.map((product) => {
            // esta trazendo quantidade do array index da requisiçao
            // busca o id do produto que vem da request e compara com o id do produto que vem do banco para busca a quantidade correta do produto
            const productIndex = products.findIndex((item) => item.id === product.id);

            const newProduct = {
                id: product.id,
                name: product.name,
                category: product.category.name,
                price: product.price,
                url: product.url,
                quantity: products[productIndex].quantity,
            };
            return newProduct;
        });

        const order = {
            user: {
                id: request.userId,
                name: request.userName,
            },
            products: formattedProducts,
            status: 'Pedido Realizado',
        }
// acima foi feito toda a modelagem e tratamento dos dados e a baixo esta sendo criado com create 
// o banco de dados em mongodb
        const createdOrder = await Order.create(order);
        
        return response.status(201).json(createdOrder);
    
    }
// nesta parte de codigo vamos listar os pedidos com os codigos a baixo find
    async index(request, response) {
        const orders = await Order.find();

        return response.json(orders);
    }

    //agora faremos o update dos pedidos das ordens
    async update(request, response) {
        //inicio de fazer a validação trecho de codigo
        const schema = Yup.object({  
            status: Yup.string().required(),
        });

        try {
            schema.validateSync(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }
        //fim de fazer a validação trecho de codigo


   //procurando usuario com o id do usuario primarykey com findByPk
        // saber se e Admin para acesso de usuario admin true para ter direito a update do status
        const { admin: isAdmin } = await User.findByPk(request.userId);

        if (!isAdmin) {
            //fazendo a validação se nao for admin devolve erro 401 nao é admin
            //se ele for admin pula a validação e segue a criação da categoria
            return response.status(401).json();
        }



        const { id } = request.params; //desta forma que recuperamos o id
        const { status } = request.body; //desta forma que recuperamos o status

        //try catch para filtrar os erros do update
        try {
            // antes devemos saber se o pedido existe updateOne quer dizer update em um so registro do mongodb
        //o update sera procurando o id e update no status
        await Order.updateOne({ _id: id }, { status }); //alterando o status com updateOne
        } catch (err) {
            return response.json({ error: err.message }); 
       }
        //retorno com a mensagem de que o status foi alterado com sucesso
        return response.json({ message: 'Status updated sucessfully' });
    }

}

export default new OrderController();