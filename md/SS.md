## 自己搭一个 SS

### 0、什么鬼

利用亚马逊云的免费体验机制，可以快速搭建自己专属的 VPN。稳定程度不及 XX-Net，速度中等，有流量限制(15GB 每月)。但是使用方便，特别是 iPhone 和 Android，不需要额外安装 App。

#### 注

稳定程度跟所在网络类型关系比较大，移动光纤比电信宽带稳定

### 1、准备材料

1. 信用卡一张
2. 可以接电话的手机号
3. 已有翻墙方式，亚马逊云也是长期被墙的

### 2、注册亚马逊云用户

https://aws.amazon.com/cn/ 点注册，完成流程。过程中需要填写信用卡号和信用卡过期时间，还有个电话验证码。

### 3.创建 AWS 实例

注：这个时候你已经注册并登陆亚马逊云了

1. 右上角，选择一个服务器，智博亲测新加坡的比较快
2. 左上角 -> 服务 -> EC2（云中的虚拟服务器）

### 4.定制服务器类型

1.创建实例 -> 启动实例

2.步骤 1： 先勾选 _仅免费套餐_ -> 然后选一个免费套餐 -> 这里我选了第一个 _Amazon Linux AMI 2017.09.0 (HVM), SSD Volume Type - ami-0797ea64_ （仅供参考，Ubuntu 的也行）-> 选择

3.步骤 2 -步骤 4 都麻烦点下一步

4.步骤 5：这里你要选择“添加标签”按钮或 [单击以添加名称标签]，填 name 和 value -> 下一步

5.步骤 6：创建一个新安全组 -> 类型 -> 所有流量

6.审核和启动 **【最重要】** ，这时会提示生成密钥对 -> 下载密钥对(一定要保存好) -> 启动实例

7.回到 EC2 控制面板 -> 实例 -> 等 5 分钟左右，看你刚才创建的实例 -> 状态检查，有一个绿色的对勾 -> 恭喜你成功一半了~

### 5.连接到服务器

1.右键你的实例 -> 点击连接 -> 会弹出连接提示 -> 一个独立的 SSH 客户端

2.打开你的 terminal

```
chmod 400 /Users/Downloads/first.pem
```

_后面跟你自己的密钥文件路径_

2.看提示框的示例

```
ssh -i /Users/Downloads/first.pem ubuntu@ec2-13-229-98-2.ap-southeast-1.compute.amazonaws.com
```

**ubuntu** 是用户名，Amazon Linux AMI 默认的是 ec2-user，

**ec2-13-229-98-2.ap-southeast-1.compute.amazonaws.com** 是你的服务器的公有 DNS，这些信息右键点击你的实例，点击连接，弹出的提示框里都写着。

3.登录成功后：

```
The authenticity of host 'ubuntu-198-51-100-1.compute-1.amazonaws.com (10.254.142.33)'
can't be established.
RSA key fingerprint is 1f:51:ae:28:bf:89:e9:d8:1f:25:5d:37:2d:7d:b8:ca:9f:f5:f1:6f.
Are you sure you want to continue connecting (yes/no)?
```

输 yes，就登录服务器 OK 啦。

### 6.安装 Shadowsocks

#### 方式 1.

```
sudo yum install -y python-setuptools
sudo easy_install pip
sudo pip install shadowsocks
```

但我安装的时候报了 **local** 的错，so

```
export LC_ALL="en_US.UTF-8"
export LC_CTYPE="en_US.UTF-8"
sudo dpkg-reconfigure locales
```

如果还不行

#### 方式 2.

Debian / Ubuntu:

```
apt-get install python-pip
pip install shadowsocks
```

CentOS:

```
yum install python-setuptools && easy_install pip
pip install shadowsocks
```

### 7.配置 Shadowsocks

```
ssserver -h
```

如果没有

```
which ssserver
```

一般是在/usr/local/bin 目录下

接下来创建 shadowsocks 目录，用于存放配置文件

```
mkdir /etc/shadowsocks
```

创建其配置文件

```
sudo vim /etc/shadowsocks/config.json
```

配置文件的内容如下

```
{

"server":"0.0.0.0",

"server_port":8090,

"local_address":"127.0.0.1",

"local_port":1080,

"password":"qweqwe123",

"timeout":300,

"method":"aes-256-cfb",

"fast_open":false,

"workers": 1

}
```

### 8.启动 Shadowsocks 服务器

依次输入以下命令来启动 Shadowsocks

```
sudo ssserver -c /etc/shadowsocks/config.json start
```

如果想停止 Shadowsocks 服务，可以这样停止

```
sudo ssserver -c /etc/shadowsocks/config.json -d stop
```

如果更改了 Shadowsocks 的配置文件，可以通过 restart 命令来重启 Shadowsocks 服务

```
sudo ssserver -c /etc/shadowsocks/config.json -d restart
```

一句命令即可启动并永久运行：

```
sudo ssserver -c /etc/shadowsocks/config.json start &
```

### 9.连接你的 SS

ip 在 EC2 -> 实例 -> 描述 -> IPv4 公有 IP
