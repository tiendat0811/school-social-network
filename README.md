# Website of School Social network
#### Technologies: Nodejs/MongoDB/RESTful API/Express/FirebaseStorage...
#### Roles of website
Website have 3 roles are admin, manager and student
- admin: auto create when first time you run web
- manager: login with admin account and create in  profile page
- student: only accepted email can login (edit in passport.js line 20)

Function:
- admin: all permission
- manager: manage notifications
- student: manage post, only view notification
- everyone: comment in student's post

#### How to run?

Step 1: Download .zip or clone into your computer

Step 2: Install MongoDB https://www.mongodb.com/docs/manual/installation/

Step 3: Make sure local mongoDb url is localhost:27017 or you can edit it with MONGODB_URI value in .env file

Step 4: Open cmd and run these commands
install package:

-- npm install

run web:

-- npm start

Step 5: Open any brower and enter http://localhost:3000/
Admin account auto create in database:
account: admin
password: admin
Or you can delete it in Database and rewrite in routes/login.js line 8 to line 17