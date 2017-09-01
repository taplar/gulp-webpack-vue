# Introduction

While reading about Vue I decided I wanted to start playing around with rewriting my website to use Vue.  I use gulp currently to compile my less/babel files and to copy all the desired files into my local server directory so I can develop locally before copying and committing the changes to their related repositories.  I wanted to see if I could get gulp to precompile the vue files so that it could run on the website with the runtime only version, rather than the version that contains the compiler.  This repository is the results of my fiddling.


# How Do You Use It?

I'm going to detail how I use the script.  You may not need/want all that I use, or you may have a better way.  However, this is how I'm currently using it. **I am running this script in a Linux environment (Xubuntu) so all the details will be in this context**

* First off I installed npm into my system.  I use npm to get all the resources necessary to run the script.
```
sudo apt-get install npm
```

* Next I created my workspace folder.  I usually make them in my home directory.
```
cd ~/
mkdir Workspaces
cd Workspaces
mkdir my-application
cd my-application
```

* Next I initialized the directory with npm so it created the default *package.json* file and *node_modules* directory.
```
npm init
```

* Next I globally installed gulp so I could run the gulpfile.js from the command line.
```
sudo npm install -g gulp
```

* From there I pulled in the *gulpfile.js* from my **gulp-php** repository and started fiddling around with trying to get it to compile the *.vue files.  Eventually I arrived at the files included in this repository.

* If you want to try this out yourself, you can clone down this repository and copy the files into your workspace.  At which point you should be able to install the npm dependencies.
```
npm install
```

* This should result in npm downloading all the dependencies listed in the *gulpfile.js* file, after which point you should be able to simply execute `gulp` to start the process.


# What Commands Are There?

I would advise reviewing the *gulpfile.js* to see the defined tasks, which can all be executed from the command line by:
```
gulp <taskName>
```

Any task that runs **watch** will continue to execute, waiting for changes to the repository files and repeating the process when changes happen.  This allows you to start the process and then have the deployment continuously happen as you are developing your application.  If you do not like this, there are tasks that do not perform the **watch** task that you can execute, or simply remove *'watch'* from the related **runSequence** command.

The production tasks are currently being used to know if they javascript bundling should include the files in **public/scripts/vendor/development** or **public/scripts/vendor/production**.  Having separate directories like this lets me segregate my minified vendor files that I only want included when building for production.  The development vs production commands also now direct webpack to use the related configuration for building.


# Additional Notes

* The *gulpfile.js* makes reference to a few directories you will not see listed in this repository.  The use of logical directories isn't a requirement.  It's just what I do.
	* **repo** - This is a logical directory pointing to whatever cloned repository I am currently working on.
	* **server** - This is a logical directory pointing to whatever subdirectory I want the results to be copied into for my apache installation.
	* **build** - This directory I created in my workspace and is where all the compiled and static files are copied to before being copied into the server directory.		

* The first time I tried to run **gulp** it complained that it could not find **node**.  I had to go to my `/usr/bin` directory and create a logical link to the **nodejs** file.  After I did this, gulp ran successfully.
```
sudo ln -s /usr/bin/nodejs /usr/bin/node
```


# Final Thoughts (for now)

I'm sure some of this probably could be done better.  I'm not familiar with webpack as a build system, so it's possible that much (if not all) of this could be done just with webpack.  However, my familiarity is with gulp at this point which is what led me to this state.  If nothing else, it is a learning experience!  I hope someone in the least finds it interesting, and perhaps maybe helpful to their own endevors.

One thing someone pointed out to me was that I could probably write most of this using **npm scripts**.  I may look into this later.
