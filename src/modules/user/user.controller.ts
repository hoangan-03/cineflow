import { Controller, Post, Body, Get, Param, Patch, Put } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { User } from "@/entities/user.entity";
import { UserService } from "@/modules/user/services/user.service";
import { UpdateUserDto } from "@/modules/user/dto/update-user.dto";
import { SettingType } from "@/modules/user/enums/setting.enum";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @ApiOperation({ summary: "Get all users" })
  @ApiResponse({ status: 200, description: "Return all users", type: [User] })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing token",
  })
  async getList(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get user by ID" })
  @ApiResponse({ status: 200, description: "Return user by ID", type: User })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Invalid input data",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing token",
  })
  @ApiResponse({
    status: 404,
    description: "Not Found - User not found with the provided ID",
  })
  async getById(@Param("id") id: string): Promise<User> {
    return this.userService.getOne({ where: { id } });
  }

  @Patch(":id")
  @ApiOperation({ summary: 'Update user' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: "Return updated user", type: User })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid credentials",
  })
  @ApiResponse({
    status: 404,
    description: "Not Found - User not found with the provided ID",
  })
  async update(
    @Param("id") id: string,
    @Body() user: UpdateUserDto
  ): Promise<User> {
    return this.userService.updateProfile(id, user);
  }

  @Put(":id/profile-picture")
  @ApiOperation({ summary: "Update user profile picture" })
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
  @ApiResponse({
    status: 200,
    description: "Profile picture updated",
    type: User,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid credentials",
  })
  @ApiResponse({
    status: 404,
    description: "Not Found - User not found with the provided ID",
  })
  async updateProfilePicture(
    @Param("id") id: string,
    @Body("imageUrl") imageUrl: string
  ): Promise<User> {
    return this.userService.updateProfilePicture(id, imageUrl);
  }
}
