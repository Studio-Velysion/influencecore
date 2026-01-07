import { Injectable } from '@nestjs/common';
import { PrismaService } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
import { CreateQueueDto } from '@gitroom/nestjs-libraries/dtos/queues/create.queue.dto';
import { UpdateQueueDto } from '@gitroom/nestjs-libraries/dtos/queues/update.queue.dto';

@Injectable()
export class QueuesService {
  constructor(private _prisma: PrismaService) {}

  async createQueue(organizationId: string, data: CreateQueueDto) {
    return this._prisma.postQueue.create({
      data: {
        name: data.name,
        organizationId,
        workspaceId: data.workspaceId || null,
        schedule: data.schedule as any,
        isActive: data.isActive ?? true,
      },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });
  }

  async getQueues(organizationId: string, workspaceId?: string) {
    return this._prisma.postQueue.findMany({
      where: {
        organizationId,
        workspaceId: workspaceId || null,
      },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getQueue(organizationId: string, queueId: string) {
    return this._prisma.postQueue.findFirst({
      where: {
        id: queueId,
        organizationId,
      },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
        posts: {
          take: 10,
          orderBy: {
            scheduledAt: 'asc',
          },
        },
      },
    });
  }

  async updateQueue(
    organizationId: string,
    queueId: string,
    data: UpdateQueueDto
  ) {
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (data.name) updateData.name = data.name;
    if (data.schedule) updateData.schedule = data.schedule as any;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    return this._prisma.postQueue.update({
      where: {
        id: queueId,
        organizationId,
      },
      data: updateData,
    });
  }

  async deleteQueue(organizationId: string, queueId: string) {
    // D'abord, retirer les posts de la queue
    await this._prisma.post.updateMany({
      where: {
        queueId,
      },
      data: {
        queueId: null,
      },
    });

    return this._prisma.postQueue.delete({
      where: {
        id: queueId,
        organizationId,
      },
    });
  }

  async assignPostToQueue(
    organizationId: string,
    postId: string,
    queueId: string | null
  ) {
    // Vérifier que le post et la queue appartiennent à l'organisation
    const post = await this._prisma.post.findFirst({
      where: {
        id: postId,
        organizationId,
      },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    if (queueId) {
      const queue = await this._prisma.postQueue.findFirst({
        where: {
          id: queueId,
          organizationId,
        },
      });

      if (!queue) {
        throw new Error('Queue not found');
      }
    }

    return this._prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        queueId,
      },
    });
  }
}

