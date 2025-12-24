import { Injectable } from '@nestjs/common';
import { PrismaService } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
import { CreateTemplateDto } from '@gitroom/nestjs-libraries/dtos/templates/create.template.dto';
import { UpdateTemplateDto } from '@gitroom/nestjs-libraries/dtos/templates/update.template.dto';

@Injectable()
export class TemplatesService {
  constructor(private _prisma: PrismaService) {}

  async createTemplate(organizationId: string, data: CreateTemplateDto) {
    const content = Array.isArray(data.content) ? data.content : [data.content];
    
    return this._prisma.postTemplate.create({
      data: {
        name: data.name,
        description: data.description,
        organizationId,
        workspaceId: data.workspaceId || null,
        content: content as any,
      },
    });
  }

  async getTemplates(organizationId: string, workspaceId?: string) {
    return this._prisma.postTemplate.findMany({
      where: {
        organizationId,
        workspaceId: workspaceId || null,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getTemplate(organizationId: string, templateId: string) {
    return this._prisma.postTemplate.findFirst({
      where: {
        id: templateId,
        organizationId,
        deletedAt: null,
      },
    });
  }

  async updateTemplate(
    organizationId: string,
    templateId: string,
    data: UpdateTemplateDto
  ) {
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (data.name) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.content) {
      const content = Array.isArray(data.content) ? data.content : [data.content];
      updateData.content = content;
    }

    return this._prisma.postTemplate.update({
      where: {
        id: templateId,
        organizationId,
      },
      data: updateData,
    });
  }

  async deleteTemplate(organizationId: string, templateId: string) {
    return this._prisma.postTemplate.update({
      where: {
        id: templateId,
        organizationId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}

