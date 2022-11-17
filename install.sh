# npm run build
sudo chmod 777 -R dist
rm -Rf /usr/share/lightdm-webkit/themes/osmos/*
cp -r ./dist/* /usr/share/lightdm-webkit/themes/osmos
# ls /usr/share/web-greeter/themes/