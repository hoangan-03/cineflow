import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Snack } from "@/entities/snack.entity";
import { User } from "@/entities/user.entity";
import { CreateSnackDto } from "./dto/create-snack.dto";
import { UpdateSnackDto } from "./dto/update-snack.dto";

@Injectable()
export class SnackService {
  constructor(
    @InjectRepository(Snack)
    private readonly snackRepository: Repository<Snack>,
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findAll(): Promise<Snack[]> {
    return this.snackRepository.find({
      relations: ['user']
    });
  }

  async findOne(id: number): Promise<Snack> {
    const snack = await this.snackRepository.findOne({
      where: { id },
      relations: ['user']
    });
    
    if (!snack) {
      throw new NotFoundException(`Snack with ID ${id} not found`);
    }
    
    return snack;
  }

  async findAllByUser(userId: number): Promise<Snack[]> {
    return this.snackRepository.find({ 
      where: { user_id: userId },
      relations: ['user']
    });
  }

  async create(createSnackDto: CreateSnackDto, userId: number): Promise<Snack> {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    
    const snack = this.snackRepository.create({
      ...createSnackDto,
      user_id: userId
    });
    
    return this.snackRepository.save(snack);
  }

  async update(id: number, updateSnackDto: UpdateSnackDto, userId: number): Promise<Snack> {
    const snack = await this.findOne(id);
    
    // Check if user owns the snack or is a staff member
    if (snack.user_id !== userId) {
      throw new ForbiddenException('You do not have permission to update this snack');
    }
    
    // Update fields
    Object.assign(snack, updateSnackDto);
    
    return this.snackRepository.save(snack);
  }

  async remove(id: number, userId: number): Promise<void> {
    const snack = await this.findOne(id);
    
    // Check if user owns the snack or is a staff member
    if (snack.user_id !== userId) {
      throw new ForbiddenException('You do not have permission to delete this snack');
    }
    
    const result = await this.snackRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Snack with ID ${id} not found`);
    }
  }
}