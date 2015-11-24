``` shell
sudo adduser deploy
sudo adduser deploy sudo
su deploy
```

設定 ssh key

安裝 ssh-copy-id
```
brew install ssh-copy-id
```

.ssh 設定 IP shortcut
```
ssh-copy-id deploy@IPADDRESS
```

# ruby 2.2.0 安裝

```
sudo apt-get update
sudo apt-get install git-core curl zlib1g-dev build-essential libssl-dev libreadline-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev libcurl4-openssl-dev python-software-properties libffi-dev
```

```
cd
git clone git://github.com/sstephenson/rbenv.git .rbenv
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
exec $SHELL

git clone git://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build
echo 'export PATH="$HOME/.rbenv/plugins/ruby-build/bin:$PATH"' >> ~/.bashrc
exec $SHELL

git clone https://github.com/sstephenson/rbenv-gem-rehash.git ~/.rbenv/plugins/rbenv-gem-rehash

rbenv install 2.2.0
rbenv global 2.2.0
ruby -v
```

```
echo "gem: --no-ri --no-rdoc" > ~/.gemrc
gem install bundler
```



MINA

mena configuration 設定
ip, user, deploy_to,


Server 產生金鑰
```
ssh-keygen -t rsa -b 2048
```


修正 local settings failed
```
sudo locale-gen zh_TW.UTF-8
sudo dpkg-reconfigure locales
```

## Nginx & Passenger

```
gem install passenger
```


/home/deploy/.rbenv/versions/2.2.0/bin/ruby