// 虚假数据 - AI实验教学辅助系统
export interface Course {
  id: string;
  name: string;
  description: string;
  category: 'digital' | 'analog' | 'basic';
  experiments: Experiment[];
}

export interface Experiment {
  id: string;
  name: string;
  description: string;
  courseId: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // 预计时间（分钟）
  equipment: string[];
  manual: ExperimentManual;
}

export interface ExperimentManual {
  id: string;
  title: string;
  content: string;
  sections: ManualSection[];
  lastUpdated: string;
}

export interface ManualSection {
  id: string;
  title: string;
  content: string;
  type: 'objective' | 'theory' | 'equipment' | 'procedure' | 'questions' | 'notes';
}

export interface AITutorConfig {
  depth: 'beginner' | 'standard' | 'advanced';
  style: 'academic' | 'vivid' | 'encouraging';
}

export interface PreviewReport {
  id: string;
  experimentId: string;
  tutorConfig: AITutorConfig;
  content: string;
  sections: ReportSection[];
  generatedAt: string;
}

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  type: 'objective' | 'theory' | 'equipment' | 'procedure' | 'parameters' | 'questions' | 'troubleshooting';
}

// 虚假数据
export const mockCourses: Course[] = [
  {
    id: 'course-1',
    name: '数字电路实验',
    description: '数字电路基础实验，包含逻辑门、组合电路、时序电路等',
    category: 'digital',
    experiments: [
      {
        id: 'exp-1-1',
        name: '基本逻辑门实验',
        description: '学习与门、或门、非门的工作原理和特性',
        courseId: 'course-1',
        difficulty: 'beginner',
        estimatedTime: 90,
        equipment: ['OWON FDS示波器', '面包板', '74HC系列芯片', '电阻', '发光二极管'],
        manual: {
          id: 'manual-1-1',
          title: '基本逻辑门实验指导书',
          content: '本实验旨在通过实际操作，加深对数字电路中基本逻辑门工作原理的理解...',
          lastUpdated: '2024-01-15',
          sections: [
            {
              id: 'section-1-1-1',
              title: '实验目的',
              content: '1. 掌握基本逻辑门的工作原理\n2. 学会使用示波器观察数字信号\n3. 验证逻辑门的真值表',
              type: 'objective'
            },
            {
              id: 'section-1-1-2',
              title: '实验原理',
              content: '数字电路中，逻辑门是构成数字系统的基本单元。与门实现逻辑乘法运算，或门实现逻辑加法运算，非门实现逻辑取反运算...',
              type: 'theory'
            },
            {
              id: 'section-1-1-3',
              title: '实验器材',
              content: '1. OWON FDS四合一仪器\n2. 74HC08（四2输入与门）\n3. 74HC32（四2输入或门）\n4. 74HC04（六反相器）\n5. 面包板、导线\n6. 电阻（1kΩ）\n7. 发光二极管',
              type: 'equipment'
            },
            {
              id: 'section-1-1-4',
              title: '实验步骤',
              content: '1. 连接与门电路\n   - 将74HC08插入面包板\n   - 连接VCC（5V）和GND\n   - 连接输入信号A、B\n   - 连接输出到示波器\n\n2. 测试与门真值表\n   - 设置输入A=0, B=0，观察输出\n   - 设置输入A=0, B=1，观察输出\n   - 设置输入A=1, B=0，观察输出\n   - 设置输入A=1, B=1，观察输出\n\n3. 重复步骤1-2测试或门和非门',
              type: 'procedure'
            },
            {
              id: 'section-1-1-5',
              title: '思考题',
              content: '1. 为什么要在输出端加上拉电阻？\n2. 如何用与门和非门实现或门功能？\n3. 实际测量的高低电平与理论值是否一致？为什么？',
              type: 'questions'
            }
          ]
        }
      },
      {
        id: 'exp-1-2',
        name: '组合逻辑电路设计',
        description: '设计和实现简单的组合逻辑电路',
        courseId: 'course-1',
        difficulty: 'intermediate',
        estimatedTime: 120,
        equipment: ['OWON FDS示波器', '面包板', '74HC系列芯片', '电阻', '发光二极管'],
        manual: {
          id: 'manual-1-2',
          title: '组合逻辑电路设计实验指导书',
          content: '本实验学习组合逻辑电路的设计方法和实现技术...',
          lastUpdated: '2024-01-20',
          sections: [
            {
              id: 'section-1-2-1',
              title: '实验目的',
              content: '1. 掌握组合逻辑电路的设计方法\n2. 学会使用卡诺图化简逻辑函数\n3. 实现三人表决器电路',
              type: 'objective'
            },
            {
              id: 'section-1-2-2',
              title: '实验原理',
              content: '组合逻辑电路的输出只取决于当前的输入状态，与电路的历史状态无关。设计步骤包括：列出真值表、写出逻辑函数、化简逻辑函数、选择器件实现...',
              type: 'theory'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'course-2',
    name: '模拟电路实验',
    description: '模拟电路基础实验，包含放大器、滤波器、振荡器等',
    category: 'analog',
    experiments: [
      {
        id: 'exp-2-1',
        name: '负反馈放大电路',
        description: '学习负反馈对放大器性能的影响',
        courseId: 'course-2',
        difficulty: 'intermediate',
        estimatedTime: 120,
        equipment: ['OWON FDS示波器', '信号发生器', '运算放大器', '电阻', '电容'],
        manual: {
          id: 'manual-2-1',
          title: '负反馈放大电路实验指导书',
          content: '本实验研究负反馈对放大器性能的影响...',
          lastUpdated: '2024-01-25',
          sections: [
            {
              id: 'section-2-1-1',
              title: '实验目的',
              content: '1. 理解负反馈的基本概念\n2. 掌握负反馈对放大器性能的影响\n3. 学会测量放大器的频率响应',
              type: 'objective'
            },
            {
              id: 'section-2-1-2',
              title: '实验原理',
              content: '负反馈是指将放大器输出信号的一部分反馈到输入端，与输入信号相减的过程。负反馈可以改善放大器的稳定性、减小失真、展宽频带...',
              type: 'theory'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'course-3',
    name: '电路基础实验',
    description: '电路基础理论验证实验，包含欧姆定律、基尔霍夫定律等',
    category: 'basic',
    experiments: [
      {
        id: 'exp-3-1',
        name: '验证欧姆定律',
        description: '通过实验验证欧姆定律的正确性',
        courseId: 'course-3',
        difficulty: 'beginner',
        estimatedTime: 60,
        equipment: ['OWON FDS万用表', '直流电源', '电阻', '导线'],
        manual: {
          id: 'manual-3-1',
          title: '验证欧姆定律实验指导书',
          content: '本实验通过测量不同电阻在不同电压下的电流值，验证欧姆定律...',
          lastUpdated: '2024-01-10',
          sections: [
            {
              id: 'section-3-1-1',
              title: '实验目的',
              content: '1. 验证欧姆定律U=IR\n2. 学会使用万用表测量电压、电流、电阻\n3. 掌握直流电路的基本分析方法',
              type: 'objective'
            },
            {
              id: 'section-3-1-2',
              title: '实验原理',
              content: '欧姆定律是电路分析的基本定律之一，它描述了电阻两端的电压与通过电阻的电流之间的关系：U = I × R...',
              type: 'theory'
            }
          ]
        }
      }
    ]
  }
];

export const mockTutorStyles = {
  depth: [
    { value: 'beginner', label: '入门', description: '适合初学者，重点讲解基础概念' },
    { value: 'standard', label: '标准', description: '标准深度，理论与实践并重' },
    { value: 'advanced', label: '深入', description: '深入分析，包含扩展知识' }
  ],
  style: [
    { value: 'academic', label: '严谨学术', description: '严谨的学术风格，逻辑清晰' },
    { value: 'vivid', label: '生动形象', description: '生动有趣，通俗易懂' },
    { value: 'encouraging', label: '循循善诱', description: '鼓励式教学，循序渐进' }
  ]
};

// 生成预习报告的模拟函数
export function generateMockPreviewReport(experimentId: string, tutorConfig: AITutorConfig): PreviewReport {
  const experiment = mockCourses
    .flatMap(course => course.experiments)
    .find(exp => exp.id === experimentId);
  
  if (!experiment) {
    throw new Error('实验不存在');
  }

  const sections: ReportSection[] = [
    {
      id: 'report-obj-1',
      title: '实验目的',
      content: experiment.manual.sections.find(s => s.type === 'objective')?.content || '掌握实验的基本原理和方法',
      type: 'objective'
    },
    {
      id: 'report-theory-1',
      title: '核心原理',
      content: experiment.manual.sections.find(s => s.type === 'theory')?.content || '相关理论知识',
      type: 'theory'
    },
    {
      id: 'report-equipment-1',
      title: '所需器材',
      content: experiment.equipment.map(eq => `• ${eq}`).join('\n'),
      type: 'equipment'
    },
    {
      id: 'report-procedure-1',
      title: '实验步骤',
      content: experiment.manual.sections.find(s => s.type === 'procedure')?.content || '按照实验手册进行操作',
      type: 'procedure'
    },
    {
      id: 'report-parameters-1',
      title: '关键参数设置',
      content: '• 电源电压：5V\n• 输入信号频率：1kHz\n• 输入信号幅度：1Vpp\n• 示波器时基：1ms/div\n• 示波器电压档位：1V/div',
      type: 'parameters'
    },
    {
      id: 'report-questions-1',
      title: '思考题',
      content: experiment.manual.sections.find(s => s.type === 'questions')?.content || '思考实验中的关键问题',
      type: 'questions'
    },
    {
      id: 'report-troubleshooting-1',
      title: '常见问题预判',
      content: '• 电路连接错误：检查连线是否牢固\n• 电源电压不正确：确认电源设置\n• 示波器无波形：检查探头连接\n• 测量结果异常：验证器件是否损坏',
      type: 'troubleshooting'
    }
  ];

  return {
    id: `report-${experimentId}-${Date.now()}`,
    experimentId,
    tutorConfig,
    content: sections.map(s => `## ${s.title}\n\n${s.content}`).join('\n\n'),
    sections,
    generatedAt: new Date().toISOString()
  };
}

// 模拟AI问答回复
export function generateMockAIResponse(question: string, experimentContext: Experiment): string {
  const responses = [
    {
      keywords: ['示波器', '波形', '显示'],
      response: `根据当前实验《${experimentContext.name}》，示波器显示问题通常有以下几种可能：\n\n1. **探头连接问题**：检查探头是否正确连接到测试点\n2. **时基设置**：调整时基到合适的档位（建议1ms/div）\n3. **触发设置**：确保触发模式设置正确\n4. **电压档位**：调整垂直档位到合适范围\n\n建议先检查连线，然后逐步调整示波器参数。`
    },
    {
      keywords: ['电压', '测量', '万用表'],
      response: `在《${experimentContext.name}》实验中，电压测量的关键点：\n\n1. **选择正确档位**：根据预期电压选择合适的量程\n2. **正确连接**：红表笔接高电位，黑表笔接低电位\n3. **测量点确认**：确保测量点与电路图一致\n4. **读数方法**：等待数值稳定后读取\n\n如果测量值异常，请检查电路连接和元器件状态。`
    },
    {
      keywords: ['电阻', '阻值', '测试'],
      response: `电阻测量注意事项：\n\n1. **断电测量**：必须在断电状态下测量电阻\n2. **脱离电路**：最好将电阻从电路中取下测量\n3. **档位选择**：选择合适的电阻档位\n4. **接触良好**：确保表笔与电阻引脚接触良好\n\n标准电阻的误差通常在±5%以内。`
    }
  ];

  // 简单的关键词匹配
  for (const item of responses) {
    if (item.keywords.some(keyword => question.includes(keyword))) {
      return item.response;
    }
  }

  // 默认回复
  return `关于您的问题"${question}"，在《${experimentContext.name}》实验中，建议您：\n\n1. 仔细阅读实验手册相关章节\n2. 检查实验器材和连接\n3. 确认操作步骤是否正确\n4. 如果问题持续存在，请检查器件是否损坏\n\n您可以尝试描述更具体的现象，这样我能给出更准确的建议。`;
} 