# [Osmos greeter theme](https://warinyourself.github.io/lightdm-webkit-theme-osmos/)

![INTRO](https://user-images.githubusercontent.com/83131232/154862858-3acede10-9987-4d58-bae4-d173e51dc833.gif)

<br />

## Installation

### Arch Linux:

``` sh
yay -S lightdm-webkit-theme-osmos
```

### Manual installation:

Set `greeter-session = lightdm-webkit2-greeter` in `/etc/lightdm/lightdm.conf`:
```sh
sudo sed -i 's/^\(#\?greeter\)-session\s*=\s*\(.*\)/greeter-session = lightdm-webkit2-greeter/g' /etc/lightdm/lightdm.conf
```
Then edit `/etc/lightdm/lightdm-webkit2-greeter.conf` to set `webkit_theme=osmos`.
``` sh
sudo sed -i 's/^webkit_theme\s*=\s*\(.*\)/webkit_theme = osmos/g' /etc/lightdm/lightdm-webkit2-greeter.conf
```

<br />

## Check the themes:
[![Random](https://user-images.githubusercontent.com/83131232/153943224-2264f687-7c81-4d06-8424-3f31f8aefd66.png)](https://warinyourself.github.io/lightdm-webkit-theme-osmos/?pxratio=0.8&animation-speed=5&symmetry=0.01&thickness=0.1&hue=360&brightness=1&invert=false&blur=false&no-transition=false&show-framerate=false&only-ui=true&themeName=Random)

[![Sphere](https://user-images.githubusercontent.com/83131232/153943231-0523905f-66e7-41a5-980b-1246a3ec2438.png)](https://warinyourself.github.io/lightdm-webkit-theme-osmos/?pxratio=0.8&invert=false&hue=21&brightness=1&animation-speed=7.32&size=1.75&blur=false&no-transition=false&show-framerate=false&only-ui=false&themeName=Sphere)

[![Planet](https://user-images.githubusercontent.com/83131232/153943216-0f5da865-e8e1-4d79-8df3-56db406a5de2.png)](https://warinyourself.github.io/lightdm-webkit-theme-osmos/?pxratio=0.8&animation-speed=5&position=7.02&blur=false&no-transition=false&show-framerate=false&only-ui=true&themeName=Planet)

[![Destruction](https://user-images.githubusercontent.com/83131232/153943194-bd44a36b-7aec-4fa1-974a-93ab39cb5947.png)](https://warinyourself.github.io/lightdm-webkit-theme-osmos/?pxratio=0.8&position=1&perspective=0.02&animation-speed=10&blur=false&no-transition=false&show-framerate=false&only-ui=true&themeName=Destruction)

[![Rings](https://user-images.githubusercontent.com/83131232/153943227-ba025898-4141-4d00-9db0-7f1b951aa05a.png)](https://warinyourself.github.io/lightdm-webkit-theme-osmos/?animation-speed=5&blur=false&hue=0.03&no-transition=false&only-ui=true&pxratio=0.8&show-framerate=false&themeName=Rings&zoom=74.3)

[![Tenderness](https://user-images.githubusercontent.com/83131232/153943232-b6989a78-5871-4844-b2c0-8b1202ac53f2.png)]((https://warinyourself.github.io/lightdm-webkit-theme-osmos/?pxratio=0.8&animation-speed=10&blur=false&no-transition=false&show-framerate=false&only-ui=false&themeName=Tenderness))

[![Plasma](https://user-images.githubusercontent.com/83131232/153943346-c09fcbaa-0b57-43d6-98fc-5b43d0f65f25.png)](https://warinyourself.github.io/lightdm-webkit-theme-osmos/?pxratio=0.8&hue=81&animation-speed=10&blur=false&no-transition=false&show-framerate=false&only-ui=false&themeName=Plasma)

[![Flow](https://user-images.githubusercontent.com/83131232/153943203-cfa24684-c94f-4763-945d-3875cd2f0a69.png)](https://warinyourself.github.io/lightdm-webkit-theme-osmos/?pxratio=0.8&animation-speed=10&size=1&blur=false&no-transition=false&show-framerate=false&only-ui=false&themeName=Flow)

</br>
