import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Delete,
  Query,
  Patch,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
} from "@nestjs/swagger";
import { User } from "@/entities/user.entity";
import { UserService } from "@/modules/user/user.service";
import { UpdateUserDto } from "@/modules/user/dto/update-user.dto";
import { JWTAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@/modules/auth/guards/roles.guard";
import { Roles } from "@/modules/auth/decorators/roles.decorator";
import { Role } from "@/modules/auth/enums/role.enum";
import { Public } from "@/modules/auth/decorators/public.decorator";
import { AuthUser } from "@/modules/user/decorators/user.decorator";

@ApiTags("users")
@UseGuards(JWTAuthGuard, RolesGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly userService: UserService) {}

  // ===== STAFF ROUTES =====

  @Get()
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all users - Role: Staff" })
  @ApiResponse({ status: 200, description: "Return all users", type: [User] })
  @ApiResponse({
    status: 403,
    description: "You are not allowed to access this resource",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  @ApiQuery({
    name: "role",
    required: false,
    type: String,
    enum: Role,
    description: "Filter users by role",
  })
  async getList(@Query("role") role?: Role): Promise<User[]> {
    return this.userService.getAll(role);
  }

  @Get(":id")
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user by ID - Role: Staff" })
  @ApiResponse({ status: 200, description: "Return user by ID", type: User })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({
    status: 403,
    description: "You are not allowed to access this resource",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  async getById(@Param("id") id: number): Promise<User> {
    return this.userService.getOne({ where: { id } });
  }

  @Patch(":id/role")
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update user role - Role: staff" })
  @ApiResponse({
    status: 200,
    description: "Role updated successfully",
    type: User,
  })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({
    status: 403,
    description: "You are not allowed to access this resource",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        role: {
          type: "string",
          enum: Object.values(Role),
          example: Role.MOVIEGOER,
        },
      },
    },
  })
  async updateRole(
    @Param("id") id: number,
    @Body("role") role: Role
  ): Promise<User> {
    return this.userService.updateRole(id, role);
  }

  @Delete(":id")
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete user - Role: Staff" })
  @ApiResponse({ status: 200, description: "User deleted successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({
    status: 403,
    description: "You are not allowed to access this resource",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  async deleteUser(@Param("id") id: number): Promise<void> {
    return this.userService.deleteUser(id);
  }

  // ===== MOVIEGOER ROUTES =====

  @Get("profile/me")
  @Roles(Role.MOVIEGOER, Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user profile - Role: Moviegoer/Staff" })
  @ApiResponse({
    status: 200,
    description: "Return current user's profile",
    type: User,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  async getMyProfile(@AuthUser() user: User): Promise<User> {
    return this.userService.getOne({ where: { id: user.id } });
  }

  @Put("profile/me")
  @Roles(Role.MOVIEGOER, Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update current user profile - Role: Moviegoer/Staff",
  })
  @ApiResponse({
    status: 200,
    description: "Profile updated successfully",
    type: User,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  async updateMyProfile(
    @AuthUser() user: User,
    @Body() updateData: UpdateUserDto
  ): Promise<User> {
    return this.userService.updateProfile(user.id, updateData);
  }

  @Put("profile/me/picture")
  @Roles(Role.MOVIEGOER, Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update current users profile picture - Role: Moviegoer/Staff",
  })
  @ApiResponse({
    status: 200,
    description: "Profile picture updated",
    type: User,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        imageUrl: {
          type: "string",
          example: "https://example.com/image.jpg",
        },
      },
    },
  })
  async updateMyProfilePicture(
    @AuthUser() user: User,
    @Body("imageUrl") imageUrl: string
  ): Promise<User> {
    return this.userService.updateProfilePicture(user.id, imageUrl);
  }
}
