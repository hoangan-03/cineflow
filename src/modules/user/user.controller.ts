import { Controller, Get, Post, Body, Param, Put, UseGuards, Delete, Query, Patch } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiQuery } from "@nestjs/swagger";
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
  @ApiOperation({ summary: "Get all users (staff only)" })
  @ApiResponse({ status: 200, description: "Return all users", type: [User] })
  @ApiQuery({ 
    name: 'role', 
    required: false, 
    type: String,
    enum: Role,
    description: 'Filter users by role' 
  })
  async getList(@Query('role') role?: Role): Promise<User[]> {
    return this.userService.getAll(role);
  }

  @Get(":id")
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user by ID (staff only)" })
  @ApiResponse({ status: 200, description: "Return user by ID", type: User })
  @ApiResponse({ status: 404, description: "User not found" })
  async getById(@Param("id") id: string): Promise<User> {
    return this.userService.getOne({ where: { id } });
  }

  @Patch(":id/role")
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update user role (staff only)" })
  @ApiResponse({ status: 200, description: "Role updated successfully", type: User })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        role: {
          type: 'string',
          enum: Object.values(Role),
          example: Role.MOVIEGOER
        }
      }
    }
  })
  async updateRole(
    @Param("id") id: string,
    @Body("role") role: Role
  ): Promise<User> {
    return this.userService.updateRole(id, role);
  }

  @Delete(":id")
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user (staff only)' })
  @ApiResponse({ status: 200, description: "User deleted successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  async deleteUser(@Param("id") id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }

  // ===== MOVIEGOER ROUTES =====

  @Get("profile/me")
  @Roles(Role.MOVIEGOER, Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user profile" })
  @ApiResponse({ status: 200, description: "Return current user's profile", type: User })
  async getMyProfile(@AuthUser() user: User): Promise<User> {
    return this.userService.getOne({ where: { id: user.id } });
  }

  @Put("profile/me")
  @Roles(Role.MOVIEGOER, Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: "Profile updated successfully", type: User })
  async updateMyProfile(
    @AuthUser() user: User,
    @Body() updateData: UpdateUserDto
  ): Promise<User> {
    return this.userService.updateProfile(user.id, updateData);
  }

  @Put("profile/me/picture")
  @Roles(Role.MOVIEGOER, Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update current users profile picture" })
  @ApiResponse({ status: 200, description: "Profile picture updated", type: User })
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