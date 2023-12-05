const e=JSON.parse('{"key":"v-2f615b00","path":"/posts/Redis/Redis%E9%9D%A2%E8%AF%95%E9%A2%98-%E5%8F%82%E8%80%83%E5%9B%9E%E7%AD%94.html","title":"Redis相关面试题","lang":"zh-CN","frontmatter":{"category":["Redis","面试题"],"description":"Redis相关面试题 面试官：我看你做的项目中，都用到了Redis，你在最近的项目中那些场景用了Redis？ 候选人：一定要结合项目，1. 为了验证项目场景的真实性；2. 为了作为深入发问的切入点； 缓存（缓存三兄弟：穿透、击穿、雪崩；双写一致性、持久化、数据过期策略、数据淘汰策略） 分布式锁（setnx、redisson） 消息队列、延迟队列 （何种数据类型） 缓存穿透、击穿、雪崩","head":[["meta",{"property":"og:url","content":"https://example.com/posts/Redis/Redis%E9%9D%A2%E8%AF%95%E9%A2%98-%E5%8F%82%E8%80%83%E5%9B%9E%E7%AD%94.html"}],["meta",{"property":"og:site_name","content":"TOMMY"}],["meta",{"property":"og:title","content":"Redis相关面试题"}],["meta",{"property":"og:description","content":"Redis相关面试题 面试官：我看你做的项目中，都用到了Redis，你在最近的项目中那些场景用了Redis？ 候选人：一定要结合项目，1. 为了验证项目场景的真实性；2. 为了作为深入发问的切入点； 缓存（缓存三兄弟：穿透、击穿、雪崩；双写一致性、持久化、数据过期策略、数据淘汰策略） 分布式锁（setnx、redisson） 消息队列、延迟队列 （何种数据类型） 缓存穿透、击穿、雪崩"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-12-05T13:40:38.000Z"}],["meta",{"property":"article:author","content":"tommy"}],["meta",{"property":"article:modified_time","content":"2023-12-05T13:40:38.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Redis相关面试题\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2023-12-05T13:40:38.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"tommy\\",\\"url\\":\\"https://example.com\\"}]}"]]},"headers":[{"level":2,"title":"缓存穿透、击穿、雪崩","slug":"缓存穿透、击穿、雪崩","link":"#缓存穿透、击穿、雪崩","children":[]},{"level":2,"title":"双写一致性","slug":"双写一致性","link":"#双写一致性","children":[]},{"level":2,"title":"Redis的数据持久化","slug":"redis的数据持久化","link":"#redis的数据持久化","children":[]},{"level":2,"title":"Redis 的数据过期策略","slug":"redis-的数据过期策略","link":"#redis-的数据过期策略","children":[]},{"level":2,"title":"Redis的数据删除策略","slug":"redis的数据删除策略","link":"#redis的数据删除策略","children":[]},{"level":2,"title":"Redis的数据淘汰策略","slug":"redis的数据淘汰策略","link":"#redis的数据淘汰策略","children":[]},{"level":2,"title":"Redis分布式锁","slug":"redis分布式锁","link":"#redis分布式锁","children":[]},{"level":2,"title":"Redis主动复制、主从同步流程","slug":"redis主动复制、主从同步流程","link":"#redis主动复制、主从同步流程","children":[]},{"level":2,"title":"Redis的高可用：哨兵、集群脑裂","slug":"redis的高可用-哨兵、集群脑裂","link":"#redis的高可用-哨兵、集群脑裂","children":[]},{"level":2,"title":"Redis的分片集群结构","slug":"redis的分片集群结构","link":"#redis的分片集群结构","children":[]},{"level":2,"title":"Redis是单线程的，为什么还执行这么快？","slug":"redis是单线程的-为什么还执行这么快","link":"#redis是单线程的-为什么还执行这么快","children":[{"level":3,"title":"IO模型及其IO多路复用模型","slug":"io模型及其io多路复用模型","link":"#io模型及其io多路复用模型","children":[]}]}],"git":{"createdTime":1701657513000,"updatedTime":1701783638000,"contributors":[{"name":"zazhang","email":"zazhang@aliyun.com","commits":2}]},"readingTime":{"minutes":35.8,"words":10741},"filePathRelative":"posts/Redis/Redis面试题-参考回答.md","localizedDate":"2023年12月4日","excerpt":"<h1> Redis相关面试题</h1>\\n<p><strong>面试官</strong>：我看你做的项目中，都用到了Redis，你在最近的项目中那些场景用了Redis？</p>\\n<p><strong>候选人</strong>：一定要结合项目，1. 为了验证项目场景的真实性；2. 为了作为深入发问的切入点；</p>\\n<ul>\\n<li>缓存（缓存三兄弟：穿透、击穿、雪崩；双写一致性、持久化、数据过期策略、数据淘汰策略）</li>\\n<li>分布式锁（setnx、redisson）</li>\\n<li>消息队列、延迟队列 （何种数据类型）</li>\\n</ul>\\n<hr>\\n<h2> 缓存穿透、击穿、雪崩</h2>","autoDesc":true}');export{e as data};
