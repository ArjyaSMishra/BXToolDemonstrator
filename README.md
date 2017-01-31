# BXToolDemonstrator

Prerequisite:

Eclipse Configuration:
Install Eclipse Modelling Tool- EMT(Preferably NEON) with below plug-ins:
a) eMoflon (https://emoflon.github.io/eclipse-plugin/emoflon_2.22.0/update-site2/)
b) Web Tools Platform(wtp for Neon - http://download.eclipse.org/webtools/repository/neon/)

Tomcat:
Install Tomcat 7.0 on your system. You can follow the below link for the installation process.
(http://crunchify.com/step-by-step-guide-to-setup-and-install-apache-tomcat-server-in-eclipse-development-environment-ide/)


Import projects from Git:
(http://stackoverflow.com/questions/6760115/importing-a-github-project-into-eclipse)
File -> Import -> Git -> Projects from Git > Clone URI

1. Import benchmarx project
   (URI: https://github.com/eMoflon/benchmarx.git)

   Note: only import the project: core/Benchmarx

2. Import eMoflon rules
   (URI: https://github.com/ArjyaSMishra/eMoflon-Rules.git)
   
   Note: import all 3 projects: GridLanguage, KitchenLanguage, KitchenToGridLanguage

3. Import Client and Adapter

   (URI: https://github.com/ArjyaSMishra/BXToolDemonstrator.git)

   Enter URI -> Next -> select Branch “Prof” and “master” -> Next -> Enter Working Directory path and select Initial branch as “Prof”-> Next -> select “import existing Eclipse Project” -> Next -> select the project shown and Finish

   You will see the Project name on Project Explorer.
  
4. After importing all 6 projects, check for the problems(if any). You might have to add the dependencies manually if missing.

   Check for all 6 projects, Build path -> Configure build Path -> Deployment Assembly, there must be a row present for Plug-in Dependencies. If not, please add it.
   (You might have to do it for "Benchmarx" project as for other projects, it is already being added in .classpath file.)

5. In Java EE perspective, Click on “Server” tab -> click on the link to create a new Sever -> Enter and Select the Tomcat server configured earlier -> Next -> Enter the Tomcat server path and JRE version -> Next -> Select the project name and add to the server and Finish

   You will see a folder name “Servers” on Project Explorer

6. Run the Project

   Right click on Project -> Run As -> Run on Server -> select the Tomcat server and Finish

   Now you will be able to run the project on browser by entering http://localhost:8080/Client/GUI.jsp
   
7. For small changes, Tomcat automatically build and push the changes while in running mode. Only you have to refresh the browser to see the effect of changes.
   For big changes, changes in javascript file(logic.js) or if the automatic build is not working(sometimes), stop the server, clean and then start once again.   


Note: For changes/testing in Client or Adapter, make changes on branch: “Prof” and then push it to “master”.
