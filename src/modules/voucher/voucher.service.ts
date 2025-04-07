import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Voucher } from "@/entities/voucher.entity";
import { User } from "@/entities/user.entity";
import { CreateVoucherDto } from "./dto/create-voucher.dto";
import { UpdateVoucherDto } from "./dto/update-voucher.dto";

@Injectable()
export class VoucherService {
  constructor(
    @InjectRepository(Voucher)
    private readonly voucherRepository: Repository<Voucher>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}
  private generateRandomCode(): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 3; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  private async generateUniqueCode(): Promise<string> {
    let code: string;
    let existingVoucher: Voucher | null;

    do {
      code = this.generateRandomCode();
      existingVoucher = await this.voucherRepository.findOne({
        where: { code },
      });
    } while (existingVoucher);

    return code;
  }
  async findAll(): Promise<Voucher[]> {
    return this.voucherRepository.find({
     
    });
  }

  async findOne(id: number): Promise<Voucher> {
    const voucher = await this.voucherRepository.findOne({
      where: { id },
    });

    if (!voucher) {
      throw new NotFoundException(`Voucher with ID ${id} not found`);
    }
    return voucher;
  }

  async getAllVouchersByUser(userId: number): Promise<Voucher[]> {
    return this.voucherRepository.find({
      where: { users: { id: userId } },
    });
  }

  async addVoucherToUser(
    userId: number,
    voucherCode: string
  ): Promise<Voucher> {
    const voucher = await this.voucherRepository.findOne({
      where: { code: voucherCode },
    });

    if (!voucher) {
      throw new NotFoundException(`Voucher with code ${voucherCode} not found`);
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["vouchers"],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const currentDate = new Date();
    if (voucher.exp_date < currentDate) {
      throw new BadRequestException("This voucher has expired");
    }
    if (voucher.users && voucher.users.some((u) => u.id === userId)) {
      throw new BadRequestException("User already has this voucher");
    }
    if (!voucher.users) {
      voucher.users = [];
    }
    voucher.users.push(user);
    return this.voucherRepository.save(voucher);
  }

  async create(createVoucherDto: CreateVoucherDto): Promise<Voucher> {
    const code = await this.generateUniqueCode();

    const voucher = this.voucherRepository.create({
      ...createVoucherDto,
      code,
    });

    return this.voucherRepository.save(voucher);
  }

  async update(
    id: number,
    updateVoucherDto: UpdateVoucherDto
  ): Promise<Voucher> {
    const voucher = await this.findOne(id);

    Object.assign(voucher, updateVoucherDto);
    return this.voucherRepository.save(voucher);
  }

  async remove(id: number): Promise<void> {
    const result = await this.voucherRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Voucher with ID ${id} not found`);
    }
  }

  async validateVoucher(code: string, userId: number): Promise<Voucher> {
    const voucher = await this.voucherRepository.findOne({
      where: { code },
    });

    if (!voucher) {
      throw new NotFoundException(`Voucher with code ${code} not found`);
    }

    const currentDate = new Date();
    if (voucher.exp_date < currentDate) {
      throw new BadRequestException("This voucher has expired");
    }

    return voucher;
  }
}
