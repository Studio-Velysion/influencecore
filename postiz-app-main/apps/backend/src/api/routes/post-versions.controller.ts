import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostVersionsService } from '@gitroom/backend/services/post-versions/post-versions.service';
import { GetOrgFromRequest } from '@gitroom/nestjs-libraries/user/org.from.request';
import { Organization } from '@prisma/client';
import { CreatePostVersionDto } from '@gitroom/nestjs-libraries/dtos/post-versions/create.post.version.dto';
import { UpdatePostVersionDto } from '@gitroom/nestjs-libraries/dtos/post-versions/update.post.version.dto';
import { ApiTags } from '@nestjs/swagger';
import { CheckPolicies } from '@gitroom/backend/services/auth/permissions/permissions.ability';
import { AuthorizationActions, Sections } from '@gitroom/backend/services/auth/permissions/permission.exception.class';

@ApiTags('Post Versions')
@Controller('/post-versions')
export class PostVersionsController {
  constructor(private _postVersionsService: PostVersionsService) {}

  @Post('/')
  @CheckPolicies([AuthorizationActions.Create, Sections.Posts])
  async createPostVersion(
    @GetOrgFromRequest() org: Organization,
    @Body() body: CreatePostVersionDto
  ) {
    return this._postVersionsService.createPostVersion(org.id, body);
  }

  @Get('/post/:postId')
  @CheckPolicies([AuthorizationActions.Read, Sections.Posts])
  async getPostVersions(
    @GetOrgFromRequest() org: Organization,
    @Param('postId') postId: string
  ) {
    return {
      versions: await this._postVersionsService.getPostVersions(org.id, postId),
    };
  }

  @Get('/:id')
  @CheckPolicies([AuthorizationActions.Read, Sections.Posts])
  async getPostVersion(
    @GetOrgFromRequest() org: Organization,
    @Param('id') id: string
  ) {
    return this._postVersionsService.getPostVersion(org.id, id);
  }

  @Put('/:id')
  @CheckPolicies([AuthorizationActions.Update, Sections.Posts])
  async updatePostVersion(
    @GetOrgFromRequest() org: Organization,
    @Param('id') id: string,
    @Body() body: UpdatePostVersionDto
  ) {
    return this._postVersionsService.updatePostVersion(org.id, id, body);
  }

  @Delete('/:id')
  @CheckPolicies([AuthorizationActions.Delete, Sections.Posts])
  async deletePostVersion(
    @GetOrgFromRequest() org: Organization,
    @Param('id') id: string
  ) {
    return this._postVersionsService.deletePostVersion(org.id, id);
  }
}

