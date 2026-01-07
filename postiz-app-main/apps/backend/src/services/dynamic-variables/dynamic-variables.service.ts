import { Injectable } from '@nestjs/common';
import { PrismaService } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
import { CreateDynamicVariableDto, VariableType } from '@gitroom/nestjs-libraries/dtos/dynamic-variables/create.dynamic-variable.dto';

@Injectable()
export class DynamicVariablesService {
  constructor(private _prisma: PrismaService) {}

  async createDynamicVariable(
    organizationId: string,
    data: CreateDynamicVariableDto
  ) {
    return this._prisma.dynamicVariable.create({
      data: {
        name: data.name,
        organizationId,
        workspaceId: data.workspaceId || null,
        value: data.value,
        isSystem: data.isSystem ?? false,
        type: data.type,
      },
    });
  }

  async getDynamicVariables(organizationId: string, workspaceId?: string) {
    return this._prisma.dynamicVariable.findMany({
      where: {
        organizationId,
        workspaceId: workspaceId || null,
        deletedAt: null,
      },
      orderBy: [
        {
          isSystem: 'desc',
        },
        {
          name: 'asc',
        },
      ],
    });
  }

  async getDynamicVariable(organizationId: string, variableId: string) {
    return this._prisma.dynamicVariable.findFirst({
      where: {
        id: variableId,
        organizationId,
        deletedAt: null,
      },
    });
  }

  async updateDynamicVariable(
    organizationId: string,
    variableId: string,
    data: Partial<CreateDynamicVariableDto>
  ) {
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (data.name) updateData.name = data.name;
    if (data.value !== undefined) updateData.value = data.value;
    if (data.type) updateData.type = data.type;

    return this._prisma.dynamicVariable.update({
      where: {
        id: variableId,
        organizationId,
      },
      data: updateData,
    });
  }

  async deleteDynamicVariable(organizationId: string, variableId: string) {
    return this._prisma.dynamicVariable.update({
      where: {
        id: variableId,
        organizationId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async getSystemVariables() {
    return [
      {
        name: '{date}',
        type: VariableType.DATE,
        isSystem: true,
        description: 'Date actuelle',
      },
      {
        name: '{time}',
        type: VariableType.TIME,
        isSystem: true,
        description: 'Heure actuelle',
      },
      {
        name: '{username}',
        type: VariableType.USERNAME,
        isSystem: true,
        description: "Nom d'utilisateur",
      },
    ];
  }

  async resolveVariables(
    content: string,
    organizationId: string,
    workspaceId?: string
  ): Promise<string> {
    // Récupérer toutes les variables disponibles
    const variables = await this.getDynamicVariables(organizationId, workspaceId);
    const systemVars = await this.getSystemVariables();

    let resolvedContent = content;

    // Remplacer les variables système
    for (const sysVar of systemVars) {
      const regex = new RegExp(`\\{${sysVar.name.replace(/[{}]/g, '')}\\}`, 'g');
      switch (sysVar.type) {
        case VariableType.DATE:
          resolvedContent = resolvedContent.replace(
            regex,
            new Date().toLocaleDateString('fr-FR')
          );
          break;
        case VariableType.TIME:
          resolvedContent = resolvedContent.replace(
            regex,
            new Date().toLocaleTimeString('fr-FR')
          );
          break;
        case VariableType.USERNAME:
          // À implémenter selon votre logique
          resolvedContent = resolvedContent.replace(regex, '');
          break;
      }
    }

    // Remplacer les variables personnalisées
    for (const variable of variables) {
      if (variable.value) {
        const regex = new RegExp(
          `\\{${variable.name.replace(/[{}]/g, '')}\\}`,
          'g'
        );
        resolvedContent = resolvedContent.replace(regex, variable.value);
      }
    }

    return resolvedContent;
  }
}

