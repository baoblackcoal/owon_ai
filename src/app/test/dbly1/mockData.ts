import digitalExperiment1Content1 from './manuals';

import { 
  Course, 
  Experiment, 
  ExperimentManual, 
  FAQItem, 
  StudentQuestion, 
  ExperimentFile,
  ChatMessage,
  Student
} from './types';


const digitalExperiment1Content = digitalExperiment1Content1


// 模拟学生数据
export const mockStudents: Student[] = [
  {
    id: 'student-1',
    name: '张三',
    studentNumber: '2021001',
    loginTime: new Date('2024-01-15T09:00:00')
  },
  {
    id: 'student-2',
    name: '李四',
    studentNumber: '2021002',
    loginTime: new Date('2024-01-15T09:15:00')
  },
  {
    id: 'student-3',
    name: '王五',
    studentNumber: '2021003',
    loginTime: new Date('2024-01-15T10:30:00')
  }
];

// 模拟实验手册数据
const mockManuals: ExperimentManual[] = [
  {
    id: 'manual-digital-1',
    title: 'TTL/CMOS门电路逻辑功能及参数的测试',
    content: digitalExperiment1Content,
    sections: [
      {
        id: 'section-1',
        title: '实验目的',
        content: '掌握 TTL/HCT 门电路逻辑功能及其测试方法...',
        order: 1
      },
      {
        id: 'section-2',
        title: '实验仪器及设备',
        content: '数字逻辑实验箱 1台，示波器 1台...',
        order: 2
      }
    ]
  },
  {
    id: 'manual-digital-2',
    title: '组合逻辑电路设计与测试',
    content: `# 组合逻辑电路设计与测试

## 实验目的
- 掌握组合逻辑电路的设计方法
- 学会使用OWON FDS进行电路测试
- 理解真值表与逻辑表达式的对应关系

## 实验原理
组合逻辑电路是数字电路的基础，其输出仅取决于当前输入状态，不依赖于电路的历史状态。

## 实验内容
1. 设计3-8译码器
2. 测试优先编码器
3. 分析数据选择器功能`,
    sections: []
  },
  {
    id: 'manual-analog-1',
    title: '运算放大器基本应用电路',
    content: `# 运算放大器基本应用电路

## 实验目的
- 掌握运算放大器的基本特性
- 学会测量运放的主要参数
- 理解负反馈的作用

## 实验设备
- OWON FDS四合一仪器
- 运算放大器芯片（LM741）
- 电阻、电容等元件

## 实验内容
1. 测试同相放大器
2. 测试反相放大器
3. 测试积分器和微分器`,
    sections: []
  }
];

// 模拟课程数据
export const mockCourses: Course[] = [
  {
    id: 'course-digital',
    name: '数字电路实验',
    description: '基于数字逻辑的电路设计与测试，包括门电路、组合逻辑、时序逻辑等核心内容',
    category: 'digital',
    experiments: [
      {
        id: 'exp-digital-1',
        name: 'TTL/CMOS门电路逻辑功能测试',
        description: '学习基本门电路的逻辑功能，掌握TTL和CMOS器件的特性差异',
        difficulty: 'beginner',
        estimatedTime: 2,
        equipment: ['OWON FDS', '74LS00', '74HCT00', 'CC4001', '面包板'],
        manual: mockManuals[0],
        aiChatData: [
          {
            question: '简述与门电路的工作原理及逻辑表达式是什么？',
            answer: '与门电路是一种基本逻辑门电路，其工作原理是只有当所有输入信号都为高电平（逻辑 1）时，输出信号才为高电平（逻辑 1）；只要有一个输入信号为低电平（逻辑 0），输出就为低电平（逻辑 0）。逻辑表达式为 Y = A・B （其中 Y 是输出，A、B 是输入，"・" 表示逻辑与运算 ）。'
          },
          {
            question: '或非门电路的工作原理和逻辑表达式是怎样的？',
            answer: '或非门电路先对输入信号进行或运算，再进行非运算。工作时，只要输入信号中有一个为高电平（逻辑 1），经过或运算后结果为高电平，再经过非运算，输出就变为低电平（逻辑 0）；只有当所有输入信号都为低电平（逻辑 0）时，或运算结果为低电平，非运算后输出才为高电平（逻辑 1）。逻辑表达式为 Y = A+B​。'
          }
        ],
        faqData: {
          title: '数字电子技术实验3.1的常见问题',
          questions: [
            {
              question: '本次实验的主要目标是什么？',
              answer: '本次实验旨在帮助您掌握TTL/HCT门电路的逻辑功能及其测试方法，理解CMOS"或非门"电路参数的意义及其测试方法，并学习半加器逻辑功能的测试。您还将熟悉数字逻辑实验箱和示波器的使用方法。'
            },
            {
              question: '进行本次实验需要哪些具体的仪器设备和元器件？',
              answer: '您将需要一台数字逻辑实验箱、一台示波器、一块数字万用表，以及多种集成电路（IC）芯片。这些芯片包括：74LS00/74HCT00（四2输入端与非门）、74LS08（四2输入端与门）、74LS32（四2输入端或门）、74LS04（六反向器）、74LS86（四2输入端异或门）和CC4001（四2输入端或非门）。'
            },
            {
              question: '在进行实验之前，需要具备哪些预备知识？',
              answer: '开始实验前，您应该复习门电路的工作原理及相应的逻辑表达式。同时，掌握TTL、HCT和CMOS门电路各项参数的定义也至关重要。'
            }
          ]
        }
      },
      {
        id: 'exp-digital-2',
        name: '组合逻辑电路设计',
        description: '设计和测试各种组合逻辑电路，如译码器、编码器、数据选择器等',
        difficulty: 'intermediate',
        estimatedTime: 3,
        equipment: ['OWON FDS', '74LS138', '74LS148', '74LS151', '面包板'],
        manual: mockManuals[1]
      },
      {
        id: 'exp-digital-3',
        name: '时序逻辑电路分析',
        description: '分析触发器、计数器、寄存器等时序逻辑电路的工作原理',
        difficulty: 'advanced',
        estimatedTime: 4,
        equipment: ['OWON FDS', '74LS74', '74LS161', '74LS194', '面包板'],
        manual: {
          id: 'manual-digital-3',
          title: '时序逻辑电路分析',
          content: '# 时序逻辑电路分析\n\n## 实验目的\n学习时序逻辑电路的基本原理...',
          sections: []
        }
      }
    ]
  },
  {
    id: 'course-analog',
    name: '模拟电路实验',
    description: '模拟电子技术的实验教学，涵盖放大器、滤波器、振荡器等经典电路',
    category: 'analog',
    experiments: [
      {
        id: 'exp-analog-1',
        name: '运算放大器基本应用',
        description: '学习运算放大器的基本特性和典型应用电路',
        difficulty: 'beginner',
        estimatedTime: 2.5,
        equipment: ['OWON FDS', 'LM741', '电阻', '电容', '面包板'],
        manual: mockManuals[2]
      },
      {
        id: 'exp-analog-2',
        name: '有源滤波器设计',
        description: '设计和测试各种有源滤波器电路',
        difficulty: 'intermediate',
        estimatedTime: 3.5,
        equipment: ['OWON FDS', 'LM741', '电阻', '电容', '面包板'],
        manual: {
          id: 'manual-analog-2',
          title: '有源滤波器设计',
          content: '# 有源滤波器设计\n\n## 实验目的\n掌握有源滤波器的设计方法...',
          sections: []
        }
      },
      {
        id: 'exp-analog-3',
        name: '波形发生器电路',
        description: '设计正弦波、方波、三角波发生器电路',
        difficulty: 'advanced',
        estimatedTime: 4,
        equipment: ['OWON FDS', 'LM741', 'LM555', '电阻', '电容', '面包板'],
        manual: {
          id: 'manual-analog-3',
          title: '波形发生器电路',
          content: '# 波形发生器电路\n\n## 实验目的\n学习各种波形发生器的工作原理...',
          sections: []
        }
      }
    ]
  },
  {
    id: 'course-basic',
    name: '电路基础实验',
    description: '电路分析的基础实验，包括欧姆定律、基尔霍夫定律、网络定理等',
    category: 'basic',
    experiments: [
      {
        id: 'exp-basic-1',
        name: '欧姆定律验证',
        description: '通过实验验证欧姆定律，学习电压、电流、电阻的测量方法',
        difficulty: 'beginner',
        estimatedTime: 1.5,
        equipment: ['OWON FDS', '电阻', '面包板'],
        manual: {
          id: 'manual-basic-1',
          title: '欧姆定律验证',
          content: '# 欧姆定律验证\n\n## 实验目的\n验证欧姆定律的正确性...',
          sections: []
        }
      },
      {
        id: 'exp-basic-2',
        name: '基尔霍夫定律验证',
        description: '验证基尔霍夫电流定律和电压定律',
        difficulty: 'intermediate',
        estimatedTime: 2,
        equipment: ['OWON FDS', '电阻', '面包板'],
        manual: {
          id: 'manual-basic-2',
          title: '基尔霍夫定律验证',
          content: '# 基尔霍夫定律验证\n\n## 实验目的\n验证KCL和KVL定律...',
          sections: []
        }
      }
    ]
  }
];

// 模拟FAQ数据
export const mockFAQs: FAQItem[] = [
  {
    id: 'faq-1',
    question: '74LS00芯片的电源电压范围是多少？',
    answer: 'TTL器件74LS00的电源电压范围是4.75V到5.25V，典型值为5V。工作时必须确保电源电压在此范围内，否则可能导致器件损坏或逻辑功能异常。',
    category: '数字电路',
    experimentId: 'exp-digital-1',
    tags: ['TTL', '电源', '74LS00'],
    isPublished: true,
    createdAt: new Date('2024-01-10T10:00:00'),
    updatedAt: new Date('2024-01-10T10:00:00'),
    viewCount: 45
  },
  {
    id: 'faq-2',
    question: '如何使用OWON FDS示波器测量信号的峰峰值？',
    answer: '1. 将信号连接到示波器的CH1或CH2通道\n2. 调节垂直刻度，使波形完整显示在屏幕上\n3. 使用光标功能，将两个光标分别放在波形的最高点和最低点\n4. 读取光标间的电压差值，即为峰峰值\n5. 也可以使用自动测量功能，选择Vpp参数进行自动测量',
    category: '仪器操作',
    experimentId: '',
    tags: ['示波器', 'OWON FDS', '峰峰值', '测量'],
    isPublished: true,
    createdAt: new Date('2024-01-12T14:30:00'),
    updatedAt: new Date('2024-01-12T14:30:00'),
    viewCount: 78
  },
  {
    id: 'faq-3',
    question: '运算放大器的输入偏置电流对电路有什么影响？',
    answer: '输入偏置电流会在输入电阻上产生压降，导致输出电压产生误差。影响程度取决于：\n1. 偏置电流的大小\n2. 输入电阻的阻值\n3. 电路的增益\n\n减小影响的方法：\n1. 选择低偏置电流的运放\n2. 在反相输入端串联平衡电阻\n3. 使用FET输入运放',
    category: '模拟电路',
    experimentId: 'exp-analog-1',
    tags: ['运算放大器', '偏置电流', '误差分析'],
    isPublished: true,
    createdAt: new Date('2024-01-15T09:20:00'),
    updatedAt: new Date('2024-01-15T09:20:00'),
    viewCount: 32
  },
  {
    id: 'faq-4',
    question: '为什么我的电路连接正确但LED不亮？',
    answer: '可能的原因和解决方法：\n1. 检查电源连接是否正确\n2. 确认LED极性是否接反\n3. 检查限流电阻是否合适\n4. 用万用表测量各点电压\n5. 确认芯片是否损坏\n6. 检查面包板接触是否良好',
    category: '故障排除',
    experimentId: '',
    tags: ['LED', '故障排除', '电路调试'],
    isPublished: true,
    createdAt: new Date('2024-01-16T11:45:00'),
    updatedAt: new Date('2024-01-16T11:45:00'),
    viewCount: 67
  },
  {
    id: 'faq-5',
    question: '什么是半加器？它的逻辑表达式是什么？',
    answer: '半加器是执行两个一位二进制数相加的组合逻辑电路，不考虑来自低位的进位。\n\n逻辑表达式：\n- 和输出：S = A ⊕ B\n- 进位输出：C = A · B\n\n真值表：\n| A | B | S | C |\n|---|---|---|---|\n| 0 | 0 | 0 | 0 |\n| 0 | 1 | 1 | 0 |\n| 1 | 0 | 1 | 0 |\n| 1 | 1 | 0 | 1 |',
    category: '数字电路',
    experimentId: 'exp-digital-1',
    tags: ['半加器', '逻辑电路', '真值表'],
    isPublished: true,
    createdAt: new Date('2024-01-17T15:10:00'),
    updatedAt: new Date('2024-01-17T15:10:00'),
    viewCount: 89
  }
];

// 模拟学生提问记录
export const mockStudentQuestions: StudentQuestion[] = [
  {
    id: 'question-1',
    studentId: 'student-1',
    studentName: '张三',
    studentNumber: '2021001',
    experimentId: 'exp-digital-1',
    experimentName: 'TTL/CMOS门电路逻辑功能测试',
    question: '74LS00芯片插入面包板后，用万用表测量14脚和7脚之间没有5V电压，这是什么原因？',
    aiResponse: '可能的原因有：1. 电源未正确连接到14脚（VCC）；2. 7脚（GND）未接地；3. 电源电压不足或电源故障；4. 芯片插入方向错误；5. 面包板接触不良。建议检查电源连接，确认芯片方向，并用万用表测量电源输出电压。',
    timestamp: new Date('2024-01-15T09:30:00'),
    category: '硬件连接',
    tags: ['74LS00', '电源', '万用表'],
    isResolved: true
  },
  {
    id: 'question-2',
    studentId: 'student-2',
    studentName: '李四',
    studentNumber: '2021002',
    experimentId: 'exp-digital-1',
    experimentName: 'TTL/CMOS门电路逻辑功能测试',
    question: '在测试与非门时，输入都是高电平，但输出LED不亮，这正常吗？',
    aiResponse: '这是正常现象。与非门的逻辑功能是：只有当所有输入都为高电平时，输出才为低电平。当输入A=1，B=1时，输出Y=0（低电平），所以LED不亮。这正好验证了与非门的逻辑功能：Y = NOT(A AND B)。',
    timestamp: new Date('2024-01-15T10:45:00'),
    category: '逻辑功能',
    tags: ['与非门', 'LED', '逻辑功能'],
    isResolved: true
  },
  {
    id: 'question-3',
    studentId: 'student-3',
    studentName: '王五',
    studentNumber: '2021003',
    experimentId: 'exp-analog-1',
    experimentName: '运算放大器基本应用',
    question: '运放电路输出波形出现削波现象，应该如何解决？',
    aiResponse: '削波现象通常是由于：1. 输入信号幅度过大，超过运放的线性工作范围；2. 电源电压不足；3. 负载过重。解决方法：1. 减小输入信号幅度；2. 检查正负电源电压是否正常；3. 增大负载电阻；4. 检查运放是否工作在线性区。',
    timestamp: new Date('2024-01-16T14:20:00'),
    category: '电路调试',
    tags: ['运算放大器', '削波', '波形'],
    isResolved: false
  },
  {
    id: 'question-4',
    studentId: 'student-1',
    studentName: '张三',
    studentNumber: '2021001',
    experimentId: 'exp-digital-2',
    experimentName: '组合逻辑电路设计',
    question: '3-8译码器的使能端有什么作用？',
    aiResponse: '使能端（Enable）用于控制译码器的工作状态：\n1. 当使能端有效时，译码器正常工作，根据输入地址选择对应的输出\n2. 当使能端无效时，译码器被禁止，所有输出都为无效状态\n3. 使能端可以用于级联多个译码器，扩展译码容量\n4. 在系统中可以用作片选信号，控制译码器的工作时机',
    timestamp: new Date('2024-01-17T11:15:00'),
    category: '理论概念',
    tags: ['译码器', '使能端', '组合逻辑'],
    isResolved: true
  },
  {
    id: 'question-5',
    studentId: 'student-2',
    studentName: '李四',
    studentNumber: '2021002',
    experimentId: 'exp-basic-1',
    experimentName: '欧姆定律验证',
    question: '为什么实验测得的电阻值与标称值有差异？',
    aiResponse: '电阻值存在差异的原因：\n1. 电阻器的制造误差（通常有±5%、±1%等精度等级）\n2. 温度对电阻值的影响\n3. 测量仪器的精度限制\n4. 接触电阻的影响\n5. 电阻器的老化\n这些差异在允许的误差范围内是正常的，实验时应记录实际测量值并分析误差来源。',
    timestamp: new Date('2024-01-18T09:40:00'),
    category: '误差分析',
    tags: ['电阻', '误差', '测量'],
    isResolved: true
  }
];

// 模拟实验文件数据
export const mockExperimentFiles: ExperimentFile[] = [
  {
    id: 'file-1',
    experimentId: 'exp-digital-1',
    fileName: 'TTL_CMOS门电路实验.md',
    fileType: 'markdown',
    filePath: '/manuals/digital/exp1.md',
    uploadDate: new Date('2024-01-10T08:00:00'),
    size: '15.2 KB',
    course: '数字电路实验',
    experiment: 'TTL/CMOS门电路逻辑功能测试',
    isActive: true
  },
  {
    id: 'file-2',
    experimentId: 'exp-digital-2',
    fileName: '组合逻辑电路设计.md',
    fileType: 'markdown',
    filePath: '/manuals/digital/exp2.md',
    uploadDate: new Date('2024-01-11T10:30:00'),
    size: '22.8 KB',
    course: '数字电路实验',
    experiment: '组合逻辑电路设计',
    isActive: true
  },
  {
    id: 'file-3',
    experimentId: 'exp-analog-1',
    fileName: '运算放大器基本应用.md',
    fileType: 'markdown',
    filePath: '/manuals/analog/exp1.md',
    uploadDate: new Date('2024-01-12T14:15:00'),
    size: '18.7 KB',
    course: '模拟电路实验',
    experiment: '运算放大器基本应用',
    isActive: true
  }
];

// AI响应生成函数
export function generateMockAIResponse(question: string, experimentId: string): string {
  // 基于问题关键词生成相应的回答
  const keywords = question.toLowerCase();
  
  if (keywords.includes('74ls00') || keywords.includes('与非门')) {
    return '74LS00是四2输入与非门芯片，其逻辑功能是：当所有输入都为高电平时，输出为低电平；其他情况下输出为高电平。在实验中需要注意正确连接电源（14脚接5V，7脚接地）。';
  }
  
  if (keywords.includes('示波器') || keywords.includes('owon')) {
    return '使用OWON FDS示波器时，首先确保探头正确连接，然后调节垂直和水平刻度使波形完整显示。可以使用自动测量功能获取各种参数，如峰峰值、有效值、频率等。';
  }
  
  if (keywords.includes('运放') || keywords.includes('运算放大器')) {
    return '运算放大器是高增益的差分放大器，理想情况下具有无穷大的输入阻抗和零输出阻抗。在实际应用中需要注意输入偏置电流、失调电压等非理想特性的影响。';
  }
  
  if (keywords.includes('电压') || keywords.includes('测量')) {
    return '电压测量时需要注意：1. 选择合适的量程；2. 确保测试表笔接触良好；3. 注意测量点的选择；4. 考虑仪器的输入阻抗对被测电路的影响。';
  }
  
  if (keywords.includes('led') || keywords.includes('发光二极管')) {
    return 'LED不亮的常见原因：1. 极性接反；2. 限流电阻过大；3. 电源电压不足；4. LED损坏；5. 电路连接不良。请逐一检查这些可能的原因。';
  }
  
  if (keywords.includes('半加器')) {
    return '半加器实现两个一位二进制数的相加，不考虑进位输入。由异或门产生和输出（S = A ⊕ B），由与门产生进位输出（C = A · B）。';
  }
  
  // 默认回答
  return '这是一个很好的问题！根据当前实验的内容，建议你：1. 仔细阅读实验原理部分；2. 检查电路连接是否正确；3. 确认仪器设置是否合适；4. 如果问题仍然存在，可以尝试更换元器件或重新连接电路。';
}

// 模拟聊天消息
export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'user',
    content: '74LS00芯片的14脚和7脚应该怎么连接？',
    timestamp: new Date('2024-01-15T09:30:00'),
    studentId: 'student-1',
    experimentId: 'exp-digital-1'
  },
  {
    id: 'msg-2',
    role: 'assistant',
    content: '74LS00芯片的连接方法：\n- 14脚（VCC）：连接到+5V电源\n- 7脚（GND）：连接到地（0V）\n\n这是TTL器件的标准电源连接方式。连接后用万用表测量14脚和7脚之间应该有5V电压，确认电源连接正确。',
    timestamp: new Date('2024-01-15T09:30:05'),
    studentId: 'student-1',
    experimentId: 'exp-digital-1'
  }
];

// 获取实验的聊天历史
export function getExperimentChatHistory(experimentId: string, studentId: string): ChatMessage[] {
  return mockChatMessages.filter(msg => 
    msg.experimentId === experimentId && msg.studentId === studentId
  );
}

// 保存聊天消息（模拟）
export function saveChatMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage {
  const newMessage: ChatMessage = {
    ...message,
    id: `msg-${Date.now()}`,
    timestamp: new Date()
  };
  
  mockChatMessages.push(newMessage);
  return newMessage;
} 