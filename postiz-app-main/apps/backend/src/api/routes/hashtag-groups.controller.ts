import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { HashtagGroupsService } from '@gitroom/backend/services/hashtag-groups/hashtag-groups.service';
import { GetOrgFromRequest } from '@gitroom/nestjs-libraries/user/org.from.request';
import { Organization } from '@prisma/client';
import { CreateHashtagGroupDto } from '@gitroom/nestjs-libraries/dtos/hashtag-groups/create.hashtag-group.dto';
import { ApiTags } from '@nestjs/swagger';
import { CheckPolicies } from '@gitroom/backend/services/auth/permissions/permissions.ability';
import { AuthorizationActions, Sections } from '@gitroom/backend/services/auth/permissions/permission.exception.class';

@ApiTags('Hashtag Groups')
@Controller('/hashtag-groups')
export class HashtagGroupsController {
  constructor(private _hashtagGroupsService: HashtagGroupsService) {}

  @Post('/')
  @CheckPolicies([AuthorizationActions.Create, Sections.HashtagGroups])
  async createHashtagGroup(
    @GetOrgFromRequest() org: Organization,
    @Body() body: CreateHashtagGroupDto
  ) {
    return this._hashtagGroupsService.createHashtagGroup(org.id, body);
  }

  @Get('/')
  @CheckPolicies([AuthorizationActions.Read, Sections.HashtagGroups])
  async getHashtagGroups(
    @GetOrgFromRequest() org: Organization,
    @Query('workspaceId') workspaceId?: string
  ) {
    return {
      hashtagGroups: await this._hashtagGroupsService.getHashtagGroups(
        org.id,
        workspaceId
      ),
    };
  }

  @Get('/:id')
  @CheckPolicies([AuthorizationActions.Read, Sections.HashtagGroups])
  async getHashtagGroup(
    @GetOrgFromRequest() org: Organization,
    @Param('id') id: string
  ) {
    return this._hashtagGroupsService.getHashtagGroup(org.id, id);
  }

  @Put('/:id')
  @CheckPolicies([AuthorizationActions.Update, Sections.HashtagGroups])
  async updateHashtagGroup(
    @GetOrgFromRequest() org: Organization,
    @Param('id') id: string,
    @Body() body: Partial<CreateHashtagGroupDto>
  ) {
    return this._hashtagGroupsService.updateHashtagGroup(org.id, id, body);
  }

  @Delete('/:id')
  @CheckPolicies([AuthorizationActions.Delete, Sections.HashtagGroups])
  async deleteHashtagGroup(
    @GetOrgFromRequest() org: Organization,
    @Param('id') id: string
  ) {
    return this._hashtagGroupsService.deleteHashtagGroup(org.id, id);
  }
}

