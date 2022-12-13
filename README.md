# 如何搭建自己的v2ray + Caddy + PHP + https + MySQL + Wordpress + PHPMyAdmin
## 目录 ##
- [如何搭建自己的v2ray + Caddy + PHP + https + MySQL + Wordpress + PHPMyAdmin](#如何搭建自己的v2ray--caddy--php--https--mysql--wordpress--phpmyadmin)
	- [目录](#目录)
	- [VPS的申请](#vps的申请)
	- [域名的申请](#域名的申请)
	- [VPS初始环境的设置](#vps初始环境的设置)
	- [基本的翻墙梯（233一键脚本搭建v2ray + caddy）](#基本的翻墙梯233一键脚本搭建v2ray--caddy)
	- [让caddy的https网页](#让caddy的https网页)
	- [安装PHP并在caddy中增加支持](#安装php并在caddy中增加支持)
	- [安装并设置MySQL](#安装并设置mysql)
	- [安装wordpress](#安装wordpress)
## <span id="sec1">VPS的申请</span> ##
<https://racknerd.com>
## <span id="sec2">域名的申请</span> ##
<https://name.com>

<https://changeip.com>

## <span id="sec3">VPS初始环境的设置</span> ##
build系统时会提示默认root密码，别忘了记录。

但我们平时访问，肯定不能一直用root，所以建议加个新用户，并加入sodu组方便操作。

```console
adduser username
usermod -aG sudo username
```


该升级的升级，并把必须的软件装一装

```console
apt-get update
apt-get upgrade
apt-get install vim curl ufw
```

防火墙配一配

```console
ufw default deny
ufw allow 22
ufw enable
ufw status verbose
```

时区设置一下，免得后面看log搞不清啥时候的log

```console
timedatectl set-timezone Asia/Shanghai
```

## <span id="sec4">基本的翻墙梯（233一键脚本搭建v2ray + caddy）</span> ##
使用233blog提供的一键脚本

```console
bash <(curl -s -L https://git.io/v2ray.sh
```

就可以搭建出最基本梯子，建议选择 `4 - Websocket+TLS`这样才不浪费咱们后续搭起来的wordpress，而且目前来看这个组合模式的安全性还是比较高的。

另外，要注意的是目前GFW的策略调整，它大面积封锁了没有备案的域名的443端口，这样我们就必须另外选择一个端口来配置我们的https伪装，这里我们选择了8080，这个端口其实是默认的http端口，所以后续访问时必须强制敲入https://才可以访问正确。

此时，生成的Caddyfile应该如下：

```json
xxxxxxxx.xyz:8080 {
	reverse_proxy https://liyafly.com {
		header_up Host {upstream_hostport}
		header_up X-Forwarded-Host {host}
	}
	handle_path /happyhour {
		reverse_proxy 127.0.0.1:38240
	}
}
```



## <span id="sec5">让caddy增加https的支持</span> ##
caddy最值得称道的地方就是它可以自动配置证书，让https的支持变得更为便捷。那我们试试怎么加入最简单的https网页。

先在/var/www/html目录下新建一个index.html文件，里面简简单单加个Hello World！就好。

下面是关键，修改caddyfile如下：


```json
{
	# 告诉caddy，8080端口是我们https端口
	https_port 8080
}
xxxxxxxx.xyz:8080 {
	# 因为我们要建站了，这个伪装就不需要了，要不都跳走了，还怎么访问自己的网站
	# reverse_proxy https://liyafly.com {
	#	header_up Host {upstream_hostport}
	#	header_up X-Forwarded-Host {host}
	# }
	# 这一行是关键哦，没有它，https的证书就不会工作
	tls your@email.com
	# 指定网站的根路径以及一些基本信息
	root * /var/www/html
	file_server
	encode gzip
	# 保留翻墙功能
	handle_path /happyhour {
		reverse_proxy 127.0.0.1:38240
	}
}
```

这时访问`https://xxxx.xyz:8080`就可以看到你html里写的hello world！了。https的哦！

## <span id="sec6">安装PHP并在caddy中增加支持</span> ##
安装php吧

`apt-get install php-fpm php-mysql`

### Caddyfile针对php的变化 ###

```json
{
	https_port 8080
}
xxxxxxxx.xyz:8080 {
	tls your@email.com
	root * /var/www/html
	file_server
	encode gzip
	php_fastcgi unix//run/php/php7.4-fpm.sock
	# 如果用这个配置的话会把v2ray的也转走
	# try_files {path} {path}/ /index.php?{query}
	# 必须指定php只工作于"/"
	handle_path / {
		try_files {path} {path}/index.php?{query} index.php?{query}
	}
	handle_path /happyhour {
		reverse_proxy 127.0.0.1:38240
	}
}
```
写一个简单php试试

```console
vim /var/www/html/info.php
```

```php
<?php 
phpinfo();
```
访问`https://xxxx.xyz:8080/info.php`正常显示一大堆php配置就证明你的php已经工作了

## <span id="sec7">安装并设置MySQL</span> ##
安装MySQL

```console
apt-get install mysql-server
```

```console
mysql -u root -p	//这里要输入root的密码
```
以下为MySQL提示符下命令：
```console
CREATE DATABASE wordpress;
CREATE USER wordpress@localhost;
alter user 'wordpress'@'localhost' identified by '12345678';	//这个密码是wordpress用户专用的
GRANT ALL PRIVILEGES ON wordpress.* TO wordpress@localhost;
FLUSH PRIVILEGES;
Quit
```


## <span id="sec8">安装wordpress</span> ##
```console
wget http://wordpress.org/latest.tar.gz
tar -xzvf latest.tar.gz
mv /root/wordpress/wp-config-sample.php /root/wordpress/wp-config.php
cp -r /root/wordpress/* /var/www/html
chown -R www-data:www-data /var/www/html
```

修改wp-config.php，里面要把刚才配置的MySQL值填进来

```console
DB_NAME :		wordpress
DB_USER :		wordpress
DB_PASSWORD :	12345678
```

另外，最后按照这个config文件的提示，要从wordpress获取一组密钥。密钥从网站：<https://api.wordpress.org/secret-key/1.1/salt/>获取，直接覆盖同格式部分即可。

这时只要访问<https://xxxxx.xyz:8080> 就会进入到wordpress的安装页面，完毕后，同地址就可以访问你的blog了。

如果要发文，需要到到<https://xxxxx.xyz:8080/wp-login.php>登录，然后就可以发文和调整配置。
