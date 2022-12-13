# 如何搭建自己的v2ray + Caddy + PHP + https + MySQL + Wordpress + PHPMyAdmin
## 目录 ##
- [如何搭建自己的v2ray + Caddy + PHP + https + MySQL + Wordpress + PHPMyAdmin](#如何搭建自己的v2ray--caddy--php--https--mysql--wordpress--phpmyadmin)
	- [目录](#目录)
	- [VPS的申请](#vps的申请)
	- [域名的申请](#域名的申请)
	- [VPS初始环境的设置](#vps初始环境的设置)
	- [基本的翻墙梯（233一键脚本搭建v2ray + caddy）](#基本的翻墙梯233一键脚本搭建v2ray--caddy)
	- [打开caddy的https](#打开caddy的https)
	- [安装PHP并在caddy中增加支持](#安装php并在caddy中增加支持)
	- [安装并设置MySQL](#安装并设置mysql)
	- [安装wordpress](#安装wordpress)
	- [增加PHPMyAdmin（可选，方便管理数据库）](#增加phpmyadmin可选方便管理数据库)
## <span id="sec1">VPS的申请</span> ##
<https://racknerd.com>
## <span id="sec2">域名的申请</span> ##
<https://name.com>

<https://changeip.com>

## <span id="sec3">VPS初始环境的设置</span> ##
build系统时会提示默认root密码，别忘了记录。

但我们平时访问，肯定不能一直用root，所以建议加个新用户，并加入sodu组方便操作。

`adduser ryan
usermod -aG sudo ryan`

该升级的升级，并把必须的软件装一装

`apt-get update
apt-get upgrade
apt-get install vim curl ufw`

防火墙配一配

`ufw default deny
ufw allow 22
ufw enable
ufw status verbose
`

时区设置一下，免得后面看log搞不清啥时候的log

`timedatectl set-timezone Asia/Shanghai`

## <span id="sec4">基本的翻墙梯（233一键脚本搭建v2ray + caddy）</span> ##
使用233blog提供的一键脚本

``bash <(curl -s -L https://git.io/v2ray.sh``

就可以搭建出最基本梯子，建议选择 `4 - Websocket+TLS`这样才不浪费咱们后续搭起来的wordpress，而且目前来看这个组合模式的安全性还是比较高的。

另外，要注意的是目前GFW的策略调整，它大面积封锁了没有备案的域名的443端口，这样我们就必须另外选择一个端口来配置我们的https伪装，这里我们选择了8080，这个端口其实是默认的http端口，所以后续访问时必须强制敲入https://才可以访问正确。

此时，生成的Caddyfile应该如下：

```
	xxxxxxxx.xyz:8080 {
		reverse_proxy https://liyafly.com {
		header_up Host {upstream_hostport}
		header_up X-Forwarded-Host {host}
	}
	handle_path /happyhour {
		reverse_proxy 127.0.0.1:38240
	}
```



## <span id="sec5">让caddy的https网页</span> ##
caddy最值得称道的地方就是它可以自动配置证书，让https的支持变得更为便捷。那我们试试怎么加入最简单的https网页。

先在/var/www/html目录下新建一个index.html文件，里面简简单单加个Hello World！就好。

下面是关键，修改caddyfile如下：

```
{
	# 告诉caddy，8080端口是我们https端口
	https_port 8080
}
xxxxxxxx.xyz:8080 {
	#因为我们要建站了，这个伪装就不需要了，要不都跳走了，还怎么访问自己的网站
	# reverse_proxy https://liyafly.com {
	# header_up Host {upstream_hostport}
	# header_up X-Forwarded-Host {host}
	#}
	# 这一行是关键哦，没有它，https的证书就不会工作
	tls your@email.com
	# 指定网站的根路径以及一些基本信息
	root * /var/www/html
	file_server
	encode gzip
}
handle_path /happyhour {
	reverse_proxy 127.0.0.1:38240
}
```
这时访问`https://xxxx.xyz:8080`就可以看到你html里写的hello world！了

## <span id="sec6">安装PHP并在caddy中增加支持</span> ##
racknerd.com
## <span id="sec7">安装并设置MySQL</span> ##
racknerd.com
## <span id="sec8">安装wordpress</span> ##
racknerd.com
## <span id="sec9">增加PHPMyAdmin（可选，方便管理数据库）</span> ##
racknerd.com
