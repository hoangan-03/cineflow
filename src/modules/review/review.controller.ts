import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { ReviewService } from "./review.service";
import { Review } from "@/entities/review.entity";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { JWTAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { GetUser } from "@/modules/auth/decorators/get-user.decorator";
import { User } from "@/entities/user.entity";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../auth/enums/role.enum";

@ApiTags("reviews")
@ApiBearerAuth()
@UseGuards(JWTAuthGuard, RolesGuard)
@Controller("reviews")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  @Roles(Role.STAFF, Role.MOVIEGOER)
  @ApiOperation({ summary: "Get all reviews - Role: Staff/Moviegoer" })
  @ApiResponse({
    status: 200,
    description: "Return all reviews",
    type: [Review],
  })
  async findAll(@Query("movieId") id?: number): Promise<Review[]> {
    return this.reviewService.findAll(id);
  }

  @Get(":id")
  @Roles(Role.STAFF, Role.MOVIEGOER)
  @ApiOperation({ summary: "Get review by ID - Role: Staff/Moviegoer" })
  @ApiResponse({
    status: 200,
    description: "Return review by ID",
    type: Review,
  })
  @ApiResponse({ status: 404, description: "Review not found" })
  async findOne(@Param("id") id: number): Promise<Review> {
    return this.reviewService.findOne(id);
  }

  @Post()
  @Roles(Role.MOVIEGOER)
  @ApiOperation({ summary: "Create a new review - Role: Moviegoer" })
  @ApiResponse({
    status: 201,
    description: "Review created successfully",
    type: Review,
  })
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @GetUser() user: User
  ): Promise<Review> {
    return this.reviewService.create(createReviewDto, user.id);
  }

  @Put(":id")
  @Roles(Role.MOVIEGOER)
  @ApiOperation({ summary: "Update a review - Role: Moviegoer" })
  @ApiResponse({
    status: 200,
    description: "Review updated successfully",
    type: Review,
  })
  @ApiResponse({ status: 404, description: "Review not found" })
  async update(
    @Param("id") id: number,
    @Body() updateReviewDto: UpdateReviewDto,
    @GetUser() user: User
  ): Promise<Review> {
    return this.reviewService.update(id, updateReviewDto, user.id);
  }

  @Delete(":id")
  @Roles(Role.MOVIEGOER, Role.STAFF)
  @ApiOperation({ summary: "Delete a review - Role: Staff/Moviegoer" })
  @ApiResponse({ status: 200, description: "Review deleted successfully" })
  @ApiResponse({ status: 404, description: "Review not found" })
  async remove(@Param("id") id: number, @GetUser() user: User): Promise<void> {
    return this.reviewService.remove(id, user.id);
  }
}
