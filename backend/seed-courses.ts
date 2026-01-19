import * as mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:none%403355@cluster0.o720s51.mongodb.net/?appName=Cluster0';

async function seedCourses() {
    try {
        console.log('Conectando ao MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Conectado com sucesso!');

        // Definir Schemas
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

        const Course = mongoose.model('Course', CourseSchema);

        console.log('Limpando cursos existentes...');
        await Course.deleteMany({});

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
                        title: 'Calculando Rentabilidade Real',
                        type: 'quiz',
                        quiz: [
                            {
                                question: 'Como calcular a rentabilidade real?',
                                options: ['Taxa nominal + Inflação', 'Taxa nominal - Inflação', 'Apenas a taxa nominal', 'Apenas a inflação'],
                                correctAnswer: 1
                            }
                        ]
                    }
                ]
            }
        ];

        console.log('Inserindo cursos...');
        const createdCourses = await Course.insertMany(coursesData);
        console.log(`${createdCourses.length} cursos inseridos.`);

        await mongoose.disconnect();
        console.log('Desconectado do MongoDB.');
    } catch (error) {
        console.error('Erro ao popular o banco de dados:', error);
    }
}

seedCourses();
