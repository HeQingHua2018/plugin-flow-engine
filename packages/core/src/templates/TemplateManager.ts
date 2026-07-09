/*
 * @File: TemplateManager.ts
 * @desc: 流程模板抽象层，支持模板定义、参数化、实例化和版本控制
 * @author: heqinghua
 * @date: 2026 年 04 月 16 日
 */

import type { FlowData } from '@chloehe/logic-engine-common';
import { FlowExecutionError, FlowErrorCode } from '@chloehe/logic-engine-common';

/**
 * 模板参数类型
 */
export type TemplateParamType = 'string' | 'number' | 'boolean' | 'select' | 'text';

/**
 * 模板参数定义
 */
export interface TemplateParameter {
  /**
   * 参数名称（用于占位符引用，如 {{paramName}}）
   */
  name: string;

  /**
   * 参数显示名称
   */
  label: string;

  /**
   * 参数类型
   */
  type: TemplateParamType;

  /**
   * 参数描述
   */
  description?: string;

  /**
   * 是否必填
   */
  required: boolean;

  /**
   * 默认值
   */
  default?: string | number | boolean;

  /**
   * 可选值（仅当 type 为 select 时有效）
   */
  options?: { label: string; value: string | number }[];

  /**
   * 验证规则
   */
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
}

/**
 * 模板版本信息
 */
export interface TemplateVersion {
  /**
   * 版本号
   */
  version: string;

  /**
   * 模板数据
   */
  template: TemplateDefinition;

  /**
   * 创建时间
   */
  createdAt: Date;

  /**
   * 创建者
   */
  createdBy?: string;

  /**
   * 版本描述
   */
  description?: string;
}

/**
 * 模板定义接口
 */
export interface TemplateDefinition {
  /**
   * 模板标识
   */
  id: string;

  /**
   * 模板名称
   */
  name: string;

  /**
   * 模板描述
   */
  description?: string;

  /**
   * 模板分类
   */
  category?: string;

  /**
   * 模板标签
   */
  tags?: string[];

  /**
   * 模板参数定义
   */
  parameters: TemplateParameter[];

  /**
   * 模板流程数据（包含占位符）
   */
  flowTemplate: FlowData;

  /**
   * 模板图标
   */
  icon?: string;

  /**
   * 模板缩略图
   */
  thumbnail?: string;

  /**
   * 创建时间
   */
  createdAt?: Date;

  /**
   * 更新时间
   */
  updatedAt?: Date;

  /**
   * 创建者
   */
  createdBy?: string;

  /**
   * 是否启用
   */
  enabled: boolean;

  /**
   * 元数据
   */
  metadata?: Record<string, any>;
}

/**
 * 模板实例化结果
 */
export interface TemplateInstance {
  /**
   * 实例化的流程数据
   */
  flowData: FlowData;

  /**
   * 使用的参数
   */
  usedParameters: Record<string, any>;

  /**
   * 模板 ID
   */
  templateId: string;

  /**
   * 模板版本
   */
  templateVersion: string;

  /**
   * 实例 ID（自动生成）
   */
  instanceId: string;

  /**
   * 实例化时间
   */
  instantiatedAt: Date;
}

/**
 * 模板库状态
 */
export enum TemplateLibraryStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DEPRECATED = 'deprecated',
}

/**
 * 模板库条目
 */
export interface TemplateLibraryEntry {
  /**
   * 模板定义
   */
  template: TemplateDefinition;

  /**
   * 库状态
   */
  status: TemplateLibraryStatus;

  /**
   * 使用次数
   */
  usageCount: number;

  /**
   * 最后使用时间
   */
  lastUsedAt?: Date;

  /**
   * 添加时间
   */
  addedAt: Date;

  /**
   * 添加者
   */
  addedBy?: string;
}

/**
 * 模板预览数据
 */
export interface TemplatePreview {
  /** 模板基本信息 */
  metadata: Pick<TemplateDefinition, 'id' | 'name' | 'description' | 'category' | 'tags' | 'icon' | 'thumbnail'>;
  /** 节点统计信息 */
  nodeStats: {
    /** 总节点数 */
    total: number;
    /** 各类型节点数量 */
    byType: Record<string, number>;
  };
  /** 边统计信息 */
  edgeStats: {
    /** 总边数 */
    total: number;
  };
  /** 上下文变量统计 */
  contextStats: {
    /** 变量数量 */
    total: number;
    /** 变量名称列表 */
    variableNames: string[];
  };
  /** 参数预览 */
  parameterPreview: Array<{
    name: string;
    label: string;
    type: TemplateParamType;
    default?: any;
  }>;
  /** 预览生成时间 */
  generatedAt: Date;
}

/**
 * 模板导出格式
 */
export interface TemplateExportFormat {
  /** 导出版本 */
  version: string;
  /** 导出时间 */
  exportedAt: string;
  /** 导出者 */
  exportedBy?: string;
  /** 模板定义 */
  template: TemplateDefinition;
  /** 可选：模板版本历史 */
  versions?: TemplateVersion[];
  /** 可选：元数据 */
  metadata?: {
    /** 导出说明 */
    description?: string;
    /** 自定义标签 */
    customTags?: string[];
    /** 源系统 */
    sourceSystem?: string;
  };
}

/**
 * 模板导入格式
 */
export interface TemplateImportFormat {
  /** 导入版本 */
  version: string;
  /** 模板定义 */
  template: TemplateDefinition;
  /** 可选：版本历史 */
  versions?: TemplateVersion[];
  /** 可选：元数据 */
  metadata?: {
    /** 导入说明 */
    description?: string;
    /** 来源信息 */
    source?: string;
  };
}

/**
 * 模板导入选项
 */
export interface TemplateImportOptions {
  /** 是否覆盖已存在的模板 */
  overwrite?: boolean;
  /** 是否添加到库中 */
  addToLibrary?: boolean;
  /** 导入者 */
  importedBy?: string;
  /** 自定义库状态 */
  libraryStatus?: TemplateLibraryStatus;
}

/**
 * 模板导入结果
 */
export interface TemplateImportResult {
  /** 是否成功 */
  success: boolean;
  /** 模板 ID */
  templateId: string;
  /** 导入的模板定义 */
  template: TemplateDefinition;
  /** 导入时间 */
  importedAt: Date;
  /** 警告信息 */
  warnings: string[];
  /** 错误信息（如果失败） */
  error?: string;
  /** 是否覆盖了现有模板 */
  wasOverwrite: boolean;
}

/**
 * 分类统计信息
 */
export interface CategoryStats {
  /** 分类名称 */
  category: string;
  /** 模板数量 */
  count: number;
  /** 总使用次数 */
  totalUsage: number;
  /** 分类描述 */
  description?: string;
}

/**
 * 标签统计信息
 */
export interface TagStats {
  /** 标签名称 */
  tag: string;
  /** 使用该标签的模板数量 */
  count: number;
  /** 所有使用该标签的模板 ID 列表 */
  templateIds: string[];
}

/**
 * 高级搜索条件
 */
export interface AdvancedTemplateSearchCriteria extends TemplateSearchCriteria {
  /** 节点类型过滤 */
  nodeTypes?: string[];
  /** 最小节点数 */
  minNodes?: number;
  /** 最大节点数 */
  maxNodes?: number;
  /** 创建者过滤 */
  createdBy?: string;
  /** 创建时间范围 */
  dateRange?: {
    start: Date;
    end: Date;
  };
  /** 使用次数范围 */
  usageRange?: {
    min?: number;
    max?: number;
  };
  /** 是否包含已禁用模板 */
  includeDisabled?: boolean;
  /** 模糊匹配关键词 */
  fuzzySearch?: boolean;
}

/**
 * 高级搜索结果
 */
export interface AdvancedTemplateSearchResult extends TemplateSearchResult {
  /** 分类统计 */
  categoryStats?: CategoryStats[];
  /** 标签统计 */
  tagStats?: TagStats[];
  /** 搜索耗时（毫秒） */
  searchDuration?: number;
}

/**
 * 模板搜索条件
 */
export interface TemplateSearchCriteria {
  /**
   * 关键词搜索
   */
  keyword?: string;

  /**
   * 分类过滤
   */
  category?: string;

  /**
   * 标签过滤
   */
  tags?: string[];

  /**
   * 状态过滤
   */
  status?: TemplateLibraryStatus;

  /**
   * 是否只返回启用的模板
   */
  enabledOnly?: boolean;

  /**
   * 排序字段
   */
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'usageCount';

  /**
   * 排序方向
   */
  sortOrder?: 'asc' | 'desc';

  /**
   * 分页页码
   */
  page?: number;

  /**
   * 每页数量
   */
  pageSize?: number;
}

/**
 * 高级搜索条件
 */
export interface AdvancedTemplateSearchCriteria extends TemplateSearchCriteria {
  /** 节点类型过滤 */
  nodeTypes?: string[];
  /** 最小节点数 */
  minNodes?: number;
  /** 最大节点数 */
  maxNodes?: number;
  /** 创建者过滤 */
  createdBy?: string;
  /** 创建时间范围 */
  dateRange?: {
    start: Date;
    end: Date;
  };
  /** 使用次数范围 */
  usageRange?: {
    min?: number;
    max?: number;
  };
  /** 是否包含已禁用模板 */
  includeDisabled?: boolean;
  /** 模糊匹配关键词 */
  fuzzySearch?: boolean;
}

/**
 * 模板搜索结果
 */
export interface TemplateSearchResult {
  /**
   * 模板条目列表
   */
  items: TemplateLibraryEntry[];

  /**
   * 总数量
   */
  total: number;

  /**
   * 当前页码
   */
  page: number;

  /**
   * 每页数量
   */
  pageSize: number;

  /**
   * 总页数
   */
  totalPages: number;
}

/**
 * 高级搜索结果
 */
export interface AdvancedTemplateSearchResult extends TemplateSearchResult {
  /** 分类统计 */
  categoryStats?: CategoryStats[];
  /** 标签统计 */
  tagStats?: TagStats[];
  /** 搜索耗时（毫秒） */
  searchDuration?: number;
}

/**
 * 模板版本管理配置
 */
export interface TemplateVersionConfig {
  /**
   * 最大保留版本数
   */
  maxVersions: number;

  /**
   * 是否自动创建版本
   */
  autoCreateVersion: boolean;

  /**
   * 是否允许覆盖旧版本
   */
  allowOverwrite: boolean;
}

/**
 * 默认版本配置
 */
const DEFAULT_VERSION_CONFIG: TemplateVersionConfig = {
  maxVersions: 20,
  autoCreateVersion: true,
  allowOverwrite: false,
};

/**
 * 模板管理器
 * 提供模板的定义、实例化、版本控制和库管理功能
 */
export class TemplateManager {
  private templates: Map<string, TemplateDefinition> = new Map();
  private templateVersions: Map<string, TemplateVersion[]> = new Map();
  private library: Map<string, TemplateLibraryEntry> = new Map();
  private versionConfig: TemplateVersionConfig = { ...DEFAULT_VERSION_CONFIG };

  /**
   * 构造函数
   * @param config 版本配置
   */
  constructor(config?: Partial<TemplateVersionConfig>) {
    this.versionConfig = { ...this.versionConfig, ...config };
  }

  // ==================== 模板定义 ====================

  /**
   * 定义新模板
   * @param template 模板定义
   * @returns 定义的模板
   */
  defineTemplate(template: Omit<TemplateDefinition, 'createdAt' | 'updatedAt'>): TemplateDefinition {
    const { id } = template;

    if (this.templates.has(id)) {
      throw FlowExecutionError.flowDefinitionInvalid(`模板 ${id} 已存在`);
    }

    // 验证模板参数
    this.validateParameters(template.parameters);

    const now = new Date();
    const definedTemplate: TemplateDefinition = {
      ...template,
      createdAt: now,
      updatedAt: now,
    };

    this.templates.set(id, definedTemplate);

    // 添加到库中
    this.addTemplateToLibrary(definedTemplate);

    // 创建初始版本
    if (this.versionConfig.autoCreateVersion) {
      this.createTemplateVersion(id, {
        description: '初始版本',
      });
    }

    return definedTemplate;
  }

  /**
   * 验证模板参数
   */
  private validateParameters(parameters: TemplateParameter[]): void {
    const paramNames = new Set<string>();

    for (const param of parameters) {
      // 检查参数名是否重复
      if (paramNames.has(param.name)) {
        throw FlowExecutionError.flowDefinitionInvalid(`重复的参数名：${param.name}`);
      }
      paramNames.add(param.name);

      // 检查必填参数
      if (param.required && param.default === undefined) {
        throw FlowExecutionError.flowDefinitionInvalid(`必填参数 ${param.name} 缺少默认值`);
      }

      // 检查 select 类型必须有选项
      if (param.type === 'select' && (!param.options || param.options.length === 0)) {
        throw FlowExecutionError.flowDefinitionInvalid(`参数 ${param.name} 是 select 类型但缺少选项`);
      }
    }
  }

  /**
   * 添加到模板库（内部方法）
   */
  private addTemplateToLibrary(template: TemplateDefinition): void {
    this.library.set(template.id, {
      template,
      status: TemplateLibraryStatus.ACTIVE,
      usageCount: 0,
      addedAt: new Date(),
      addedBy: template.createdBy,
    });
  }

  /**
   * 更新模板
   * @param id 模板 ID
   * @param updates 更新内容
   * @param createVersion 是否创建新版本
   * @returns 更新后的模板
   */
  updateTemplate(
    id: string,
    updates: Partial<Omit<TemplateDefinition, 'id' | 'createdAt'>>,
    createVersion = true
  ): TemplateDefinition {
    const template = this.getTemplate(id);
    if (!template) {
      throw FlowExecutionError.flowDefinitionInvalid(`模板 ${id} 不存在`);
    }

    // 如果更新参数，验证新参数
    if (updates.parameters) {
      this.validateParameters(updates.parameters);
    }

    const updatedTemplate: TemplateDefinition = {
      ...template,
      ...updates,
      updatedAt: new Date(),
    };

    this.templates.set(id, updatedTemplate);

    // 更新库条目
    const entry = this.library.get(id);
    if (entry) {
      entry.template = updatedTemplate;
      entry.status = updates.enabled === false ? TemplateLibraryStatus.ARCHIVED : TemplateLibraryStatus.ACTIVE;
    }

    // 创建新版本
    if (createVersion && this.versionConfig.autoCreateVersion) {
      this.createTemplateVersion(id, {
        description: updates.description,
      });
    }

    return updatedTemplate;
  }

  /**
   * 删除模板
   * @param id 模板 ID
   * @param hardDelete 是否彻底删除（包括所有版本）
   * @returns 是否成功
   */
  deleteTemplate(id: string, hardDelete = false): boolean {
    const template = this.templates.get(id);
    if (!template) {
      return false;
    }

    this.templates.delete(id);
    this.library.delete(id);

    if (hardDelete) {
      this.templateVersions.delete(id);
    }

    return true;
  }

  /**
   * 获取模板
   * @param id 模板 ID
   * @returns 模板定义
   */
  getTemplate(id: string): TemplateDefinition | undefined {
    return this.templates.get(id);
  }

  /**
   * 获取所有模板
   * @returns 模板列表
   */
  getAllTemplates(): TemplateDefinition[] {
    return Array.from(this.templates.values());
  }

  /**
   * 获取启用的模板
   * @returns 启用的模板列表
   */
  getEnabledTemplates(): TemplateDefinition[] {
    return this.getAllTemplates().filter(t => t.enabled);
  }

  /**
   * 按分类获取模板
   * @param category 分类
   * @returns 模板列表
   */
  getTemplatesByCategory(category: string): TemplateDefinition[] {
    return this.getAllTemplates().filter(t => t.category === category);
  }

  /**
   * 按标签获取模板
   * @param tag 标签
   * @returns 模板列表
   */
  getTemplatesByTag(tag: string): TemplateDefinition[] {
    return this.getAllTemplates().filter(t => t.tags?.includes(tag));
  }

  // ==================== 模板预览功能 ====================

  /**
   * 生成模板预览
   * @param templateId 模板 ID
   * @returns 模板预览数据
   */
  generateTemplatePreview(templateId: string): TemplatePreview {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw FlowExecutionError.flowDefinitionInvalid(`模板 ${templateId} 不存在`);
    }

    const flowTemplate = template.flowTemplate;

    // 统计节点类型
    const nodeTypeStats = new Map<string, number>();
    for (const node of flowTemplate.nodes) {
      const nodeType = node.data?.pluginNodeType?.toString() || 'unknown';
      nodeTypeStats.set(nodeType, (nodeTypeStats.get(nodeType) || 0) + 1);
    }

    // 提取参数预览
    const parameterPreview = template.parameters.map(param => ({
      name: param.name,
      label: param.label,
      type: param.type,
      default: param.default,
    }));

    return {
      metadata: {
        id: template.id,
        name: template.name,
        description: template.description,
        category: template.category,
        tags: template.tags,
        icon: template.icon,
        thumbnail: template.thumbnail,
      },
      nodeStats: {
        total: flowTemplate.nodes.length,
        byType: Object.fromEntries(nodeTypeStats),
      },
      edgeStats: {
        total: flowTemplate.edges.length,
      },
      contextStats: {
        total: Object.keys(flowTemplate.context.variables).length,
        variableNames: Object.keys(flowTemplate.context.variables),
      },
      parameterPreview,
      generatedAt: new Date(),
    };
  }

  /**
   * 批量生成模板预览
   * @param templateIds 模板 ID 列表
   * @returns 模板预览列表
   */
  generateMultipleTemplatePreviews(templateIds: string[]): TemplatePreview[] {
    return templateIds.map(id => this.generateTemplatePreview(id));
  }

  /**
   * 获取模板预览（简化版，只返回关键信息）
   * @param templateId 模板 ID
   * @returns 简化的模板预览
   */
  getTemplatePreviewSummary(templateId: string): {
    id: string;
    name: string;
    description?: string;
    nodeCount: number;
    edgeCount: number;
    parameterCount: number;
  } {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw FlowExecutionError.flowDefinitionInvalid(`模板 ${templateId} 不存在`);
    }

    const flowTemplate = template.flowTemplate;

    return {
      id: template.id,
      name: template.name,
      description: template.description,
      nodeCount: flowTemplate.nodes.length,
      edgeCount: flowTemplate.edges.length,
      parameterCount: template.parameters.length,
    };
  }

  // ==================== 模板导入/导出功能 ====================

  /**
   * 导出模板为指定格式
   * @param templateId 模板 ID
   * @param options 导出选项
   * @returns 导出的模板数据
   */
  exportTemplate(
    templateId: string,
    options: { includeVersions?: boolean; exportedBy?: string } = {}
  ): TemplateExportFormat {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw FlowExecutionError.flowDefinitionInvalid(`模板 ${templateId} 不存在`);
    }

    const { includeVersions = false, exportedBy } = options;

    const exportFormat: TemplateExportFormat = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      exportedBy,
      template: { ...template },
    };

    // 可选：包含版本历史
    if (includeVersions) {
      const versions = this.getTemplateVersions(templateId);
      if (versions.length > 0) {
        exportFormat.versions = versions;
      }
    }

    return exportFormat;
  }

  /**
   * 批量导出模板
   * @param templateIds 模板 ID 列表
   * @param options 导出选项
   * @returns 导出的模板数据列表
   */
  exportMultipleTemplates(
    templateIds: string[],
    options: { includeVersions?: boolean; exportedBy?: string } = {}
  ): TemplateExportFormat[] {
    return templateIds.map(id => this.exportTemplate(id, options));
  }

  /**
   * 将模板导出为 JSON 字符串
   * @param templateId 模板 ID
   * @param options 导出选项
   * @returns JSON 字符串
   */
  exportTemplateToJson(
    templateId: string,
    options: { includeVersions?: boolean; exportedBy?: string; pretty?: boolean } = {}
  ): string {
    const exportData = this.exportTemplate(templateId, options);
    const { pretty = false } = options;
    return pretty ? JSON.stringify(exportData, null, 2) : JSON.stringify(exportData);
  }

  /**
   * 导入模板
   * @param importData 导入数据
   * @param options 导入选项
   * @returns 导入结果
   */
  importTemplate(
    importData: TemplateImportFormat,
    options: TemplateImportOptions = {}
  ): TemplateImportResult {
    const {
      overwrite = false,
      addToLibrary = true,
      importedBy,
      libraryStatus = TemplateLibraryStatus.ACTIVE,
    } = options;

    const warnings: string[] = [];
    const template = importData.template;

    // 检查模板 ID 是否已存在
    const existingTemplate = this.getTemplate(template.id);
    let wasOverwrite = false;

    if (existingTemplate && !overwrite) {
      return {
        success: false,
        templateId: template.id,
        template: existingTemplate,
        importedAt: new Date(),
        warnings,
        error: `模板 ${template.id} 已存在，请设置 overwrite: true 以覆盖`,
        wasOverwrite: false,
      };
    }

    if (existingTemplate && overwrite) {
      wasOverwrite = true;
      warnings.push(`模板 ${template.id} 已存在，已覆盖`);
    }

    // 验证导入的模板
    const validationWarnings = this.validateImportedTemplate(template);
    warnings.push(...validationWarnings);

    // 创建模板（排除 createdAt/updatedAt 后传参）
    const { createdAt: origCreatedAt, updatedAt: origUpdatedAt, ...templateRest } = template;
    const definedTemplate = this.defineTemplate({
      ...templateRest,
      enabled: templateRest.enabled ?? true,
    });
    definedTemplate.createdAt = origCreatedAt || new Date();
    definedTemplate.updatedAt = origUpdatedAt || new Date();

    // 设置库状态
    if (addToLibrary) {
      const entry = this.getLibraryEntry(template.id);
      if (entry) {
        entry.status = libraryStatus;
        if (importedBy) {
          entry.addedBy = importedBy;
        }
      }
    }

    // 导入版本历史
    if (importData.versions && importData.versions.length > 0) {
      for (const version of importData.versions) {
        try {
          this.createTemplateVersion(template.id, {
            description: version.description,
            createdBy: version.createdBy,
          });
        } catch (err) {
          warnings.push(`版本 ${version.version} 导入失败：${err instanceof Error ? err.message : String(err)}`);
        }
      }
    }

    return {
      success: true,
      templateId: template.id,
      template: definedTemplate,
      importedAt: new Date(),
      warnings,
      wasOverwrite,
    };
  }

  /**
   * 批量导入模板
   * @param importDataList 导入数据列表
   * @param options 导入选项
   * @returns 导入结果列表
   */
  importMultipleTemplates(
    importDataList: TemplateImportFormat[],
    options: TemplateImportOptions = {}
  ): TemplateImportResult[] {
    return importDataList.map(data => this.importTemplate(data, options));
  }

  /**
   * 从 JSON 字符串导入模板
   * @param jsonStr JSON 字符串
   * @param options 导入选项
   * @returns 导入结果
   */
  importTemplateFromJson(
    jsonStr: string,
    options: TemplateImportOptions = {}
  ): TemplateImportResult {
    let importData: TemplateImportFormat;
    try {
      importData = JSON.parse(jsonStr);
    } catch (err) {
      throw FlowExecutionError.flowDefinitionInvalid(`无效的 JSON 格式：${err instanceof Error ? err.message : String(err)}`);
    }
    return this.importTemplate(importData, options);
  }

  /**
   * 验证导入的模板
   * @param template 要验证的模板
   * @returns 警告信息列表
   */
  private validateImportedTemplate(template: TemplateDefinition): string[] {
    const warnings: string[] = [];

    // 检查必填字段
    if (!template.id) {
      warnings.push('模板缺少 ID 字段');
    }
    if (!template.name) {
      warnings.push(`模板 ${template.id} 缺少名称字段`);
    }
    if (!template.flowTemplate) {
      warnings.push(`模板 ${template.id} 缺少流程数据`);
    }
    if (!template.parameters || template.parameters.length === 0) {
      warnings.push(`模板 ${template.id} 缺少参数定义`);
    }

    // 验证参数
    if (template.parameters) {
      const paramNames = new Set<string>();
      for (const param of template.parameters) {
        if (paramNames.has(param.name)) {
          warnings.push(`模板 ${template.id} 包含重复的参数名：${param.name}`);
        }
        paramNames.add(param.name);
      }
    }

    return warnings;
  }

  /**
   * 导出模板库
   * @param templateIds 模板 ID 列表（可选，默认导出所有）
   * @param options 导出选项
   * @returns 导出的模板库数据
   */
  exportLibrary(
    templateIds?: string[],
    options: { includeVersions?: boolean; exportedBy?: string } = {}
  ): TemplateExportFormat[] {
    const ids = templateIds || Array.from(this.templates.keys());
    return this.exportMultipleTemplates(ids, options);
  }

  /**
   * 从 JSON 字符串导入模板库
   * @param jsonStr JSON 字符串
   * @param options 导入选项
   * @returns 导入结果列表
   */
  importLibraryFromJson(
    jsonStr: string,
    options: TemplateImportOptions = {}
  ): TemplateImportResult[] {
    let importDataList: TemplateExportFormat;
    try {
      importDataList = JSON.parse(jsonStr);
    } catch (err) {
      throw FlowExecutionError.flowDefinitionInvalid(`无效的 JSON 格式：${err instanceof Error ? err.message : String(err)}`);
    }

    // 检查是单个模板还是模板列表
    const dataArray = Array.isArray(importDataList) ? importDataList : [importDataList];

    return dataArray.map((item: any) => {
      const importData: TemplateImportFormat = {
        version: item.version,
        template: item.template,
        versions: item.versions,
      };
      return this.importTemplate(importData, options);
    });
  }

  // ==================== 模板分类和标签功能 ====================

  /**
   * 获取所有分类及统计信息
   * @returns 分类统计列表
   */
  getAllCategories(): CategoryStats[] {
    const categoryMap = new Map<string, { count: number; totalUsage: number }>();

    for (const entry of this.library.values()) {
      const category = entry.template.category;
      if (category) {
        const stats = categoryMap.get(category) || { count: 0, totalUsage: 0 };
        stats.count++;
        stats.totalUsage += entry.usageCount;
        categoryMap.set(category, stats);
      }
    }

    return Array.from(categoryMap.entries()).map(([category, stats]) => ({
      category,
      count: stats.count,
      totalUsage: stats.totalUsage,
    }));
  }

  /**
   * 获取所有标签及统计信息
   * @returns 标签统计列表
   */
  getAllTags(): TagStats[] {
    const tagMap = new Map<string, { count: number; templateIds: string[] }>();

    for (const entry of this.library.values()) {
      for (const tag of entry.template.tags || []) {
        const stats = tagMap.get(tag) || { count: 0, templateIds: [] };
        stats.count++;
        if (!stats.templateIds.includes(entry.template.id)) {
          stats.templateIds.push(entry.template.id);
        }
        tagMap.set(tag, stats);
      }
    }

    return Array.from(tagMap.entries()).map(([tag, stats]) => ({
      tag,
      count: stats.count,
      templateIds: stats.templateIds,
    }));
  }

  /**
   * 为模板添加标签
   * @param templateId 模板 ID
   * @param tags 标签列表
   * @returns 更新后的模板
   */
  addTagsToTemplate(templateId: string, tags: string[]): TemplateDefinition {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw FlowExecutionError.flowDefinitionInvalid(`模板 ${templateId} 不存在`);
    }

    const existingTags = new Set(template.tags || []);
    for (const tag of tags) {
      existingTags.add(tag);
    }

    return this.updateTemplate(templateId, {
      tags: Array.from(existingTags),
    });
  }

  /**
   * 从模板移除标签
   * @param templateId 模板 ID
   * @param tags 要移除的标签列表
   * @returns 更新后的模板
   */
  removeTagsFromTemplate(templateId: string, tags: string[]): TemplateDefinition {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw FlowExecutionError.flowDefinitionInvalid(`模板 ${templateId} 不存在`);
    }

    const existingTags = new Set(template.tags || []);
    for (const tag of tags) {
      existingTags.delete(tag);
    }

    return this.updateTemplate(templateId, {
      tags: Array.from(existingTags),
    });
  }

  /**
   * 获取分类下的所有模板
   * @param category 分类名称
   * @param includeStats 是否包含统计信息
   * @returns 模板列表及统计信息
   */
  getTemplatesByCategoryWithStats(category: string, includeStats = false): {
    templates: TemplateDefinition[];
    stats?: CategoryStats;
  } {
    const templates = this.getTemplatesByCategory(category);
    const result: { templates: TemplateDefinition[]; stats?: CategoryStats } = { templates };

    if (includeStats) {
      const stats = this.getAllCategories().find(c => c.category === category);
      if (stats) {
        result.stats = stats;
      }
    }

    return result;
  }

  /**
   * 获取标签下的所有模板
   * @param tag 标签名称
   * @returns 模板列表
   */
  getTemplatesByTagWithStats(tag: string): {
    templates: TemplateDefinition[];
    stats?: TagStats;
  } {
    const templates = this.getTemplatesByTag(tag);
    const stats = this.getAllTags().find(t => t.tag === tag);

    return {
      templates,
      stats,
    };
  }

  /**
   * 启用/禁用模板
   * @param id 模板 ID
   * @param enabled 是否启用
   * @returns 是否成功
   */
  toggleTemplateEnabled(id: string, enabled: boolean): boolean {
    const template = this.templates.get(id);
    if (!template) {
      return false;
    }

    template.enabled = enabled;
    template.updatedAt = new Date();

    const entry = this.library.get(id);
    if (entry) {
      entry.status = enabled ? TemplateLibraryStatus.ACTIVE : TemplateLibraryStatus.ARCHIVED;
    }

    return true;
  }

  // ==================== 模板实例化 ====================

  /**
   * 实例化模板
   * @param templateId 模板 ID
   * @param parameters 参数值
   * @param instanceId 实例 ID（可选，自动生成）
   * @returns 实例化结果
   */
  instantiateTemplate(
    templateId: string,
    parameters: Record<string, any>,
    instanceId?: string
  ): TemplateInstance {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw FlowExecutionError.flowDefinitionInvalid(`模板 ${templateId} 不存在`);
    }

    if (!template.enabled) {
      throw FlowExecutionError.flowDefinitionInvalid(`模板 ${templateId} 已被禁用`);
    }

    // 验证参数
    this.validateTemplateParameters(template.parameters, parameters);

    // 实例化流程数据
    const flowData = this.substituteParameters(template.flowTemplate, parameters);

    // 更新使用计数
    const entry = this.library.get(templateId);
    if (entry) {
      entry.usageCount++;
      entry.lastUsedAt = new Date();
    }

    return {
      flowData,
      usedParameters: parameters,
      templateId,
      templateVersion: 'latest',
      instanceId: instanceId || this.generateInstanceId(),
      instantiatedAt: new Date(),
    };
  }

  /**
   * 验证模板参数
   */
  private validateTemplateParameters(
    parameters: TemplateParameter[],
    values: Record<string, any>
  ): void {
    const paramMap = new Map(parameters.map(p => [p.name, p]));

    for (const param of parameters) {
      const value = values[param.name];

      // 检查必填参数
      if (param.required && (value === undefined || value === null || value === '')) {
        throw FlowExecutionError.flowDefinitionInvalid(`缺少必填参数：${param.label}`);
      }

      // 检查类型
      if (value !== undefined && value !== null) {
        this.validateParameterValue(param, value);
      } else if (param.default !== undefined) {
        values[param.name] = param.default;
      }
    }

    // 检查是否有多余参数
    for (const key of Object.keys(values)) {
      if (!paramMap.has(key)) {
        throw FlowExecutionError.flowDefinitionInvalid(`未知参数：${key}`);
      }
    }
  }

  /**
   * 验证参数值
   */
  private validateParameterValue(param: TemplateParameter, value: any): void {
    // 类型检查
    switch (param.type) {
      case 'string':
        if (typeof value !== 'string') {
          throw FlowExecutionError.flowDefinitionInvalid(`参数 ${param.name} 必须是字符串类型`);
        }
        break;
      case 'number':
        if (typeof value !== 'number') {
          throw FlowExecutionError.flowDefinitionInvalid(`参数 ${param.name} 必须是数字类型`);
        }
        break;
      case 'boolean':
        if (typeof value !== 'boolean') {
          throw FlowExecutionError.flowDefinitionInvalid(`参数 ${param.name} 必须是布尔类型`);
        }
        break;
      case 'select':
        if (param.options) {
          const validValues = param.options.map(o => o.value);
          if (!validValues.includes(value)) {
            throw FlowExecutionError.flowDefinitionInvalid(
              `参数 ${param.name} 的值必须在 ${validValues.join(', ')} 中`
            );
          }
        }
        break;
    }

    // 验证规则
    if (param.validation) {
      const { validation } = param;

      if (validation.minLength && typeof value === 'string' && value.length < validation.minLength) {
        throw FlowExecutionError.flowDefinitionInvalid(
          `参数 ${param.name} 长度不能少于 ${validation.minLength} 个字符`
        );
      }

      if (validation.maxLength && typeof value === 'string' && value.length > validation.maxLength) {
        throw FlowExecutionError.flowDefinitionInvalid(
          `参数 ${param.name} 长度不能超过 ${validation.maxLength} 个字符`
        );
      }

      if (validation.pattern && typeof value === 'string') {
        const regex = new RegExp(validation.pattern);
        if (!regex.test(value)) {
          throw FlowExecutionError.flowDefinitionInvalid(
            `参数 ${param.name} 格式不正确`
          );
        }
      }

      if (validation.min !== undefined && typeof value === 'number' && value < validation.min) {
        throw FlowExecutionError.flowDefinitionInvalid(
          `参数 ${param.name} 不能小于 ${validation.min}`
        );
      }

      if (validation.max !== undefined && typeof value === 'number' && value > validation.max) {
        throw FlowExecutionError.flowDefinitionInvalid(
          `参数 ${param.name} 不能大于 ${validation.max}`
        );
      }
    }
  }

  /**
   * 替换参数占位符
   * @param flowData 流程数据
   * @param parameters 参数值
   * @returns 替换后的流程数据
   */
  private substituteParameters(flowData: FlowData, parameters: Record<string, any>): FlowData {
    const paramMap = new Map(Object.entries(parameters));

    // 深度复制流程数据
    const result: FlowData = JSON.parse(JSON.stringify(flowData));

    // 替换节点数据中的占位符
    for (const node of result.nodes) {
      node.data = this.replaceInValue(node.data, paramMap);
    }

    // 替换边的数据中的占位符
    for (const edge of result.edges) {
      edge.data = this.replaceInValue(edge.data, paramMap);
    }

    // 替换上下文变量中的占位符
    for (const varName of Object.keys(result.context.variables)) {
      result.context.variables[varName] = this.replaceInValue(
        result.context.variables[varName],
        paramMap
      );
    }

    // 替换上下文变量默认值
    for (const varName of Object.keys(result.context.variables)) {
      const variable = result.context.variables[varName];
      if (variable.default !== undefined) {
        variable.default = this.replaceInValue(variable.default, paramMap);
      }
    }

    return result;
  }

  /**
   * 在值中替换占位符
   */
  private replaceInValue(value: any, paramMap: Map<string, any>): any {
    if (typeof value === 'string') {
      return value.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        const replacement = paramMap.get(key);
        return replacement !== undefined ? String(replacement) : match;
      });
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map(item => this.replaceInValue(item, paramMap));
    }

    if (value !== null && typeof value === 'object') {
      const result: any = {};
      for (const key of Object.keys(value)) {
        result[key] = this.replaceInValue(value[key], paramMap);
      }
      return result;
    }

    return value;
  }

  /**
   * 生成实例 ID
   */
  private generateInstanceId(): string {
    return `inst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // ==================== 模板版本控制 ====================

  /**
   * 创建模板版本
   * @param templateId 模板 ID
   * @param options 选项
   * @returns 创建的版本
   */
  createTemplateVersion(
    templateId: string,
    options: { description?: string; createdBy?: string } = {}
  ): TemplateVersion {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw FlowExecutionError.flowDefinitionInvalid(`模板 ${templateId} 不存在`);
    }

    const { description, createdBy } = options;

    // 获取现有版本
    const versions = this.templateVersions.get(templateId) || [];

    // 检查是否允许覆盖
    if (!this.versionConfig.allowOverwrite && versions.length > 0) {
      const latestVersion = versions[0];
      if (JSON.stringify(latestVersion.template) === JSON.stringify(template)) {
        throw FlowExecutionError.flowDefinitionInvalid('当前模板内容与最新版本相同，无需创建新版本');
      }
    }

    // 生成版本号
    const version = this.generateTemplateVersionNumber(versions);

    const newVersion: TemplateVersion = {
      version,
      template: { ...template },
      createdAt: new Date(),
      createdBy,
      description,
    };

    // 添加版本（新版本在前）
    versions.unshift(newVersion);

    // 限制版本数量
    if (versions.length > this.versionConfig.maxVersions) {
      versions.pop();
    }

    this.templateVersions.set(templateId, versions);

    return newVersion;
  }

  /**
   * 生成模板版本号
   */
  private generateTemplateVersionNumber(versions: TemplateVersion[]): string {
    if (versions.length === 0) {
      return '1.0.0';
    }

    const latestVersion = versions[0].version;
    const [major, minor, patch] = latestVersion.split('.').map(Number);

    return `${major}.${minor}.${patch + 1}`;
  }

  /**
   * 获取模板版本
   * @param templateId 模板 ID
   * @param version 版本号
   * @returns 版本信息
   */
  getTemplateVersion(templateId: string, version: string): TemplateVersion | undefined {
    const versions = this.templateVersions.get(templateId);
    if (!versions) {
      return undefined;
    }

    return versions.find(v => v.version === version);
  }

  /**
   * 获取模板所有版本
   * @param templateId 模板 ID
   * @returns 版本列表
   */
  getTemplateVersions(templateId: string): TemplateVersion[] {
    return this.templateVersions.get(templateId) || [];
  }

  /**
   * 获取模板最新版本
   * @param templateId 模板 ID
   * @returns 最新版本
   */
  getLatestTemplateVersion(templateId: string): TemplateVersion | undefined {
    const versions = this.getTemplateVersions(templateId);
    return versions[0];
  }

  /**
   * 回滚到指定版本
   * @param templateId 模板 ID
   * @param version 版本号
   * @returns 回滚后的模板
   */
  rollbackToVersion(templateId: string, version: string): TemplateDefinition {
    const templateVersion = this.getTemplateVersion(templateId, version);
    if (!templateVersion) {
      throw FlowExecutionError.flowDefinitionInvalid(`模板 ${templateId} 的版本 ${version} 不存在`);
    }

    // 更新当前模板
    const rolledBackTemplate = { ...templateVersion.template };
    this.templates.set(templateId, rolledBackTemplate);

    // 更新库条目
    const entry = this.library.get(templateId);
    if (entry) {
      entry.template = rolledBackTemplate;
    }

    return rolledBackTemplate;
  }

  /**
   * 比较模板版本
   * @param templateId 模板 ID
   * @param versionA 版本 A
   * @param versionB 版本 B
   * @returns 版本差异
   */
  compareTemplateVersions(templateId: string, versionA: string, versionB: string): {
    nodes: { added: string[]; removed: string[]; modified: string[] };
    edges: { added: string[]; removed: string[]; modified: string[] };
    context: { added: string[]; removed: string[]; modified: string[] };
  } {
    const versionAObj = this.getTemplateVersion(templateId, versionA);
    const versionBObj = this.getTemplateVersion(templateId, versionB);

    if (!versionAObj) {
      throw FlowExecutionError.flowDefinitionInvalid(`模板 ${templateId} 的版本 ${versionA} 不存在`);
    }
    if (!versionBObj) {
      throw FlowExecutionError.flowDefinitionInvalid(`模板 ${templateId} 的版本 ${versionB} 不存在`);
    }

    const flowA = versionAObj.template.flowTemplate;
    const flowB = versionBObj.template.flowTemplate;

    const diff: {
      nodes: { added: string[]; removed: string[]; modified: string[] };
      edges: { added: string[]; removed: string[]; modified: string[] };
      context: { added: string[]; removed: string[]; modified: string[] };
    } = {
      nodes: {
        added: [],
        removed: [],
        modified: [],
      },
      edges: {
        added: [],
        removed: [],
        modified: [],
      },
      context: {
        added: [],
        removed: [],
        modified: [],
      },
    };

    // 比较节点
    const nodeIdsA = new Set(flowA.nodes.map(n => n.id));
    const nodeIdsB = new Set(flowB.nodes.map(n => n.id));

    diff.nodes.added = Array.from(nodeIdsB).filter(id => !nodeIdsA.has(id));
    diff.nodes.removed = Array.from(nodeIdsA).filter(id => !nodeIdsB.has(id));

    const commonNodeIds = Array.from(nodeIdsA).filter(id => nodeIdsB.has(id));
    const nodesMapA = new Map(flowA.nodes.map(n => [n.id, n]));
    const nodesMapB = new Map(flowB.nodes.map(n => [n.id, n]));

    diff.nodes.modified = commonNodeIds.filter(id => {
      const nodeA = nodesMapA.get(id)!;
      const nodeB = nodesMapB.get(id)!;
      return JSON.stringify(nodeA.data) !== JSON.stringify(nodeB.data);
    });

    // 比较边
    const edgeIdsA = new Set(flowA.edges.map(e => e.id));
    const edgeIdsB = new Set(flowB.edges.map(e => e.id));

    diff.edges.added = Array.from(edgeIdsB).filter(id => !edgeIdsA.has(id));
    diff.edges.removed = Array.from(edgeIdsA).filter(id => !edgeIdsB.has(id));

    const commonEdgeIds = Array.from(edgeIdsA).filter(id => edgeIdsB.has(id));
    const edgesMapA = new Map(flowA.edges.map(e => [e.id, e]));
    const edgesMapB = new Map(flowB.edges.map(e => [e.id, e]));

    diff.edges.modified = commonEdgeIds.filter(id => {
      const edgeA = edgesMapA.get(id)!;
      const edgeB = edgesMapB.get(id)!;
      return JSON.stringify(edgeA.data) !== JSON.stringify(edgeB.data);
    });

    // 比较上下文
    const varsA = new Set(Object.keys(flowA.context.variables));
    const varsB = new Set(Object.keys(flowB.context.variables));

    diff.context.added = Array.from(varsB).filter(v => !varsA.has(v));
    diff.context.removed = Array.from(varsA).filter(v => !varsB.has(v));

    diff.context.modified = Array.from(varsA).filter(v => {
      if (!varsB.has(v)) return false;
      return JSON.stringify(flowA.context.variables[v]) !== JSON.stringify(flowB.context.variables[v]);
    });

    return diff;
  }

  /**
   * 删除指定版本
   * @param templateId 模板 ID
   * @param version 版本号
   * @returns 是否成功
   */
  deleteTemplateVersion(templateId: string, version: string): boolean {
    const versions = this.templateVersions.get(templateId);
    if (!versions) {
      return false;
    }

    const index = versions.findIndex(v => v.version === version);
    if (index === -1) {
      return false;
    }

    versions.splice(index, 1);

    // 如果删除的是最新版本，需要更新当前模板
    if (index === 0) {
      const currentVersion = versions[0];
      if (currentVersion) {
        this.templates.set(templateId, currentVersion.template);
        const entry = this.library.get(templateId);
        if (entry) {
          entry.template = currentVersion.template;
        }
      }
    }

    return true;
  }

  /**
   * 设置版本配置
   * @param config 配置
   */
  setVersionConfig(config: Partial<TemplateVersionConfig>): void {
    this.versionConfig = { ...this.versionConfig, ...config };
  }

  // ==================== 模板库管理 ====================

  /**
   * 添加到模板库
   * @param templateId 模板 ID
   * @param options 选项
   * @returns 库条目
   */
  addToLibrary(templateId: string, options: { status?: TemplateLibraryStatus; addedBy?: string } = {}): TemplateLibraryEntry {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw FlowExecutionError.flowDefinitionInvalid(`模板 ${templateId} 不存在`);
    }

    const { status = TemplateLibraryStatus.ACTIVE, addedBy } = options;

    const entry: TemplateLibraryEntry = {
      template,
      status,
      usageCount: 0,
      addedAt: new Date(),
      addedBy,
    };

    this.library.set(templateId, entry);
    return entry;
  }

  /**
   * 从模板库移除
   * @param templateId 模板 ID
   * @returns 是否成功
   */
  removeFromLibrary(templateId: string): boolean {
    return this.library.delete(templateId);
  }

  /**
   * 获取库条目
   * @param templateId 模板 ID
   * @returns 库条目
   */
  getLibraryEntry(templateId: string): TemplateLibraryEntry | undefined {
    return this.library.get(templateId);
  }

  /**
   * 获取所有库条目
   * @returns 库条目列表
   */
  getAllLibraryEntries(): TemplateLibraryEntry[] {
    return Array.from(this.library.values());
  }

  /**
   * 搜索模板库（基础版）
   * @param criteria 搜索条件
   * @returns 搜索结果
   */
  searchTemplates(criteria: TemplateSearchCriteria = {}): TemplateSearchResult {
    let items = Array.from(this.library.values());

    // 关键词搜索
    if (criteria.keyword) {
      const keyword = criteria.keyword.toLowerCase();
      items = items.filter(entry => {
        const template = entry.template;
        return (
          template.name.toLowerCase().includes(keyword) ||
          (template.description && template.description.toLowerCase().includes(keyword)) ||
          template.tags?.some(tag => tag.toLowerCase().includes(keyword))
        );
      });
    }

    // 分类过滤
    if (criteria.category) {
      items = items.filter(entry => entry.template.category === criteria.category);
    }

    // 标签过滤
    if (criteria.tags && criteria.tags.length > 0) {
      items = items.filter(entry =>
        entry.template.tags?.some(tag => criteria.tags!.includes(tag))
      );
    }

    // 状态过滤
    if (criteria.status) {
      items = items.filter(entry => entry.status === criteria.status);
    }

    // 启用过滤
    if (criteria.enabledOnly) {
      items = items.filter(entry => entry.template.enabled);
    }

    // 排序
    if (criteria.sortBy) {
      items.sort((a, b) => {
        let comparison = 0;
        switch (criteria.sortBy) {
          case 'name':
            comparison = a.template.name.localeCompare(b.template.name);
            break;
          case 'createdAt':
            comparison =
              (a.template.createdAt?.getTime() || 0) - (b.template.createdAt?.getTime() || 0);
            break;
          case 'updatedAt':
            comparison =
              (a.template.updatedAt?.getTime() || 0) - (b.template.updatedAt?.getTime() || 0);
            break;
          case 'usageCount':
            comparison = a.usageCount - b.usageCount;
            break;
        }
        return criteria.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    // 分页
    const page = criteria.page || 1;
    const pageSize = criteria.pageSize || 20;
    const total = items.length;
    const totalPages = Math.ceil(total / pageSize);
    const paginatedItems = items.slice((page - 1) * pageSize, page * pageSize);

    return {
      items: paginatedItems,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  /**
   * 高级搜索模板库
   * @param criteria 高级搜索条件
   * @returns 高级搜索结果
   */
  advancedSearchTemplates(criteria: AdvancedTemplateSearchCriteria = {}): AdvancedTemplateSearchResult {
    const startTime = performance.now();

    // 先执行基础搜索
    const baseResult = this.searchTemplates({
      keyword: criteria.keyword,
      category: criteria.category,
      tags: criteria.tags,
      status: criteria.status,
      enabledOnly: criteria.enabledOnly ?? true,
      sortBy: criteria.sortBy,
      sortOrder: criteria.sortOrder,
      page: criteria.page,
      pageSize: criteria.pageSize,
    });

    // 应用高级过滤条件
    let filteredItems = baseResult.items;

    // 节点类型过滤
    if (criteria.nodeTypes && criteria.nodeTypes.length > 0) {
      filteredItems = filteredItems.filter(entry => {
        const nodeTypes = new Set(
          entry.template.flowTemplate.nodes.map(n => n.data?.pluginNodeType?.toString())
        );
        return criteria.nodeTypes!.some(type => nodeTypes.has(type));
      });
    }

    // 最小节点数过滤
    if (criteria.minNodes !== undefined) {
      filteredItems = filteredItems.filter(
        entry => entry.template.flowTemplate.nodes.length >= criteria.minNodes!
      );
    }

    // 最大节点数过滤
    if (criteria.maxNodes !== undefined) {
      filteredItems = filteredItems.filter(
        entry => entry.template.flowTemplate.nodes.length <= criteria.maxNodes!
      );
    }

    // 创建者过滤
    if (criteria.createdBy) {
      filteredItems = filteredItems.filter(
        entry => entry.template.createdBy === criteria.createdBy
      );
    }

    // 时间范围过滤
    if (criteria.dateRange) {
      const { start, end } = criteria.dateRange;
      filteredItems = filteredItems.filter(entry => {
        const createdAt = entry.template.createdAt?.getTime() || 0;
        return createdAt >= start.getTime() && createdAt <= end.getTime();
      });
    }

    // 使用次数范围过滤
    if (criteria.usageRange) {
      if (criteria.usageRange.min !== undefined) {
        filteredItems = filteredItems.filter(
          entry => entry.usageCount >= criteria.usageRange!.min!
        );
      }
      if (criteria.usageRange.max !== undefined) {
        filteredItems = filteredItems.filter(
          entry => entry.usageCount <= criteria.usageRange!.max!
        );
      }
    }

    // 计算分类统计
    const categoryStatsMap = new Map<string, { count: number; totalUsage: number }>();
    for (const item of filteredItems) {
      const category = item.template.category;
      if (category) {
        const stats = categoryStatsMap.get(category) || { count: 0, totalUsage: 0 };
        stats.count++;
        stats.totalUsage += item.usageCount;
        categoryStatsMap.set(category, stats);
      }
    }
    const categoryStats: CategoryStats[] = Array.from(categoryStatsMap.entries()).map(
      ([category, stats]) => ({
        category,
        count: stats.count,
        totalUsage: stats.totalUsage,
      })
    );

    // 计算标签统计
    const tagStatsMap = new Map<string, { count: number; templateIds: string[] }>();
    for (const item of filteredItems) {
      for (const tag of item.template.tags || []) {
        const stats = tagStatsMap.get(tag) || { count: 0, templateIds: [] };
        stats.count++;
        if (!stats.templateIds.includes(item.template.id)) {
          stats.templateIds.push(item.template.id);
        }
        tagStatsMap.set(tag, stats);
      }
    }
    const tagStats: TagStats[] = Array.from(tagStatsMap.entries()).map(([tag, stats]) => ({
      tag,
      count: stats.count,
      templateIds: stats.templateIds,
    }));

    // 计算搜索耗时
    const searchDuration = performance.now() - startTime;

    // 重新计算分页
    const page = criteria.page || 1;
    const pageSize = criteria.pageSize || 20;
    const total = filteredItems.length;
    const totalPages = Math.ceil(total / pageSize);
    const paginatedItems = filteredItems.slice((page - 1) * pageSize, page * pageSize);

    return {
      items: paginatedItems,
      total,
      page,
      pageSize,
      totalPages,
      categoryStats,
      tagStats,
      searchDuration,
    };
  }

  /**
   * 模糊搜索模板（支持更灵活的匹配）
   * @param keyword 关键词
   * @param options 搜索选项
   * @returns 搜索结果
   */
  fuzzySearchTemplates(
    keyword: string,
    options: {
      limit?: number;
      includeCategories?: boolean;
      includeTags?: boolean;
    } = {}
  ): {
    results: TemplateLibraryEntry[];
    scores: number[];
    categories?: string[];
    tags?: string[];
  } {
    const {
      limit = 20,
      includeCategories = false,
      includeTags = false,
    } = options;

    const results: TemplateLibraryEntry[] = [];
    const scores: number[] = [];
    const categorySet = new Set<string>();
    const tagSet = new Set<string>();

    const keywordLower = keyword.toLowerCase();

    for (const entry of this.library.values()) {
      let score = 0;
      const template = entry.template;

      // 名称匹配（权重最高）
      if (template.name.toLowerCase().includes(keywordLower)) {
        score += 10;
      }

      // 描述匹配
      if (template.description?.toLowerCase().includes(keywordLower)) {
        score += 5;
      }

      // 标签匹配
      for (const tag of template.tags || []) {
        if (tag.toLowerCase().includes(keywordLower)) {
          score += 3;
          if (includeTags) tagSet.add(tag);
        }
      }

      // 分类匹配
      if (template.category?.toLowerCase().includes(keywordLower)) {
        score += 4;
        if (includeCategories) categorySet.add(template.category);
      }

      // 参数名称匹配
      for (const param of template.parameters) {
        if (param.name.toLowerCase().includes(keywordLower)) {
          score += 2;
        }
        if (param.label.toLowerCase().includes(keywordLower)) {
          score += 2;
        }
      }

      if (score > 0) {
        results.push(entry);
        scores.push(score);
      }
    }

    // 按分数排序
    const indexedResults = results.map((item, index) => ({ item, score: scores[index] }));
    indexedResults.sort((a, b) => b.score - a.score);

    const finalResults = indexedResults.slice(0, limit).map(({ item }) => item);
    const finalScores = indexedResults.slice(0, limit).map(({ score }) => score);

    return {
      results: finalResults,
      scores: finalScores,
      categories: includeCategories ? Array.from(categorySet) : undefined,
      tags: includeTags ? Array.from(tagSet) : undefined,
    };
  }

  /**
   * 更新模板使用计数
   * @param templateId 模板 ID
   */
  incrementUsageCount(templateId: string): void {
    const entry = this.library.get(templateId);
    if (entry) {
      entry.usageCount++;
      entry.lastUsedAt = new Date();
    }
  }

  /**
   * 设置模板状态
   * @param templateId 模板 ID
   * @param status 状态
   * @returns 是否成功
   */
  setTemplateStatus(templateId: string, status: TemplateLibraryStatus): boolean {
    const entry = this.library.get(templateId);
    if (!entry) {
      return false;
    }

    entry.status = status;
    return true;
  }

  /**
   * 清空模板库
   */
  clearLibrary(): void {
    this.library.clear();
  }

  /**
   * 获取模板数量
   */
  getTemplateCount(): number {
    return this.templates.size;
  }

  /**
   * 获取库条目数量
   */
  getLibraryCount(): number {
    return this.library.size;
  }
}

// 默认导出
export const templateManager = new TemplateManager();
export default templateManager;
