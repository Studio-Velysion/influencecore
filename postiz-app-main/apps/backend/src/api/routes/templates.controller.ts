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
import { TemplatesService } from '@gitroom/backend/services/templates/templates.service';
import { GetOrgFromRequest } from '@gitroom/nestjs-libraries/user/org.from.request';
import { Organization } from '@prisma/client';
import { CreateTemplateDto } from '@gitroom/nestjs-libraries/dtos/templates/create.template.dto';
import { UpdateTemplateDto } from '@gitroom/nestjs-libraries/dtos/templates/update.template.dto';
import { ApiTags } from '@nestjs/swagger';
import { CheckPolicies } from '@gitroom/backend/services/auth/permissions/permissions.ability';
import { AuthorizationActions, Sections } from '@gitroom/backend/services/auth/permissions/permission.exception.class';

@ApiTags('Templates')
@Controller('/templates')
export class TemplatesController {
  constructor(private _templatesService: TemplatesService) {}

  @Post('/')
  @CheckPolicies([AuthorizationActions.Create, Sections.Templates])
  async createTemplate(
    @GetOrgFromRequest() org: Organization,
    @Body() body: CreateTemplateDto
  ) {
    return this._templatesService.createTemplate(org.id, body);
  }

  @Get('/')
  @CheckPolicies([AuthorizationActions.Read, Sections.Templates])
  async getTemplates(
    @GetOrgFromRequest() org: Organization,
    @Query('workspaceId') workspaceId?: string
  ) {
    return {
      templates: await this._templatesService.getTemplates(org.id, workspaceId),
    };
  }

  @Get('/:id')
  @CheckPolicies([AuthorizationActions.Read, Sections.Templates])
  async getTemplate(
    @GetOrgFromRequest() org: Organization,
    @Param('id') id: string
  ) {
    return this._templatesService.getTemplate(org.id, id);
  }

  @Put('/:id')
  @CheckPolicies([AuthorizationActions.Update, Sections.Templates])
  async updateTemplate(
    @GetOrgFromRequest() org: Organization,
    @Param('id') id: string,
    @Body() body: UpdateTemplateDto
  ) {
    return this._templatesService.updateTemplate(org.id, id, body);
  }

  @Delete('/:id')
  @CheckPolicies([AuthorizationActions.Delete, Sections.Templates])
  async deleteTemplate(
    @GetOrgFromRequest() org: Organization,
    @Param('id') id: string
  ) {
    return this._templatesService.deleteTemplate(org.id, id);
  }
}

