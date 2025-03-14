import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindOneOptions } from "typeorm";
import { User } from "@/entities/user.entity";
import { UpdateUserDto } from "@/modules/user/dto/update-user.dto";
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { validate as uuidValidate } from "uuid";
import { Role } from "@/modules/auth/enums/role.enum";
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  // User Management
  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create({
      ...data,
      role: Role.MOVIEGOER,
    });
    return this.userRepository.save(user);
  }
  async getAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getOne(options: FindOneOptions<User>): Promise<User> {
    if (options.where && "id" in options.where) {
      const id = options.where.id as string;
      if (!uuidValidate(id)) {
        throw new BadRequestException("Invalid UUID format");
      }
    }
    const user = await this.userRepository.findOne(options);
    if (!user) {
      const identifier = options.where
        ? Object.entries(options.where)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")
        : "unknown";

      throw new NotFoundException(
        `There isn't any user with id:  ${identifier}`
      );
    }
    return user;
  }

  // Profile Management
  async updateProfile(id: string, updates: UpdateUserDto): Promise<User> {
    const user = await this.getOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`There isn't any user with id: ${id}`);
    }
    this.userRepository.merge(user, updates);
    return this.userRepository.save(user);
  }

  async updateProfilePicture(id: string, imageUrl: string): Promise<User> {
    const user = await this.getOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`There isn't any user with id: ${id}`);
    }
    user.profileImageUrl = imageUrl;
    return this.userRepository.save(user);
  }

  // Payment Methods
  // async addPaymentMethod(
  //   userId: string,
  //   paymentMethod: Partial<PaymentMethods>
  // ): Promise<PaymentMethods> {
  //   const newPaymentMethod = this.paymentMethodRepository.create({
  //     ...paymentMethod,
  //     userId: userId,
  //   });
  //   return this.paymentMethodRepository.save(newPaymentMethod);
  // }

  // User Status
}
