import { Injectable } from '@nestjs/common';
import { PrismaService } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
import { CreateHashtagGroupDto } from '@gitroom/nestjs-libraries/dtos/hashtag-groups/create.hashtag-group.dto';

@Injectable()
export class HashtagGroupsService {
  constructor(private _prisma: PrismaService) {}

  async createHashtagGroup(organizationId: string, data: CreateHashtagGroupDto) {
    return this._prisma.hashtagGroup.create({
      data: {
        name: data.name,
        organizationId,
        workspaceId: data.workspaceId || null,
        hashtags: data.hashtags,
      },
    });
  }

  async getHashtagGroups(organizationId: string, workspaceId?: string) {
    return this._prisma.hashtagGroup.findMany({
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

  async getHashtagGroup(organizationId: string, groupId: string) {
    return this._prisma.hashtagGroup.findFirst({
      where: {
        id: groupId,
        organizationId,
        deletedAt: null,
      },
    });
  }

  async updateHashtagGroup(
    organizationId: string,
    groupId: string,
    data: Partial<CreateHashtagGroupDto>
  ) {
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (data.name) updateData.name = data.name;
    if (data.hashtags) updateData.hashtags = data.hashtags;

    return this._prisma.hashtagGroup.update({
      where: {
        id: groupId,
        organizationId,
      },
      data: updateData,
    });
  }

  async deleteHashtagGroup(organizationId: string, groupId: string) {
    return this._prisma.hashtagGroup.update({
      where: {
        id: groupId,
        organizationId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}

