import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { WorkspacesService } from '@gitroom/backend/services/workspaces/workspaces.service';
import { GetOrgFromRequest } from '@gitroom/nestjs-libraries/user/org.from.request';
import { Organization } from '@prisma/client';
import { CreateWorkspaceDto } from '@gitroom/nestjs-libraries/dtos/workspaces/create.workspace.dto';
import { UpdateWorkspaceDto } from '@gitroom/nestjs-libraries/dtos/workspaces/update.workspace.dto';
import { ApiTags } from '@nestjs/swagger';
import { CheckPolicies } from '@gitroom/backend/services/auth/permissions/permissions.ability';
import { AuthorizationActions, Sections } from '@gitroom/backend/services/auth/permissions/permission.exception.class';

@ApiTags('Workspaces')
@Controller('/workspaces')
export class WorkspacesController {
  constructor(private _workspacesService: WorkspacesService) {}

  @Post('/')
  @CheckPolicies([AuthorizationActions.Create, Sections.Workspaces])
  async createWorkspace(
    @GetOrgFromRequest() org: Organization,
    @Body() body: CreateWorkspaceDto
  ) {
    return this._workspacesService.createWorkspace(org.id, body);
  }

  @Get('/')
  @CheckPolicies([AuthorizationActions.Read, Sections.Workspaces])
  async getWorkspaces(@GetOrgFromRequest() org: Organization) {
    return {
      workspaces: await this._workspacesService.getWorkspaces(org.id),
    };
  }

  @Get('/:id')
  @CheckPolicies([AuthorizationActions.Read, Sections.Workspaces])
  async getWorkspace(
    @GetOrgFromRequest() org: Organization,
    @Param('id') id: string
  ) {
    return this._workspacesService.getWorkspace(org.id, id);
  }

  @Put('/:id')
  @CheckPolicies([AuthorizationActions.Update, Sections.Workspaces])
  async updateWorkspace(
    @GetOrgFromRequest() org: Organization,
    @Param('id') id: string,
    @Body() body: UpdateWorkspaceDto
  ) {
    return this._workspacesService.updateWorkspace(org.id, id, body);
  }

  @Delete('/:id')
  @CheckPolicies([AuthorizationActions.Delete, Sections.Workspaces])
  async deleteWorkspace(
    @GetOrgFromRequest() org: Organization,
    @Param('id') id: string
  ) {
    return this._workspacesService.deleteWorkspace(org.id, id);
  }
}

