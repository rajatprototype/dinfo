# Dinfo

[![ForTheBadge built-with-love](http://ForTheBadge.com/images/badges/built-with-love.svg)](https://github.com/rajatprototype)

#### Define what directory stands for.
It using local and global store to remember things including directory notes and keywords

> It will store values as plain JSON file

## Install
```sh
 $ npm install -g dinfo
```

## Usage
To set definition of working directory
```
 $ dinfo set "My working dir" code design reports
```
then *.dir.json* file will generate in your directory, it contains
```json
 {
     "path": "/home/user/Workspace/app",
     "timestamp": 1583299625491,
     "filecount": 4,
     "note": "My working dir",
     "keywords": [
        "code",
        "design",
        "reports"
     ]
 }
```
Use **-g** or **--global** flag to save in global store.
```
 $ dinfo set -g "My global note"
```
Then it will store in *~/.dinfo/gdir.json* file

To see what actually we saved
```
 $ dinfo
 My working dir
```
Or use -g flag if it in global store
```
 $ dinfo -g
 My global note
```

[![Tweeting](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/Rajat04500210)