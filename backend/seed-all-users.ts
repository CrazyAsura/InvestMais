import * as mongoose from 'mongoose';
import * as argon2 from 'argon2';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config({ path: join(__dirname, '.env') });

const HOSTED_MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:none%403355@cluster0.o720s51.mongodb.net/?appName=Cluster0';
const LOCAL_MONGODB_URI = 'mongodb://localhost:27017/investmais';

const users = [
    {
        name: 'Admin InvestMais',
        email: 'admininvestmais@gmail.com',
        document: '000.000.000-01',
        role: 'admin',
        sector: 'Administrativo'
    },
    {
        name: 'Contábil InvestMais',
        email: 'contabilinvestmais@gmail.com',
        document: '000.000.000-02',
        role: 'admin',
        sector: 'Contabilidade'
    },
    {
        name: 'Analista InvestMais',
        email: 'analistainvestmais@gmail.com',
        document: '000.000.000-03',
        role: 'admin',
        sector: 'Análise'
    },
    {
        name: 'Suporte InvestMais',
        email: 'suporteinvestmais@gmail.com',
        document: '000.000.000-04',
        role: 'admin',
        sector: 'Suporte'
    },
    {
        name: 'Gerente InvestMais',
        email: 'gerenteinvestmais@gmail.com',
        document: '000.000.000-05',
        role: 'admin',
        sector: 'Gerência'
    },
    {
        name: 'Investimentos InvestMais',
        email: 'investimentosinvestmais@gmail.com',
        document: '000.000.000-06',
        role: 'admin',
        sector: 'Investimentos'
    }
];

const DEFAULT_PASSWORD = 'None@3355';

async function seedUsers(uri: string, label: string) {
    try {
        console.log(`\n--- Iniciando seed para ${label} ---`);
        console.log(`Conectando ao MongoDB: ${uri.split('@').pop()?.split('?')[0]}...`);
        
        // Usar try/catch específico para conexão para não travar o processo se o local estiver offline
        try {
            await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        } catch (connError) {
            console.warn(`Aviso: Não foi possível conectar ao MongoDB ${label}. Pulando...`);
            return;
        }
        
        console.log(`Conectado com sucesso ao ${label}!`);

        const UserSchema = new mongoose.Schema({
            name: { type: String, required: true },
            email: { type: String, required: true, unique: true },
            document: { type: String, required: true, unique: true },
            birthDate: { type: Date, required: true },
            gender: { type: String, required: true },
            sexuality: { type: String, required: true },
            password: { type: String, required: true },
            role: { type: String, required: true, default: 'user' },
            sector: { type: String },
            active: { type: Boolean, required: true, default: true },
        }, { timestamps: true });

        // Evitar erro de "OverwriteModelError" se o modelo já existir
        const User = mongoose.models.User || mongoose.model('User', UserSchema);

        const hashedPassword = await argon2.hash(DEFAULT_PASSWORD);

        for (const userData of users) {
            const existingUser = await User.findOne({ email: userData.email });

            if (existingUser) {
                console.log(`Usuário ${userData.email} já existe. Atualizando dados...`);
                existingUser.name = userData.name;
                existingUser.role = userData.role;
                existingUser.sector = userData.sector;
                existingUser.password = hashedPassword;
                existingUser.active = true;
                await existingUser.save();
                console.log(`Usuário ${userData.email} atualizado!`);
            } else {
                console.log(`Criando novo usuário: ${userData.email}...`);
                const newUser = new User({
                    ...userData,
                    birthDate: new Date('1990-01-01'),
                    gender: 'Outro',
                    sexuality: 'Outro',
                    password: hashedPassword,
                    active: true,
                });
                await newUser.save();
                console.log(`Usuário ${userData.email} criado!`);
            }
        }

        console.log(`Seed concluído com sucesso para ${label}!`);
    } catch (error) {
        console.error(`Erro ao semear ${label}:`, error);
    } finally {
        await mongoose.disconnect();
        console.log(`Desconectado do MongoDB ${label}.`);
    }
}

async function run() {
    // Rodar para o local
    await seedUsers(LOCAL_MONGODB_URI, 'Local');
    
    // Rodar para o hospedado
    await seedUsers(HOSTED_MONGODB_URI, 'Hospedado');
}

run();
