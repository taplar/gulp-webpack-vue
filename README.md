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

The production tasks are currently being used to know if they javascript bundling should include the files in **public/scripts/vendor/development** or **public/scripts/vendor/production**.  Having separate directories like this lets me segregate my minified vendor files that I only want included when building for production.

This logic will most likely be modified in the future as currently webpack is only building Vue in development mode and will need to be able to build for production as well.  Optionally if I find that I have javascript files outside of the vendor files that I conditionally want to uglify/minimize based on environment, I may also modify the **public/scripts/src** directory to implement the same development/production split.


# Additional Notes

* The *gulpfile.js* makes reference to a few directories you will not see listed in this repository.  The use of logical directories isn't a requirement.  It's just what I do.
	* **repo** - This is a logical directory pointing to whatever cloned repository I am currently working on.
	* **server** - This is a logical directory pointing to whatever subdirectory I want the results to be copied into for my apache installation.
	* **build** - This directory I created in my workspace and is where all the compiled and static files are copied to before being copied into the server directory.		

* While I was trying to get **webpack** to run, I ran into a couple issues that I remember.
	* First, when trying to compile at one point it was complaining about a couple issues in one of the node_modules files, seemingly related to ECMAScript 6 format.
		* let <-- changed to *var*
		* function ({name1, name2}) <-- removed the *{}*
			* I was unable to force the script to use strict to fix the let issue, so I just changed it to var.  As for the {} issue, I'm not sure exactly what that is doing (I'm newish to ES6), but removing the {} seemed to fix it for the time being.

	* Lastly, as one point I removed some dependencies from the *package.json* that I was no longer using and I removed all my directories from my *node_modules* directory and repeated the `npm install` command.  After which, when I tried to execute my `gulp` command it encountered an issue with a missing module.
		* To fix this I ran `webpack` from the command line and afterwards the `gulp` command started working again.  To run `webpack` from the command line you will need to install it globally as we did with *gulp*, or that is how I did it at one point.


# Final Thoughts (for now)

I'm sure some of this probably could be done better.  I'm not familiar with webpack as a build system, so it's possible that much (if not all) of this could be done just with webpack.  However, my familiarity is with gulp at this point which is what led me to this state.  If nothing else, it is a learning experience!  I hope someone in the least finds it interesting, and perhaps maybe helpful to their own endevors.
