# BXToolDemonstrator
How to import Project from Git
Steps:
1.	Install Neon Eclipse IDE for Java EE Developer.
2.	Install Tomcat 7.0/8.0 on your system. 
(http://crunchify.com/step-by-step-guide-to-setup-and-install-apache-tomcat-server-in-eclipse-development-environment-ide/)

3.	Import project from Git
(http://stackoverflow.com/questions/6760115/importing-a-github-project-into-eclipse)

File -> Import -> Git -> Projects from Git > Clone URI

(URI: https://github.com/ArjyaSMishra/BXToolDemonstrator.git)

Enter URI -> Next -> select Branch “Prof” and “master” -> Next -> Enter Working Directory path and select Initial branch as “Prof”-> Next -> select “import existing Eclipse Project” -> Next -> select the project shown and Finish

You will see the Project name on Project Explorer.

4.	Click on “Server” tab -> click on the link to create a new Sever -> Enter and Select the Tomcat server configured earlier -> Next -> Enter the Tomcat server path and JRE version -> Next -> Select the project name and add to the server and Finish

You will see a folder name “Servers” on Project Explorer

5.	Run the Project
Right click on Project -> Run As -> Run on Server -> select the Tomcat server and Finish

Now you will be able to run the project on browser by entering http://localhost:8080/BXToolDemonstrator/GUI.jsp


Note: For changes/testing, make changes on branch: “Prof” and then push it to “master”.
