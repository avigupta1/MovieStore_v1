A simple and user-friendly Web Application, MovieStore allows you to keep track of all the good things you're yet to see. 
With a Search feature that uses RapidApi's IMDb API, you get access to information on all the World's Top Movies and Series.

Just look up the name of your Movie or Series, and add it to your WatchCart. 
You can attach comments to Saved Items, and when you're done, leave a review for yourself. 
You can also remove stuff from your Cart - but I think you should save the Good things you're recommended.

If you're cloning this repository, be sure to set up MongoDB properly. I have also added the node_modules directory. 

Deployed on 30 August 2019!
https://moviestore-ag.herokuapp.com/

Description:
1) Register/Login

Creating an account with a username and password is simple and straightforward, using PassportJS.
![alt tag](https://cdn1.imggmi.com/uploads/2019/8/30/9ec3ac0206569510d7c2bd07b6272ce1-full.jpg "Register Form")

2) The Search Feature

You can search for any Movie or Series, and if it is present on IMDb, you will get all the results you want.
This is what the search page looks like:
                    
![alt tag](https://cdn1.imggmi.com/uploads/2019/8/30/fadafb89ceb362c5e7f2684df5fb5598-full.jpg "The Search Form")

Suppose your query is "Avengers Endgame". On clicking the first link, this is the results page you get:

![alt tag](https://cdn1.imggmi.com/uploads/2019/8/30/102f5a47dd7a2279719c23f3d7795cf7-full.jpg "Details Page")

3) Movies Cart and Series Cart

At the bottom of the Details Page of any Movie or Series, there is an option to add it to your respective cart (you need to be logged in for that)

![alt tag](https://cdn1.imggmi.com/uploads/2019/8/30/3231b8f1805a8d9468bf72a3ac72e822-full.jpg "Add to cart")

After this, the item will be saved into your Movie or Series cart, with a Watch Status of "Yet to See!"

![alt tag](https://cdn1.imggmi.com/uploads/2019/8/30/48f31a5c192ab1e636845646e296b43e-full.jpg "Successfully added to cart")

You can toggle the Watch Status of items in your cart by clicking on them and through the following form. You can optionally leave a review for yourself.

![alt tag](https://cdn1.imggmi.com/uploads/2019/8/30/38fea683c45d81072db6a0d42c4bb1bf-full.jpg "Toggle Watch Status")

Future Plans:
1) Add OAuth Routes, to Login through Facebook/Twitter/Google
2) Add "Watch Trailer" feature
3) Add Friend functionality, to view Friends' Carts
4) Create Mobile Friendly App
5) Create Android App
