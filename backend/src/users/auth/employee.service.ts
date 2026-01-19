import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as argon2 from 'argon2';
import { User, UserDocument } from '../user/schema/user.schema';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const { email, document, password } = createEmployeeDto;

    const userExists = await this.userModel.findOne({ 
      $or: [{ email }, { document }] 
    });
    
    if (userExists) {
      if (userExists.email === email) {
        throw new ConflictException('Funcionário já cadastrado com este email');
      }
      throw new ConflictException('Funcionário já cadastrado com este CPF/CNPJ');
    }

    const hashedPassword = await argon2.hash(password);
    
    const newEmployee = new this.userModel({
      ...createEmployeeDto,
      password: hashedPassword,
      role: createEmployeeDto.role || 'employee',
      active: true,
    });

    return await newEmployee.save();
  }

  async findAll() {
    return this.userModel.find({ role: 'employee' }).select('-password').exec();
  }

  async findOne(id: string) {
    const employee = await this.userModel.findOne({ _id: id, role: 'employee' }).select('-password').exec();
    if (!employee) {
      throw new NotFoundException('Funcionário não encontrado');
    }
    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    if (updateEmployeeDto.password) {
      updateEmployeeDto.password = await argon2.hash(updateEmployeeDto.password);
    }

    const updatedEmployee = await this.userModel
      .findOneAndUpdate(
        { _id: id, role: 'employee' },
        { $set: updateEmployeeDto },
        { new: true }
      )
      .select('-password')
      .exec();

    if (!updatedEmployee) {
      throw new NotFoundException('Funcionário não encontrado');
    }

    return updatedEmployee;
  }

  async remove(id: string) {
    const result = await this.userModel.deleteOne({ _id: id, role: 'employee' }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Funcionário não encontrado');
    }
    return { message: 'Funcionário removido com sucesso' };
  }
}
