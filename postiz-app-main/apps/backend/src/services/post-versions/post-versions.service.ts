import { Injectable } from '@nestjs/common';
import { PrismaService } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
import { CreatePostVersionDto } from '@gitroom/nestjs-libraries/dtos/post-versions/create.post.version.dto';
import { UpdatePostVersionDto } from '@gitroom/nestjs-libraries/dtos/post-versions/update.post.version.dto';

@Injectable()
export class PostVersionsService {
  constructor(private _prisma: PrismaService) {}

  async createPostVersion(organizationId: string, data: CreatePostVersionDto) {
    // Vérifier que le post appartient à l'organisation
    const post = await this._prisma.post.findFirst({
      where: {
        id: data.postId,
        organizationId,
      },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    const content = Array.isArray(data.content) ? data.content : [data.content];

    return this._prisma.postVersion.create({
      data: {
        postId: data.postId,
        accountId: data.accountId || null,
        isOriginal: data.isOriginal || false,
        content: content as any,
        options: data.options || {},
      },
    });
  }

  async getPostVersions(organizationId: string, postId: string) {
    // Vérifier que le post appartient à l'organisation
    const post = await this._prisma.post.findFirst({
      where: {
        id: postId,
        organizationId,
      },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    return this._prisma.postVersion.findMany({
      where: {
        postId,
      },
      orderBy: {
        isOriginal: 'desc',
      },
    });
  }

  async getPostVersion(organizationId: string, versionId: string) {
    const version = await this._prisma.postVersion.findFirst({
      where: {
        id: versionId,
        post: {
          organizationId,
        },
      },
      include: {
        post: true,
      },
    });

    if (!version) {
      throw new Error('Post version not found');
    }

    return version;
  }

  async updatePostVersion(
    organizationId: string,
    versionId: string,
    data: UpdatePostVersionDto
  ) {
    // Vérifier que la version appartient à l'organisation
    const version = await this.getPostVersion(organizationId, versionId);

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (data.content) {
      const content = Array.isArray(data.content) ? data.content : [data.content];
      updateData.content = content;
    }
    if (data.options) {
      updateData.options = data.options;
    }

    return this._prisma.postVersion.update({
      where: {
        id: versionId,
      },
      data: updateData,
    });
  }

  async deletePostVersion(organizationId: string, versionId: string) {
    // Vérifier que la version appartient à l'organisation
    await this.getPostVersion(organizationId, versionId);

    return this._prisma.postVersion.delete({
      where: {
        id: versionId,
      },
    });
  }
}

