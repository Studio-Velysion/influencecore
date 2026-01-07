import { Injectable } from '@nestjs/common';
import { PrismaService } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
import { CreateWorkspaceDto } from '@gitroom/nestjs-libraries/dtos/workspaces/create.workspace.dto';
import { UpdateWorkspaceDto } from '@gitroom/nestjs-libraries/dtos/workspaces/update.workspace.dto';

@Injectable()
export class WorkspacesService {
  constructor(private _prisma: PrismaService) {}

  async createWorkspace(organizationId: string, data: CreateWorkspaceDto) {
    return this._prisma.workspace.create({
      data: {
        name: data.name,
        description: data.description,
        organizationId,
      },
      include: {
        _count: {
          select: {
            posts: true,
            integrations: true,
            media: true,
          },
        },
      },
    });
  }

  async getWorkspaces(organizationId: string) {
    return this._prisma.workspace.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      include: {
        _count: {
          select: {
            posts: true,
            integrations: true,
            media: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getWorkspace(organizationId: string, workspaceId: string) {
    return this._prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        organizationId,
        deletedAt: null,
      },
      include: {
        _count: {
          select: {
            posts: true,
            integrations: true,
            media: true,
          },
        },
      },
    });
  }

  async updateWorkspace(
    organizationId: string,
    workspaceId: string,
    data: UpdateWorkspaceDto
  ) {
    return this._prisma.workspace.update({
      where: {
        id: workspaceId,
        organizationId,
      },
      data: {
        name: data.name,
        description: data.description,
        updatedAt: new Date(),
      },
    });
  }

  async deleteWorkspace(organizationId: string, workspaceId: string) {
    return this._prisma.workspace.update({
      where: {
        id: workspaceId,
        organizationId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}

