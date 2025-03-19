import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindOneOptions } from "typeorm";
import { User } from "@/entities/user.entity";
import { UpdateUserDto } from "@/modules/user/dto/update-user.dto";
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
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
  
  async getAll(role?: Role): Promise<User[]> {
    if (role) {
      return this.userRepository.find({ 
        where: { role },
        order: { createdAt: "DESC" }
      });
    }
    return this.userRepository.find({ order: { createdAt: "DESC" } });
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
        `There isn't any user with identifier: ${identifier}`
      );
    }
    return user;
  }

  // Profile Management
  async updateProfile(id: string, updates: UpdateUserDto): Promise<User> {
    const user = await this.getOne({ where: { id } });
    
    // Remove sensitive fields that shouldn't be updated through this method
    const { role, ...safeUpdates } = updates as any;
    
    this.userRepository.merge(user, safeUpdates);
    return this.userRepository.save(user);
  }

  async updateProfilePicture(id: string, imageUrl: string): Promise<User> {
    const user = await this.getOne({ where: { id } });
    user.profileImageUrl = imageUrl;
    return this.userRepository.save(user);
  }
  
  // Staff-only methods
  async updateRole(id: string, role: Role): Promise<User> {
    if (!Object.values(Role).includes(role)) {
      throw new BadRequestException(`Invalid role: ${role}`);
    }
    
    const user = await this.getOne({ where: { id } });
    
    // Optional: Add additional validation if needed
    // For example, prevent changing the last staff user to a regular user
    if (user.role === Role.STAFF && role !== Role.STAFF) {
      const staffCount = await this.userRepository.count({ 
        where: { role: Role.STAFF } 
      });
      
      if (staffCount <= 1) {
        throw new ForbiddenException("Cannot change the role of the last staff user");
      }
    }
    
    user.role = role;
    return this.userRepository.save(user);
  }
  
  async deleteUser(id: string): Promise<void> {
    const user = await this.getOne({ where: { id } });
    
    // Optional: Add additional validation
    // For example, prevent deleting the last staff user
    if (user.role === Role.STAFF) {
      const staffCount = await this.userRepository.count({ 
        where: { role: Role.STAFF } 
      });
      
      if (staffCount <= 1) {
        throw new ForbiddenException("Cannot delete the last staff user");
      }
    }
    
    await this.userRepository.remove(user);
  }
  
  // Additional methods as needed
  async getUserBookings(id: string): Promise<any[]> {
    const user = await this.getOne({ 
      where: { id },
      relations: ['bookings', 'bookings.screening', 'bookings.screening.movie']
    });
    
    return user.bookings || [];
  }
  
  async getUserReviews(id: string): Promise<any[]> {
    const user = await this.getOne({
      where: { id },
      relations: ['reviews', 'reviews.movie']
    });
    
    return user.reviews || [];
  }
}