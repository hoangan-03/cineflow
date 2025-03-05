import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { Review } from '@/entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { GetUser } from '@/modules/auth/decorators/get-user.decorator';
import { User } from '@/entities/user.entity';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  @ApiOperation({ summary: 'Get all reviews' })
  @ApiResponse({ status: 200, description: 'Return all reviews', type: [Review] })
  async findAll(@Query('movieId') movieId?: string): Promise<Review[]> {
    return this.reviewService.findAll(movieId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get review by ID' })
  @ApiResponse({ status: 200, description: 'Return review by ID', type: Review })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async findOne(@Param('id') id: string): Promise<Review> {
    return this.reviewService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({ status: 201, description: 'Review created successfully', type: Review })
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @GetUser() user: User
  ): Promise<Review> {
    return this.reviewService.create(createReviewDto, user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a review' })
  @ApiResponse({ status: 200, description: 'Review updated successfully', type: Review })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async update(
    @Param('id') id: string, 
    @Body() updateReviewDto: UpdateReviewDto,
    @GetUser() user: User
  ): Promise<Review> {
    return this.reviewService.update(id, updateReviewDto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a review' })
  @ApiResponse({ status: 200, description: 'Review deleted successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async remove(
    @Param('id') id: string,
    @GetUser() user: User
  ): Promise<void> {
    return this.reviewService.remove(id, user.id);
  }
}