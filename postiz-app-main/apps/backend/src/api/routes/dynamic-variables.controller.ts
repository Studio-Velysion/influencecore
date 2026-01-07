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
import { DynamicVariablesService } from '@gitroom/backend/services/dynamic-variables/dynamic-variables.service';
import { GetOrgFromRequest } from '@gitroom/nestjs-libraries/user/org.from.request';
import { Organization } from '@prisma/client';
import { CreateDynamicVariableDto } from '@gitroom/nestjs-libraries/dtos/dynamic-variables/create.dynamic-variable.dto';
import { ApiTags } from '@nestjs/swagger';
import { CheckPolicies } from '@gitroom/backend/services/auth/permissions/permissions.ability';
import { AuthorizationActions, Sections } from '@gitroom/backend/services/auth/permissions/permission.exception.class';

@ApiTags('Dynamic Variables')
@Controller('/dynamic-variables')
export class DynamicVariablesController {
  constructor(private _dynamicVariablesService: DynamicVariablesService) {}

  @Post('/')
  @CheckPolicies([AuthorizationActions.Create, Sections.DynamicVariables])
  async createDynamicVariable(
    @GetOrgFromRequest() org: Organization,
    @Body() body: CreateDynamicVariableDto
  ) {
    return this._dynamicVariablesService.createDynamicVariable(org.id, body);
  }

  @Get('/')
  @CheckPolicies([AuthorizationActions.Read, Sections.DynamicVariables])
  async getDynamicVariables(
    @GetOrgFromRequest() org: Organization,
    @Query('workspaceId') workspaceId?: string
  ) {
    return {
      variables: await this._dynamicVariablesService.getDynamicVariables(
        org.id,
        workspaceId
      ),
      systemVariables: await this._dynamicVariablesService.getSystemVariables(),
    };
  }

  @Get('/system')
  async getSystemVariables() {
    return {
      systemVariables: await this._dynamicVariablesService.getSystemVariables(),
    };
  }

  @Get('/:id')
  @CheckPolicies([AuthorizationActions.Read, Sections.DynamicVariables])
  async getDynamicVariable(
    @GetOrgFromRequest() org: Organization,
    @Param('id') id: string
  ) {
    return this._dynamicVariablesService.getDynamicVariable(org.id, id);
  }

  @Put('/:id')
  @CheckPolicies([AuthorizationActions.Update, Sections.DynamicVariables])
  async updateDynamicVariable(
    @GetOrgFromRequest() org: Organization,
    @Param('id') id: string,
    @Body() body: Partial<CreateDynamicVariableDto>
  ) {
    return this._dynamicVariablesService.updateDynamicVariable(org.id, id, body);
  }

  @Delete('/:id')
  @CheckPolicies([AuthorizationActions.Delete, Sections.DynamicVariables])
  async deleteDynamicVariable(
    @GetOrgFromRequest() org: Organization,
    @Param('id') id: string
  ) {
    return this._dynamicVariablesService.deleteDynamicVariable(org.id, id);
  }

  @Post('/resolve')
  @CheckPolicies([AuthorizationActions.Read, Sections.DynamicVariables])
  async resolveVariables(
    @GetOrgFromRequest() org: Organization,
    @Body() body: { content: string; workspaceId?: string }
  ) {
    return {
      resolvedContent: await this._dynamicVariablesService.resolveVariables(
        body.content,
        org.id,
        body.workspaceId
      ),
    };
  }
}

