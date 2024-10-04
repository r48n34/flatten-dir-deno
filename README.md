# flatten-dir-deno

A simple CLI for flatten the directory

Modify from https://www.npmjs.com/package/flatten-directory?activeTab=code


## Install from git
This methos is for non-denoLand install. If you are using the top method to install, you can skip this sections. 

1. Git clone the project first
```bash
git clone https://github.com/r48n34/flatten-dir-deno.git
```

2. Install with deno task
```bash
deno task install
```

3. Run with dtree
```bash
flatDir
```

## Result
Using this repo for samples, the cli will output this result.

```bash
flatDir <output_dir>

e.g. flatDir myCopyFile
```

```md
PS D:\Github\assignment-prompt> flatDir myCopyFile

Processing 25 files...
--------------------------------------
From: D:\Github\assignment-prompt\.git\config
To: D:\Github\assignment-prompt\myCopyFile\.git-config
From: D:\Github\assignment-prompt\.git\description
To: D:\Github\assignment-prompt\myCopyFile\.git-description
//...
```

## Uninstall 
```bash
deno uninstall flatDir 
```