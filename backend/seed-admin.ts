import * as mongoose from 'mongoose';
import * as argon2 from 'argon2';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Carregar variáveis de ambiente
const MONGODB_URI = 'mongodb+srv://admin:none%403355@cluster0.o720s51.mongodb.net/?appName=Cluster0';

async function seedAdmin() {
    try {
        console.log('Conectando ao MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Conectado com sucesso!');

        const UserSchema = new mongoose.Schema({
            name: { type: String, required: true },
            email: { type: String, required: true, unique: true },
            document: { type: String, required: true, unique: true },
            birthDate: { type: Date, required: true },
            gender: { type: String, required: true },
            sexuality: { type: String, required: true },
            password: { type: String, required: true },
            role: { type: String, required: true, default: 'user' },
            active: { type: Boolean, required: true, default: true },
        }, { timestamps: true });

        const User = mongoose.model('User', UserSchema);

        const adminEmail = 'admininvestmais@gmail.com';
        const adminPassword = 'None@3355';
        
        const existingAdmin = await User.findOne({ email: adminEmail });

        const hashedPassword = await argon2.hash(adminPassword);

        if (existingAdmin) {
            console.log('Usuário admin já existe. Atualizando cargo e senha...');
            existingAdmin.role = 'admin';
            existingAdmin.password = hashedPassword;
            existingAdmin.active = true;
            await existingAdmin.save();
            console.log('Admin atualizado com sucesso!');
        } else {
            console.log('Criando novo usuário admin...');
            const newAdmin = new User({
                name: 'Admin InvestMais',
                email: adminEmail,
                document: '000.000.000-00', // CPF fictício
                birthDate: new Date('1990-01-01'),
                gender: 'Outro',
                sexuality: 'Outro',
                password: hashedPassword,
                role: 'admin',
                active: true,
            });
            await newAdmin.save();
            console.log('Admin criado com sucesso!');
        }

    } catch (error) {
        console.error('Erro ao semear admin:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Desconectado do MongoDB.');
    }
}

seedAdmin();
