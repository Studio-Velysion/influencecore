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
import { QueuesService } from '@gitroom/backend/services/queues/queues.service';
import { GetOrgFromRequest } from '@gitroom/nestjs-libraries/user/org.from.request';
import { Organization } from '@prisma/client';
import { CreateQueueDto } from '@gitroom/nestjs-libraries/dtos/queues/create.queue.dto';
import { UpdateQueueDto } from '@gitroom/nestjs-libraries/dtos/queues/update.queue.dto';
import { ApiTags } from '@nestjs/swagger';
import { CheckPolicies } from '@gitroom/backend/services/auth/permissions/permissions.ability';
import { AuthorizationActions, Sections } from '@gitroom/backend/services/auth/permissions/permission.exception.class';

@ApiTags('Queues')
@Controller('/queues')
export class QueuesController {
  constructor(private _queuesService: QueuesService) {}

  @Post('/')
  @CheckPolicies([AuthorizationActions.Create, Sections.Queues])
  async createQueue(
    @GetOrgFromRequest() org: Organization,
    @Body() body: CreateQueueDto
  ) {
    return this._queuesService.createQueue(org.id, body);
  }

  @Get('/')
  @CheckPolicies([AuthorizationActions.Read, Sections.Queues])
  async getQueues(
    @GetOrgFromRequest() org: Organization,
    @Query('workspaceId') workspaceId?: string
  ) {
    return {
      queues: await this._queuesService.getQueues(org.id, workspaceId),
    };
  }

  @Get('/:id')
  @CheckPolicies([AuthorizationActions.Read, Sections.Queues])
  async getQueue(
    @GetOrgFromRequest() org: Organization,
    @Param('id') id: string
  ) {
    return this._queuesService.getQueue(org.id, id);
  }

  @Put('/:id')
  @CheckPolicies([AuthorizationActions.Update, Sections.Queues])
  async updateQueue(
    @GetOrgFromRequest() org: Organization,
    @Param('id') id: string,
    @Body() body: UpdateQueueDto
  ) {
    return this._queuesService.updateQueue(org.id, id, body);
  }

  @Delete('/:id')
  @CheckPolicies([AuthorizationActions.Delete, Sections.Queues])
  async deleteQueue(
    @GetOrgFromRequest() org: Organization,
    @Param('id') id: string
  ) {
    return this._queuesService.deleteQueue(org.id, id);
  }

  @Post('/:queueId/assign-post/:postId')
  @CheckPolicies([AuthorizationActions.Update, Sections.Queues])
  async assignPostToQueue(
    @GetOrgFromRequest() org: Organization,
    @Param('queueId') queueId: string,
    @Param('postId') postId: string
  ) {
    return this._queuesService.assignPostToQueue(org.id, postId, queueId);
  }

  @Post('/unassign-post/:postId')
  @CheckPolicies([AuthorizationActions.Update, Sections.Queues])
  async unassignPostFromQueue(
    @GetOrgFromRequest() org: Organization,
    @Param('postId') postId: string
  ) {
    return this._queuesService.assignPostToQueue(org.id, postId, null);
  }
}

