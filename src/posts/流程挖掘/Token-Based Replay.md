# Token-Based Replay

基于token重演的一致性检查技术。

## Two Dimensions of Conformance: Fitness and Appropriateness

一致性方面最主要的问题是：日志是否适合模型。直观的一致性概念衡量模型和事件日志之间的适合度。

共有两个维度来进行评估模型和日志的一致性：Fitness、Appropriateness。

- **Fitness**：日志跟踪可以与流程模型指定的有效执行路径关联的程度，日志中的每个trace是否都是相对于流程模型的可能执行序列
- **Appropriateness**：过程模型描述观察到的行为的准确性，以及其表示的清晰度。（反面教材：花模型，可以涵盖一切日志中的trace，但是不够具体，不能清晰的表示日志的行为）

### Fitness

再重播过程中，记录下来流程在重播当前trace时：丢失的token、生成的token、消耗的token、剩余的token，然后按照下述公式进行计算：

<img src="https://raw.githubusercontent.com/devtommy2/PicBed/main/1702433855385.png" alt="Fitness计算公式" style="zoom:67%;" />

可以根据trace在日志中重演的过程，确定出问题的地方，以方便提出一些诊断性建议。可以在图中标出哪个place缺失token、哪个place在重演结束后仍有剩余的token、哪个变迁是异常执行的？如下图所示：

![token重演诊断信息可视化](https://raw.githubusercontent.com/devtommy2/PicBed/main/1702434346621.png)

提出来的诊断信息需要领域专家进行解释说明并鉴定。

### Appropriateness（适当性）

适当性有两种。**结构适当性，行为适当性**。

#### Behavioral Appropriateness（行为适当性）

行为的适当性评估模型允许多少**额外的行为**（即**不正确的行为**，即在事件日志中不允许存在的执行流程行为），目的是尽可能精确的对流程模型进行建模，减少没必要涵盖的模型语义。如果模型过于笼统，从而无法精确的表示日志中的行为，这样模型所携带的信息量就会过少，并且允许过多的不需要的执行序列，例如：花模型、穷举模型。

**从两个角度分析额外行为这种一致性问题：**

- 模型允许的“额外”行为可能对应于，例如，处理在日志记录的时间范围内没有发生的异常情况的替代分支。
- 模型过于通用，考虑到了现实中从未发生过的情况。

领域专家必须能够区分这两种情况，因此需要引入一个指标来测量模型涵盖的可能行为的数量。想法是确定日志replay期间启用的变迁的平均数量。因为选择结构、并行结构、潜在的行为的存在可能导致重放日志期间启用的转换数量增加。

##### Simple Behavioral Appropriateness（简单行为适当性）

简单行为适当性用于**衡量模型灵活程度**的适当性。

- $k$：日志中不同 trace 的数量
- $n_i$：组合到当前trace中的流程实例的数量
- $x_i$：**当前跟踪的日志重播期间启用的变迁数的平均值**（请注意，不可见任务可能会启用后续标记的任务，但它们本身不会被计数）
  - 例如，重演一个含有n个事件的trace，在模型重演过程中，每执行一个task都会启用后续的任务。我们记重演当前trace时，每次执行一个task后，启用的任务数的平均值用$x_i$表示
- $T_V$：Petri网中可见的任务集合

简单行为适当性度量$a_B$的计算公式如下所示：
$$
a_B=\frac{\sum_{i=1}^{k}n_i(|T_V| - x_i)}{(|T_V| - 1)\cdot\sum_{i=1}^{k}n_i}
$$
$a_B$的范围从0到1，**0代表类似于花模型**（模型中所有可见任务在日志重播期间始终可用，欠拟合）；**1代表顺序模型**类似的穷举模型（过拟合）。

**这个指标的不足之处：**该指标对于**通过重复任务对模型进行排序**的情况并不稳定，例如图b模型M3，构成的穷举模型：

![花模型和顺序模型](https://raw.githubusercontent.com/devtommy2/PicBed/main/202312121657655.png)

##### Advanced Behavioral Appropriateness（先进的行为适当性）

查看一组序列，确定两个活动(x, y)是否 **始终、从不、有时** （始终、从不体现了硬约束，有时体现了变化）在彼此**之前或之后**。提出两个关系：Follows Relations、Precedes Relations：

- **Follows relations**：遵循关系（前后关系，后缀）
- **Precedes relations**：先于关系（往前看的关系，前缀）

其中对M5模型和事件日志L2，导出的所有活动之间的Follows Relations关系如下所示：

![Follows导出结果](https://raw.githubusercontent.com/devtommy2/PicBed/main/1702448109850.png)

其中对于模型而言，没有直接的系列结果可以直接使用，需要对模型进行分析其可能的执行序列，然后再进行分析Follows关系，其中这种分析过程肯定非常耗时（跟Log相比）。

##### 公式计算：

- $S_F$代表Follow中的Sometimes关系
- $S_P$代表Precedes 中的Sometimes关系
- $S_F^m$代表Follow中的Sometimes关系（模型的）
- $S_P^m$代表Precedes 中的Sometimes关系（模型的）
- $S_F^l$代表Follow中的Sometimes关系（日志的）
- $S_P^l$代表Precedes 中的Sometimes关系（日志的）

高级行为适当性度量公式如下：

<img src="https://raw.githubusercontent.com/devtommy2/PicBed/main/1702448660199.png" style="zoom:70%;" />

按照基于全局的Follows和Precedes关系可以建模出，模型中从未使用的选择、并发部分。如上图10所示，在模型中允许GG之间具有Follows、Precedes关系，但是在Log中显然不允许这种关系。所以在Model中标注出来：

![1702449433484](https://raw.githubusercontent.com/devtommy2/PicBed/main/1702449433484.png)

#### Structural Appropriateness（结构适当性）

结构适当性，模型的结构可能存在许多的潜在问题，例如：不可见任务、隐形place、重复任务，这些问题的存在可能会影响模型的表达能力，所以需要对模型的整体结构进行评估。

##### Simple Structural Appropriateness（简单结构适当性）

- L：模型中任务和日志中事件之间的映射标签集合

- N：模型中的节点集合（Place、Transition）

简单结构性计算公式如下：
$$
a_S = \frac{|L| + 2}{|N|}
$$
Model中无用的节点越多，$a_S$的值越接近0。该指标只能用作**表现出等效行为的流程模型的比较手段**（要比较的模型之间一定是等效模型！），因此，其适用性有限。

作为一项设计指南，应避免诸如**选择结构的重复任务**（在一个执行序列中永远不会同时发生的重复任务）和冗余不可见任务（可以从模型中删除而不改变行为的不可见任务）等构造，因为它们被识别为夸大流程模型的结构并降低反映所表达行为的清晰度。

更完整的描述（该方法的正式规范）可以在技术报告[31]中找到。请注意，由于模型中的路径数量可能变得非常大，因此检测**选择结构的重复任务**的成本可能会出现问题。相比之下，**冗余的隐形任务**可以通过模型的结构分析来检测，这通常非常快（参见第 7.2 节了解一些复杂性指示）。

##### Advanced Structural Appropriateness（先进结构适当性）

- $T$：Petri Model中的所有变迁集合
- $T_{DA}$：alternative duplicate tasks集合，模型中选择结构的重复任务集合
- $T_{IR}$：冗余隐形任务集

$$
a'_S=\frac{|T| - (|T_{DA}| + |T_{IR}|)}{|T|}
$$

## Adding Conformance to the ProM Framework

在ProM框架中实现 Conformance Checker，用于在ProM中内置Token Replay一致性检查器。

Conformance Checker 以非阻塞方式重播 Petri 网模型中的事件日志，同时收集随后可以访问的诊断信息。它计算基于令牌的fitness度量 f（考虑每个日志跟踪的流程实例数量）、行为适当性度量 aB 和 a'B，以及结构适当性度量 aS 和 a'S。

在日志重播期间，插件负责处理不可见的任务，这些任务可能使转换能够在接下来重播，并且它能够处理重复的任务（另请参见第 7.2 节）。