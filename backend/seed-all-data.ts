import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config({ path: join(__dirname, '.env') });

const HOSTED_MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:none%403355@cluster0.o720s51.mongodb.net/?appName=Cluster0';
const LOCAL_MONGODB_URI = 'mongodb://localhost:27017/investmais';

// --- DATA DEFINITIONS ---

const coursesData = [
    {
        title: 'Introdução aos Investimentos',
        instructor: 'João Silva',
        lessonsCount: 3,
        icon: 'trending-up',
        price: 0,
        recommended: true,
        description: 'Aprenda os conceitos básicos de como investir seu dinheiro de forma inteligente.',
        category: 'Básico',
        lessonsList: [
            {
                title: 'O que é Investimento?',
                type: 'video',
                videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                duration: '05:00'
            },
            {
                title: 'Tipos de Ativos',
                type: 'text',
                textContent: 'Existem diversos tipos de ativos financeiros, como ações, títulos, fundos imobiliários, etc.'
            },
            {
                title: 'Quiz de Nivelamento',
                type: 'quiz',
                quiz: [
                    {
                        question: 'Qual o principal objetivo de investir?',
                        options: ['Gastar dinheiro', 'Multiplicar patrimônio', 'Perder dinheiro', 'Colecionar moedas'],
                        correctAnswer: 1
                    },
                    {
                        question: 'O que é a Selic?',
                        options: ['Um tipo de ação', 'A taxa básica de juros', 'Um banco digital', 'Um fundo de investimento'],
                        correctAnswer: 1
                    }
                ]
            }
        ]
    },
    {
        title: 'Renda Fixa Avançada',
        instructor: 'Maria Oliveira',
        lessonsCount: 2,
        icon: 'account-balance',
        price: 49.90,
        recommended: true,
        description: 'Domine o mercado de renda fixa e aprenda a escolher os melhores títulos.',
        category: 'Avançado',
        lessonsList: [
            {
                title: 'Tesouro Direto vs CDB',
                type: 'video',
                videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                duration: '10:00'
            },
            {
                title: 'Estratégias de Marcação a Mercado',
                type: 'text',
                textContent: 'A marcação a mercado pode gerar lucros significativos na renda fixa antes do vencimento.'
            }
        ]
    }
];

const newsData = [
    {
        title: 'Mercado Financeiro em Alta',
        content: 'O Ibovespa atingiu hoje sua máxima histórica impulsionado pelas commodities e pelo cenário externo favorável.',
        excerpt: 'Bolsa brasileira atinge patamares recordes com otimismo global.',
        category: 'Economia',
        imageUrl: 'https://images.unsplash.com/photo-1611974714652-540306173004',
        featured: true
    },
    {
        title: 'Novas Regras para Dividendos',
        content: 'O governo anunciou mudanças na tributação de dividendos que podem impactar a rentabilidade de investidores pessoa física.',
        excerpt: 'Entenda como as novas propostas podem afetar sua carteira.',
        category: 'Regulação',
        imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85',
        featured: false
    },
    {
        title: 'Criptomoedas: O que esperar para 2026',
        content: 'Analistas preveem uma maior institucionalização do Bitcoin e do Ethereum, trazendo mais estabilidade ao setor.',
        excerpt: 'Tendências e previsões para o mercado cripto no próximo ano.',
        category: 'Cripto',
        imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d',
        featured: true
    }
];

const categoriesData = [
    { name: 'Eletrônicos', description: 'Dispositivos eletrônicos e gadgets', imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661' },
    { name: 'Roupas', description: 'Vestuário masculino, feminino e infantil', imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f' },
    { name: 'Livros', description: 'Livros de diversos gêneros', imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f' }
];

const productsData = [
    {
        name: 'Smartphone Pro Max',
        description: 'O mais novo smartphone com tecnologia 5G',
        price: 4499.99,
        stock: 50,
        discount: 10,
        imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9'
    },
    {
        name: 'Camiseta de Algodão Premium',
        description: 'Camiseta 100% algodão, confortável e durável',
        price: 63.92,
        stock: 200,
        discount: 20,
        imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518'
    },
    {
        name: 'Livro: O Investidor Inteligente',
        description: 'O guia clássico para investir com segurança e inteligência.',
        price: 59.90,
        stock: 100,
        discount: 5,
        imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f'
    }
];

// --- SCHEMAS ---

const QuizQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: Number, required: true }
});

const LessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true, enum: ['video', 'quiz', 'text'] },
    videoUrl: { type: String },
    textContent: { type: String },
    quiz: [QuizQuestionSchema],
    duration: { type: String },
    completed: { type: Boolean, default: false }
});

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    instructor: { type: String, required: true },
    lessonsList: [LessonSchema],
    lessonsCount: { type: Number, required: true },
    icon: { type: String, required: true },
    price: { type: Number, default: 0 },
    recommended: { type: Boolean, default: false },
    description: { type: String },
    category: { type: String }
}, { timestamps: true });

const NewsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    excerpt: { type: String },
    category: { type: String, required: true },
    imageUrl: { type: String },
    featured: { type: Boolean, default: false },
    likes: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] },
    dislikes: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] },
    comments: { type: [new mongoose.Schema({
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        userName: { type: String, required: true },
        content: { type: String, required: true }
    }, { timestamps: true })], default: [] }
}, { timestamps: true });

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

// --- SEED FUNCTION ---

async function seedData(uri: string, label: string) {
    try {
        console.log(`\n--- Iniciando seed de dados para ${label} ---`);
        console.log(`Conectando ao MongoDB: ${uri.split('@').pop()?.split('?')[0]}...`);
        
        try {
            await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        } catch (connError) {
            console.warn(`Aviso: Não foi possível conectar ao MongoDB ${label}. Pulando...`);
            return;
        }
        
        console.log(`Conectado com sucesso ao ${label}!`);

        // Models
        const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);
        const News = mongoose.models.News || mongoose.model('News', NewsSchema);
        const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
        const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

        // Clear existing data
        console.log('Limpando dados existentes...');
        await Course.deleteMany({});
        await News.deleteMany({});
        await Product.deleteMany({});
        await Category.deleteMany({});

        // Seed Courses
        console.log('Semeando Cursos...');
        await Course.insertMany(coursesData);
        console.log(`${coursesData.length} cursos inseridos.`);

        // Seed News
        console.log('Semeando Notícias...');
        await News.insertMany(newsData);
        console.log(`${newsData.length} notícias inseridas.`);

        // Seed Store (Categories & Products)
        console.log('Semeando Loja (Categorias e Produtos)...');
        const createdCategories = await Category.insertMany(categoriesData);
        
        const productsWithCategory = productsData.map((product, index) => ({
            ...product,
            category: createdCategories[index % createdCategories.length]._id
        }));
        
        await Product.insertMany(productsWithCategory);
        console.log(`${createdCategories.length} categorias e ${productsWithCategory.length} produtos inseridos.`);

        console.log(`Seed de dados concluído com sucesso para ${label}!`);
    } catch (error) {
        console.error(`Erro ao semear dados em ${label}:`, error);
    } finally {
        await mongoose.disconnect();
        console.log(`Desconectado do MongoDB ${label}.`);
    }
}

async function run() {
    // Rodar para o local
    await seedData(LOCAL_MONGODB_URI, 'Local');
    
    // Rodar para o hospedado
    await seedData(HOSTED_MONGODB_URI, 'Hospedado');
}

run();
