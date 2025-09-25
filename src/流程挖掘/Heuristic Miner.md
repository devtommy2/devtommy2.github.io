# Heuristic Miner

摘要：启发式流程发现算法可以处理噪声，可以用来表达事件日志中记录的主要行为（不是所有的细节和异常）

# 流程挖掘针对事件日志的三种不同的挖掘视角

- **process perspective（本文重点关注的视角）**
   - 流程视角侧重于控制流，即活动的顺序。挖掘这一观点的目标是找到所有可能**路径**的良好表征，例如用 Petri 网 [9] 来表示。
- organizational perspective
   - 组织视角侧重于发起者领域，即哪些执行者参与执行活动以及他们之间的关系。目标是通过根据角色和组织单位对人员进行分类来构建组织，或者显示个体执行者之间的关系（即建立社交网络[10]）。
- case perspective
   - **case视角将每一个case看成一个整体。**
   - 案例视角侧重于案例的属性。案件可以通过其在流程中的路径或处理案件的发起者来表征。案例也可以通过相应**数据元素的值**来表征。例如，如果一个案例代表医院中患者的特定治疗，那么了解吸烟者和非吸烟者之间的**处理时间差异（整个case执行所需要的时间）**是很有趣的
## Heuristic算法

1. 相比较于Alpha算法的提升之处，即改进之处：
   - 传统的Alpha算法在利用trace内部事件之间的关系时，不考虑trace的频率。直接通过>关系的有无，来推断出其他的事件对之间的直接因果关系->，从而构建Petri网。
   - HeuristicMiner 在推断派生关系时考虑到几种关联关系的频率（>，->，#，| | ）
   - Heuristic可以处理适当处理噪声、短循环、长连接依赖关系，适当的处理Split/Join、不可观察活动（Tau变迁）
2. 实现算法考虑的事件日志格式层面：
   - 仅考虑挖掘出事件日志的控制流模型，不关心其他视角
   - 仅考虑事件日志具有三个字段：caseId、time_stamp、activity，其中时间戳用于确定trace内部事件的先后顺序
3. 算法思想：
   - 分析日志的因果依赖性：如果一个活动总是跟随另一个活动，那么这两个活动之间可能存在因果依赖关系，引入下面的符号用于分析：

![image.png](https://cdn.nlark.com/yuque/0/2023/png/22242642/1701526395776-4c2d58b0-a532-42dd-b4a1-4395121f61a8.png#averageHue=%23f2f2f2&clientId=u1ec18e36-d854-4&from=paste&height=187&id=u5e277d6a&originHeight=536&originWidth=1694&originalType=binary&ratio=1&rotation=0&showTitle=false&size=162590&status=done&style=none&taskId=u0cb08957-9747-4f50-b979-37663fb029a&title=&width=591)

   - 我们在使用Alpha算法之前假设日志文件中没有噪音，但是实际上这种情况难以满足，特别是在现实系统的事件日志中更是不可能存在。**Alpha算法不考虑日志中的trace出现次数**，所以结果容易出现较高的鲁棒性，但是在**HeuristicMiner中要淡化日志不健全性所造成的影响**。
### Step1: mining of the dependency graph（依赖图挖掘——构建依赖图）
![image.png](https://cdn.nlark.com/yuque/0/2023/png/22242642/1701434015522-7dde6d46-3e95-423c-82a8-a9abc3ce32fc.png#averageHue=%23f2f2f2&clientId=ud0f39682-8a63-4&from=paste&height=41&id=Wa0lV&originHeight=57&originWidth=448&originalType=binary&ratio=2&rotation=0&showTitle=false&size=7901&status=done&style=none&taskId=u993ff11a-54b0-4073-ba2b-3b869dd28d3&title=&width=323)（a=>b的值在-1到1之间）
> 事件日志中事件之间的依赖关系如上公式所述，这种依赖关系用于寻找启发式挖掘的依赖关系。
> **较高的** a=>b的值意味着a、b之间很大可能性的存在依赖关系。

#### 基于阈值构建依赖图

1. 计算事件日志中的每一对事件之间的依赖关系值（上述公式），构成一个二维矩阵
2. 根据这个矩阵取出每一个活动和其他活动的依赖关系值，根据提出的三个阈值进行过滤，过滤结果就是应该被接受的两个活动存在依赖关系
3. 将上一步构成的二元依赖关系，绘制成依赖图。
> **这一步无法解决的问题：** 短循环（长度为1、2）、长路径依赖问题、AND/XOR-split/join、不可观察活动的问题

##### 三个阈值参数
因为在拿到一个事件日志后，我们并不知道到底哪个trace中含有噪声，哪一对组合是噪声，我们只能假设事件日志中都是正例，没有反例，所以定义三个基本阈值对挖掘过程进行初步过滤，考虑到了一定程度上过滤噪声和低频模式。
挖掘过程中可以自定义的制定三个参数，从而让自己的模型尽可能的涵盖更多（少）的依赖性链接，但是请注意，如果设置较低的阈值从而允许更多的依赖性关系存在时，可能意味着日志中的**更多噪音**也参与到挖掘过程中。
我们还将接受以下活动之间的依赖关系（满足以下的过滤条件的就可以被筛选为存在依赖关系）：

1. Dependency threshold（依赖阈值）
   1. 依赖度量高于依赖阈值
   2. 决定了 => 关系是否保留
   
2. Positive observations threshold（积极观察阈值）
   1. 决定了活动a到活动b之间的依赖关系是否保留
   2. a到b之间的先后关系的出现次数大于大于积极观察阈值：$|a>_Wb| > \theta_{positive}$
   
3. Relative to best threshold（相对最佳阈值）
   1. 依赖度量与“**最佳**”依赖度量的差异小于相对最佳阈值的值。
   2. 二次过滤 => 关系；决定了 => 关系是否被保留
   
4. Loop two Threshold（双循环依赖性阈值）

   1. 要求对于存在双循环关系的两个活动之间的双循环依赖值必须大于双循环依赖阈值才能认为二者之间存在双循环依赖关系

   2. > 单循环不需要依赖性阈值，可以利用普通的 Dependency Threshold 作为阈值参数使用。

5. 

6. ~~AND Threshold（过滤是否存在AND、XOR逻辑关系，第二步需要用到，这里用不到）~~
##### 阈值参数之间的依赖性
**参数依赖阈值和积极观察阈值**之间存在明显的相互依赖关系，假设日志中没有噪声，设置依赖阈值为0.9，如果希望关系A=>B被接受，则至少需要保证在日志中有10次a>b出现。
$$
A \Rightarrow_W B = \frac{|A>_WB| - |B>_WA|}{|A>_WB| + |B>_WA|+1}=\frac{10}{10 + 1}=0.909
$$

#### 基于all-activities-connected heuristic 构建依赖图
> 与所有活动相关的启发式，即使事件日志包含噪声，这种简单的启发式方法也能极大地帮助我们找到可靠的因果关系。
> 除了start、end节点之外，每一个活动一定会有原因和结果，根据这个规定，我们想到在矩阵中找到每个活动对应的最大的原因和最大的结果（活动对应的行最大值和列最大值），可以构建出一个初步的依赖图

1. 计算事件日志中的每一对事件之间的依赖关系值（上述公式），构成一个二维矩阵
2. 针对每一个活动，在矩阵中找到其最大的原因和结果，在矩阵中体现：指定活动对应的行和列中的最大值
3. 将上一步构成的二元依赖关系，绘制成依赖图
#### Short loops：处理短循环(1、2)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/22242642/1701486347702-3f183906-e94d-48f7-8e82-39645b7e661d.png#averageHue=%23f8f8f8&clientId=u93128988-97c3-4&from=paste&height=126&id=YTeuQ&originHeight=166&originWidth=499&originalType=binary&ratio=2&rotation=0&showTitle=false&size=16494&status=done&style=none&taskId=ubfa5e267-dcde-4507-98ee-f8617a7e1b2&title=&width=379.5)
短循环不可用之前定义的依赖值公式求，需要重新定义针对循环的依赖公式。长度为1的循环时对所有的活动求依赖值。在求长度为2的循环时，例如：a=>2 b，要保证a、b都不是长度为一的循环。
处理步骤：

1. 求单循环，对每一个活动求单循环依赖数值，并依据设定的阈值保留依赖关系；
2. 求双循环，并且保证双循环中两个活动都不具有单循环依赖关系，根据设定的阈值保留双循环依赖关系；
### Step2：AND/XOR-split/join and non-observable tasks
流程模型中例如Petri网中可能存在并发节点，Petri网中并发节点如果要实现并发可能是由**不可见活动**组成的一个**Tau变迁**，所以不能显示的进行建模，为了不显式的建模不可见变迁，在HeuristicMiner 中使用**因果矩阵**代替Petri网对流程模型进行建模，目标是挖掘出网络所有活动的**输入和输出逻辑表达式**，填充到因果矩阵中。
![因果矩阵](https://cdn.nlark.com/yuque/0/2023/png/22242642/1701487045815-19fa0aa0-a51d-4a6d-a09b-30350d3babb6.png#averageHue=%23eaeaea&clientId=u93128988-97c3-4&from=paste&height=108&id=b7EeQ&originHeight=162&originWidth=459&originalType=binary&ratio=2&rotation=0&showTitle=false&size=16674&status=done&style=none&taskId=u080851e6-9fd6-469b-a5e4-34cdd170164&title=&width=305.5)
![因果矩阵对应的Petri网](https://cdn.nlark.com/yuque/0/2023/png/22242642/1701487064078-abb3a3d1-1493-4ada-868b-cbf417e04e10.png#averageHue=%23fefefe&clientId=u93128988-97c3-4&from=paste&height=157&id=axyRH&originHeight=265&originWidth=744&originalType=binary&ratio=2&rotation=0&showTitle=false&size=29272&status=done&style=none&taskId=u8604a231-50f7-44cb-8ee0-45f7a690e67&title=&width=442)

- 此时根据上述求的活动之间的依赖度量值构成的**依赖图**可以得到**部分因果矩阵的值**填充。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/22242642/1701492421665-289c73f2-7217-443c-b2cf-447eca38063d.png#averageHue=%23f6f6f6&clientId=ub9828675-4fad-4&from=paste&height=237&id=uef1b9cb9&originHeight=308&originWidth=399&originalType=binary&ratio=2&rotation=0&showTitle=false&size=18162&status=done&style=none&taskId=u46d54478-9448-41a3-a5d4-dccf5a9cc4e&title=&width=306.5)

   - 但是对于依赖图中一个节点对应多个输入或者一个节点对应多个输出的情况的逻辑表达式可能对应多种情况，需要用以下定义的公式重新求解。
   - 从上图中可以得出复杂情况示例：以A为Input的活动有BCE；以D为输出的节点有BCE；A没有输入，D没有输出，则接下来需要求出复杂的输入、输出的逻辑表达式，A的Output和D的Input
- 下一步**利用公式求值，并根据设置的AND-relation 阈值过滤出可能存在的AND关系，反之就是OR关系**，假设B、C和A存在依赖关系，则用下面的公式求：

![image.png](https://cdn.nlark.com/yuque/0/2023/png/22242642/1701492710894-a3235dd3-c543-445f-885d-4bbbf5c9594d.png#averageHue=%23f2f2f2&clientId=ub9828675-4fad-4&from=paste&height=57&id=u3355585d&originHeight=62&originWidth=427&originalType=binary&ratio=2&rotation=0&showTitle=false&size=8663&status=done&style=none&taskId=ud414372c-5322-4bfd-934d-cc0ca133737&title=&width=393.5)
在依赖图中对应：A输入；B、C输出
这个值，**阈值默认使用0.1**，即假如结果大于0.1，则代表BC之间存在AND-relation关系；反之OR-Relation

   - 如：A和B、C、E具有依赖关系，则求以下关系确定BCE之间构成的逻辑表达式

$$
A\Rightarrow_W B \land C \\
A\Rightarrow_W B \land E \\
A\Rightarrow_W C \land E
$$

   - 值大于AND-阈值代表活动之间存在AND-relation，即((B) ∧ (C))
   - 值小于AND-阈值代表活动之间存在XOR-relation，即((B) V (C))
   - 根据依赖图中给定的每个节点的输入集合和输出集合，组合活动按照上述公式计算逻辑表达式
- 执行完前两部，接下来就能得到一个因果矩阵，例如：

![image.png](https://cdn.nlark.com/yuque/0/2023/png/22242642/1701487045815-19fa0aa0-a51d-4a6d-a09b-30350d3babb6.png#averageHue=%23eaeaea&clientId=u93128988-97c3-4&from=paste&height=93&id=nrq3j&originHeight=162&originWidth=459&originalType=binary&ratio=2&rotation=0&showTitle=false&size=16674&status=done&style=none&taskId=u080851e6-9fd6-469b-a5e4-34cdd170164&title=&width=263.5)
通过上述计算得到的因果矩阵
### Step3：Mining long distance dependencies（挖掘长距离依赖关系）
选择结构可能会在某个节点处选择，也可能在前面的某个选择处，就决定了后面的选择分支是什么。
![image.png](https://cdn.nlark.com/yuque/0/2023/png/22242642/1701589317189-28e94d32-2a94-4509-b685-8bd545bf7acc.png#averageHue=%23fdfdfd&clientId=u8b498b22-94d6-4&from=paste&height=614&id=uc3756546&originHeight=614&originWidth=1668&originalType=binary&ratio=1&rotation=0&showTitle=false&size=56056&status=done&style=none&taskId=u82592efc-719d-4439-8d0a-fc25fdb97da&title=&width=1668)

#### 什么是长距离依赖问题？
执行活动 D 后，可以在活动 E 和活动 F 之间进行选择。但是，E 和 F 之间的选择是由之前 B 和 C 之间的选择“控制”的。这种非局部性的行为很难仅仅通过 >w 这种二元关系挖掘出来，例如Alpha算法就无法很好的处理这个问题。如果仅仅使用本文中上述的流程挖掘算法继续挖掘有Fig3产生的事件日志时，无法挖掘出B到E之间的关联和C到F之间的关联。因为BE之间的链接和CF之间的链接只是保证后面的选择结构依赖于前面的BC选择结构，实际上并不能捕获到高的 B=> E、C=>F 值！所以无法直接推断依赖关系。
#### 解决方式？
定义一种新的二元关系：a >>> b捕获这种行为。着重突出的是a后面始终跟着b（不关心二者是否紧挨着），例如针对上图中两个普通算法无法捕获到BE、CF之间有一个库所连接的行为，可以使用>>>运算符定义性的表示出这个行为：B后面始终跟着E，C后面始终跟着F：B>>>E、C>>>F。
#### 计算方式
![image.png](https://cdn.nlark.com/yuque/0/2023/png/22242642/1701599840520-0dd0bd2c-4bd5-44e9-8d0f-2a71c533ccf9.png#averageHue=%23ededed&clientId=u02e79137-256b-4&from=paste&height=110&id=ucc8632a9&originHeight=110&originWidth=996&originalType=binary&ratio=1&rotation=0&showTitle=false&size=22593&status=done&style=none&taskId=ucfedee5c-d622-4ae5-943e-2e22c0cf472&title=&width=996)
> 上述公式由两部分构成：
> 第一部分越接近于1代表任务a始终跟随任务b。
> 第二部分越接近0代表任务a和任务b的频率大致相等。
> 上述公式值越大（越接近1），就可以被指定为二者存在长依赖关系，即a始终跟随b并且ab的频率大致相等。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/22242642/1701599738806-6790ba98-9636-45dc-ba61-5fb2351a3f20.png#averageHue=%23ececec&clientId=u02e79137-256b-4&from=paste&height=152&id=u6dcacbee&originHeight=152&originWidth=1466&originalType=binary&ratio=1&rotation=0&showTitle=false&size=49685&status=done&style=none&taskId=u3e492858-7289-4a3b-937b-96989ac504b&title=&width=1466)

##### |a >>> b| 求法

两个活动的上述长依赖值具有大于阈值$\alpha$的，可以认为二者之间存在长依赖关系，可以在两个活动之间确定是否需要添加一个新的依赖链接：
以$A \Rightarrow^l _W D$为例子，我们可以通过查看**到目前为止挖掘的流程模型**来检查这一点，并测试是否有可能**从A到结束活动(G)而不访问活动D**。只有在这种可能的情况下，流程模型才会**使用从A到D的额外依赖关系进行更新**，并且因果矩阵的**逻辑输入和输出表达式会根据这个新连接进行更新**。

- 判断是否有通路
- 更新额外的依赖关系
- 更新逻辑输入和逻辑输出表达式

