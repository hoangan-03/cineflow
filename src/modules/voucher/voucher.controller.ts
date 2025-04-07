import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { VoucherService } from "./voucher.service";
import { JWTAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../auth/enums/role.enum";
import { AuthUser } from "../user/decorators/user.decorator";
import { Voucher } from "@/entities/voucher.entity";
import { CreateVoucherDto } from "./dto/create-voucher.dto";
import { UpdateVoucherDto } from "./dto/update-voucher.dto";
import { ValidateVoucherDto } from "./dto/validate-voucher.dto";
import { RedeemVoucherDto } from "./dto/redeem-voucher.dto";

@ApiTags("vouchers")
@ApiBearerAuth()
@UseGuards(JWTAuthGuard, RolesGuard)
@Controller("vouchers")
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  // STAFF routes
  @Get("admin")
  @Roles(Role.STAFF)
  @ApiOperation({ summary: "Get all vouchers - Role: Staff" })
  @ApiResponse({
    status: 200,
    description: "Return all vouchers",
    type: [Voucher],
  })
  async findAll(): Promise<Voucher[]> {
    return this.voucherService.findAll();
  }

  @Get("admin/:id")
  @Roles(Role.STAFF)
  @ApiOperation({ summary: "Get voucher by ID - Role: Staff" })
  @ApiResponse({
    status: 200,
    description: "Return voucher by ID",
    type: Voucher,
  })
  @ApiResponse({ status: 404, description: "Voucher not found" })
  async findOne(@Param("id") id: number): Promise<Voucher> {
    return this.voucherService.findOne(id);
  }

  @Post("admin")
  @Roles(Role.STAFF)
  @ApiOperation({ summary: "Create a new voucher - Role: Staff" })
  @ApiResponse({
    status: 201,
    description: "Voucher created successfully",
    type: Voucher,
  })
  async create(@Body() createVoucherDto: CreateVoucherDto): Promise<Voucher> {
    return this.voucherService.create(createVoucherDto);
  }

  @Put("admin/:id")
  @Roles(Role.STAFF)
  @ApiOperation({ summary: "Update a voucher - Role: Staff" })
  @ApiResponse({
    status: 200,
    description: "Voucher updated successfully",
    type: Voucher,
  })
  @ApiResponse({ status: 404, description: "Voucher not found" })
  async update(
    @Param("id") id: number,
    @Body() updateVoucherDto: UpdateVoucherDto
  ): Promise<Voucher> {
    return this.voucherService.update(id, updateVoucherDto);
  }

  @Delete("admin/:id")
  @Roles(Role.STAFF)
  @ApiOperation({ summary: "Delete a voucher - Role: Staff" })
  @ApiResponse({ status: 200, description: "Voucher deleted successfully" })
  @ApiResponse({ status: 404, description: "Voucher not found" })
  async remove(@Param("id") id: number): Promise<void> {
    return this.voucherService.remove(id);
  }

  @Get("user")
  @Roles(Role.MOVIEGOER)
  @ApiOperation({
    summary: "Get all vouchers for current user - Role: Moviegoer",
  })
  @ApiResponse({
    status: 200,
    description: "Return user's vouchers",
    type: [Voucher],
  })
  async findAllByUser(@AuthUser("id") userId: number): Promise<Voucher[]> {
    return this.voucherService.getAllVouchersByUser(userId);
  }

  @Post("validate")
  @Roles(Role.MOVIEGOER, Role.STAFF)
  @ApiOperation({ summary: "Validate a voucher code - Role: Moviegoer/Staff" })
  @ApiResponse({ status: 200, description: "Voucher is valid", type: Voucher })
  @ApiResponse({ status: 404, description: "Voucher not found" })
  @ApiResponse({ status: 400, description: "Voucher is expired or invalid" })
  async validateVoucher(
    @Body() validateVoucherDto: ValidateVoucherDto,
    @AuthUser("id") userId: number
  ): Promise<Voucher> {
    return this.voucherService.validateVoucher(validateVoucherDto.code, userId);
  }

  @Post("user/redeem-voucher")
  @Roles(Role.MOVIEGOER)
  @ApiOperation({ summary: "Assign voucher to a user - Role: Staff" })
  @ApiResponse({
    status: 200,
    description: "Voucher assigned successfully to user",
    type: Voucher,
  })
  @ApiResponse({ status: 404, description: "Voucher or user not found" })
  @ApiResponse({ status: 400, description: "User already has this voucher" })
  async assignToUser(
    @AuthUser("id") userId: number,
    @Body() redeemVoucherDto: RedeemVoucherDto
  ): Promise<Voucher> {
    return this.voucherService.addVoucherToUser(userId, redeemVoucherDto.code);
  }
}
