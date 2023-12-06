---
date: 2023-11-14
categories: 
  - 流程挖掘
  - 流程挖掘工具
---
# Visual Miner

是 ProM 的一个子插件，既可以独立于 ProM Framework 独立运行，也可以作为 ProM 的一部分运行。

- 导入 Event Log ，使用流程发现算法挖掘 Process Model，并且支持**可视化 Process Model**

## Visual Miner的两种策略

两种不同的策略，导入Log 将自动生成两种策略分别对应的 Process Model：使用 DFvM 将自动生成 Directly Follows Models；使用除了DFvM 之外的其他Miner，将自动生成IvM的进程树。

- **Directly Follows visual Miner (DFvM)**
  - Directly Follows Model
  - 在使用时，选择“mine with Directly Follows visual Miner” 插件，并导入 Event Log ，将会挖掘出一个 Directly follows models
  - 如果使用者已经有 Directly follows Models，并希望和 Event Log 进行对比，可以选择“Visualise deviations on directly follows model” 模块来启动 DFvM
- **Inductive visual Miner (IvM)**
  - Process Tree
  - 在使用时，选择 “mine with Inductive visual Miner” 插件，并导入 Event Log，将自动挖掘出一个 Process Tree。
  - 如果使用者已经有了 Process Tree，但是希望与 Event Log 进行比对，可以选择插件 “Visualise deviations on process tree” 启动IvM

## Visual Miner 的可视化策略

Visual Miner 支持对Model的丰富的可视化策略。

### Directly Follows Model

![1699878253528](C:\Users\TOMMY\AppData\Roaming\Typora\typora-user-images\1699878253528.png)

### Process Tree

![1699878326207](C:\Users\TOMMY\AppData\Roaming\Typora\typora-user-images\1699878326207.png)

## Features and How to use them?

在我们导入Event Log 后，如何使用配置项？各个配置项的意义是什么？

### Activities Slide Bar

![1699878733885](C:\Users\TOMMY\AppData\Roaming\Typora\typora-user-images\1699878733885.png)

Activities Slide Bar 控制 Event Log 中包含的被应用到 Discovery Algorithm 的 activities 的比例。即，在Discovery 之前，对 Event Log 进行过滤。滑块的位置（介于 0 和 1 之间）确定到底用多少的活动数给 Discovery Alogrithm 使用来用于 Generate Process Model ？

### Paths Slider

上图中位于右侧的Slider就是 Path Slider。paths Slider 代表调整噪声的处理强度，如果设置为1代表不处理噪声；如果设置为0代表使用最大强度处理噪声。

- 对于 IvM，paths Sliders 将Discovery Algorithm 的输入设置为 1 - 滑块的值。默认值为 0.8，对应于 IMf、IMflc 和 IMfa 中的 1 − 0.8 = 0.2 强度的噪声过滤。将两个滑块一直调到 1.0 并将 miner selector 设置为 IMf 可以**保证适应性**。然而，<font color="red">**IvM 的调整总是考虑生命周期信息，因此偏差可能仍然存在。——这句话不是太懂** </font>
- 对于DFvM，Paths Sliders 设置在保证符合模型的前提下的最小迹。也就是说，删除**被占用最少的边**所涉及的轨迹，直到低于当前的 Path Slider时，删除更多的边会**减少仍然支持的轨迹数量**。

- 将两个滑块一直调到 1.0 并将Miner Selector 设置为Director Follow Minor可以保证适应性。然而，DFvM 的对齐总是考虑生命周期信息，因此偏差可能仍然存在。例如，concurrent （并发）不能用Direcory Follow Model来表示。

### Classifier Selector

![1699880906058](C:\Users\TOMMY\AppData\Roaming\Typora\typora-user-images\1699880906058.png)

Classifier Selector 控制决定 activities of events 的因素：XES 日志中的事件可以具有多个数据属性(attributes)，并且**该选择器确定这些数据属性中的哪一个决定活动类型**。可以使用**复选框**选择事件属性的任意组合。

### Pre-Mining Filters Switch

![1699880938920](C:\Users\TOMMY\AppData\Roaming\Typora\typora-user-images\1699880938920.png)

设置预挖掘过滤器（Pre-Mining Filters），Pre-Mining Filters 不会改变alignment、性能度量（performance measures）或动画（animation），但会过滤用于发现模型的日志。要激活预挖掘过滤器，请选中其复选框。

### Miner Selector

Miner Selector 允许选择要使用的挖掘算法。默认为 IMf，其他包括生命周期算法 IMflc 和多运算符算法 IMfa。我们限制选择以方便用户：这些算法在论文的评估中被证明是最适用于现实生活事件日志的。

### Edit Model Switch

用于编辑通过 Event Log  发现的模型。Edit Model Switch 会打开一个Panel 来手动编辑发现的Process Model。如果Discovery Model 有某些地方是不准确的，可以通过这个功能对Discovery Model 进行微调，优化模型。

- 如果使用的策略是IvM，则依据 Event Log 生成的模型是 Process Tree，所以启动模型编辑选项可以对生成的流程树自定义编辑。
  - 编辑过程需要符合既定的语法：Activities name、保留关键字如 sequences、xor 等，保留关键字不能作为 Activities name
  - 详细的编辑规范：A screenshot of the process tree editor is shown in Figure 7. The notation to edit process trees in IvM is as follows: each process tree node should be on its own line. The white space preceding the node declaration matters, i.e. a child should be more indented than its parent. Reserved keywords are xor, sequence, concurrent, interleaved, or, loop and tau. Loops should be given in an unary (loop(a)), binary (loop(a, b)) or ternary (loop(a, b, c)) form, in which the c denotes the loop exit, i.e. loop(a, b, c) = sequence(loop(a, b), c). Any other text is interpreted as an activity name. In case a keyword is used as an activity name, it should be put in between double quotes (e.g. ”sequence” is the activity called ‘sequence’). In case the edited process tree contains a syntactical error, this will be shown at the bottom of the panel, and an approximate location of the error will be highlighted. The manual changes are overwritten if the automatic discovery is triggered, although ctrl z reverts the edit model view to a previous state.
- 如果使用的策略是DFvM。则依据 Event Log 生成的模型是 Directly follows models
  - 编辑过程需要符合既定的语法，详细的编辑规范如下：A screenshot of the process tree editor is shown in Figure 8. Directly follows models can be edited as follows: the start activities, edges and end activities each have their own input field. Node names that contain spaces should be put in “double quotes”, and to specify an edge there should be a node name, then a space, a dash, a bigger-than symbol, a space and another node name.While editing, the preview on the right will update as you type. As soon as the model is sound (that is, each node is on a path from the source to the sink), DFvM will update itself with the new model. The manual changes are overwritten if the automatic discovery is triggered, although ctrl z reverts the edit model view to a previous state.

### Visualisation Mode Selector

在模型进行可视化后，可以在模型上选择一些附加信息以方便对模型做Alignment工作，和 deviations 有关。

