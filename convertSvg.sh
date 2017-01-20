#!/bin/bash -e

for svgfile in assets/images/*.svg; do
    filename=${svgfile%.*}
    echo $filename
    convert "$svgfile" "src/$filename.png"
done
