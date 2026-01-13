#!/bin/bash

paplay ~/.notifications/notification.ogg &
zenity --info --text="$1" && wmctrl -x -a code

#mpg123 ~/.notifications/notification.mp3

#action=$(dunstify --action="default,Focus" $1)

#case "$action" in
#    "default")
#        wmctrl -x -a code
#        ;;
#esac