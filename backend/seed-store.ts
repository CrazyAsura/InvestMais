import * as mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:none%403355@cluster0.o720s51.mongodb.net/?appName=Cluster0';

async function seedStore() {
    try {
        console.log('Conectando ao MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Conectado com sucesso!');

        // Definir Schemas
        const CategorySchema = new mongoose.Schema({
            name: { type: String, required: true, unique: true },
            description: { type: String },
            active: { type: Boolean, default: true },
            imageUrl: { type: String },
        }, { timestamps: true });

        const ProductSchema = new mongoose.Schema({
            name: { type: String, required: true },
            description: { type: String },
            price: { type: Number, required: true },
            stock: { type: Number, required: true },
            category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
            active: { type: Boolean, default: true },
            discount: { type: Number, default: 0 },
            imageUrl: { type: String },
        }, { timestamps: true });

        const Category = mongoose.model('Category', CategorySchema);
        const Product = mongoose.model('Product', ProductSchema);

        // Limpar dados existentes (opcional, mas bom para idempotência)
        console.log('Limpando coleções existentes...');
        await Product.deleteMany({});
        await Category.deleteMany({});

        const categoriesData = [
            { name: 'Eletrônicos', description: 'Dispositivos eletrônicos e gadgets', imageUrl: 'https://img.freepik.com/fotos-gratis/dispositivos-eletronicos-modernos-em-uma-mesa-de-madeira_1150-18829.jpg' },
            { name: 'Roupas', description: 'Vestuário masculino, feminino e infantil', imageUrl: 'https://img.freepik.com/fotos-gratis/cabide-com-roupas-em-uma-loja_1150-12821.jpg' },
            { name: 'Alimentos', description: 'Itens de mercearia e perecíveis', imageUrl: 'https://img.freepik.com/fotos-gratis/alimentos-saudaveis-em-uma-mesa_1150-12821.jpg' },
            { name: 'Móveis', description: 'Móveis para casa e escritório', imageUrl: 'https://img.freepik.com/fotos-gratis/sala-de-estar-moderna-com-sofa_1150-12821.jpg' },
            { name: 'Esportes', description: 'Equipamentos e acessórios esportivos', imageUrl: 'https://img.freepik.com/fotos-gratis/equipamento-esportivo-em-uma-academia_1150-12821.jpg' },
            { name: 'Beleza', description: 'Produtos de higiene e cosméticos', imageUrl: 'https://img.freepik.com/fotos-gratis/produtos-de-beleza-em-uma-mesa_1150-12821.jpg' },
            { name: 'Brinquedos', description: 'Brinquedos para todas as idades', imageUrl: 'https://img.freepik.com/fotos-gratis/brinquedos-infantis-em-uma-prateleira_1150-12821.jpg' },
            { name: 'Livros', description: 'Livros de diversos gêneros', imageUrl: 'https://img.freepik.com/fotos-gratis/livros-em-uma-biblioteca_1150-12821.jpg' },
            { name: 'Automotivo', description: 'Acessórios e peças para veículos', imageUrl: 'https://img.freepik.com/fotos-gratis/acessorios-automotivos-em-uma-garagem_1150-12821.jpg' },
            { name: 'Pet Shop', description: 'Produtos para animais de estimação', imageUrl: 'https://img.freepik.com/fotos-gratis/produtos-para-animais-de-estimacao-em-uma-loja_1150-12821.jpg' },
        ];

        console.log('Inserindo categorias...');
        const createdCategories = await Category.insertMany(categoriesData);
        console.log(`${createdCategories.length} categorias inseridas.`);

        const productsData = [
            {
                name: 'Smartphone Pro Max',
                description: 'O mais novo smartphone com tecnologia 5G',
                price: 4499.99,
                stock: 50,
                category: createdCategories[0]._id,
                discount: 10,
                imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9'
            },
            {
                name: 'Camiseta de Algodão Premium',
                description: 'Camiseta 100% algodão, confortável e durável',
                price: 63.92,
                stock: 200,
                category: createdCategories[1]._id,
                discount: 20,
                imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518'
            },
            {
                name: 'Arroz Integral 5kg',
                description: 'Arroz integral de alta qualidade',
                price: 25.50,
                stock: 100,
                category: createdCategories[2]._id,
                discount: 0,
                imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c'
            },
            {
                name: 'Sofá Retrátil 3 Lugares',
                description: 'Sofá confortável e elegante para sua sala',
                price: 2124.15,
                stock: 10,
                category: createdCategories[3]._id,
                discount: 15,
                imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc'
            },
            {
                name: 'Bola de Futebol Profissional',
                description: 'Bola aprovada pela FIFA para jogos profissionais',
                price: 150.00,
                stock: 30,
                category: createdCategories[4]._id,
                discount: 0,
                imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018'
            },
            {
                name: 'Kit de Maquiagem Completo',
                description: 'Tudo o que você precisa para uma maquiagem perfeita',
                price: 209.93,
                stock: 45,
                category: createdCategories[5]._id,
                discount: 30,
                imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9'
            },
            {
                name: 'Lego Star Wars Millenium Falcon',
                description: 'Monte a nave mais famosa da galáxia',
                price: 899.99,
                stock: 15,
                category: createdCategories[6]._id,
                discount: 0,
                imageUrl: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60'
            },
            {
                name: 'O Senhor dos Anéis: A Sociedade do Anel',
                description: 'O clássico da literatura fantástica de J.R.R. Tolkien',
                price: 59.90,
                stock: 80,
                category: createdCategories[7]._id,
                discount: 0,
                imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f'
            },
            {
                name: 'Jogo de Pneus Aro 15',
                description: 'Pneus de alta performance para seu carro',
                price: 1080.00,
                stock: 20,
                category: createdCategories[8]._id,
                discount: 10,
                imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d'
            },
            {
                name: 'Ração Premium para Cães Adultos 15kg',
                description: 'Nutrição completa e balanceada para seu pet',
                price: 189.90,
                stock: 60,
                category: createdCategories[9]._id,
                discount: 0,
                imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e'
            }
        ];

        console.log('Inserindo produtos...');
        const createdProducts = await Product.insertMany(productsData);
        console.log(`${createdProducts.length} produtos inseridos.`);

    } catch (error) {
        console.error('Erro ao semear loja:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Desconectado do MongoDB.');
    }
}

seedStore();
