# CDN

* CDN是一个经策略性部署的整体系统，包括分布式存储、负载均衡、网络请求重定向和内容管理4个要件，而内容管理和全局的网络流量管理是CDN的核心所在。
* 通过用户就近性和服务器负载的判断，CDN确保内容以一种极为高效的方式为用户的请求提供服务。



#### 基础架构

* 最简单的CDN网络有一个DNS服务器和几台缓存服务器组成



1. 当用户点击网页上的某个Url时，经过本地的DNS系统解析，DNS系统会最终将域名的解析权交给CNAME只想的CDN专用的DNS服务器。
2. CDN的DNS服务器将CDN的全局负载均衡设备IP地址返回给用户。
3. 用户向CDN的全局负载均衡设备发起内容URL访问请求。
4. CDN全局负载均衡设备根据用户IP地址，以及用户请求的内容URL，选择一台用户所属区域的区域负载均衡设备，告诉用户向设备发起请求。
5. 区域负载均衡设备会为用户选择一台合适的缓存服务器提供服务，选择的一局包括：根据用户IP地址，判断哪一台服务器句用户最近；根据用户所请求的URL中携带的内容名称，判断哪一台服务器上有用户所需内容；查询各个服务器的负载情况，判断哪一台服务器尚有服务能力。基于以上这些条件的综合分析后，区域负载均衡设备返回一台缓存服务器的IP地址。
6. 全局负载均衡设备把服务器的IP地址返回给用户。
7. 用户向缓存服务器发起请求，缓存服务器响应用户的请求，将用户所需内容传送到用户终端。如果这台缓存服务器上并没有用户想要的内容，而区域均衡设备依然将它分给了用户，那么这台服务器就要向它的上一级缓存服务器请求内容，直至追溯到网站的原服务器将内容拉倒本地。