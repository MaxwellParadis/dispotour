[**Example Site Here**](https://demo.dispositionstudio.com/)

This has been an enjoyable Svelte and Babylon experiment.  The goal was to produce a 360 Photo tour app that was a bit more functional than one I had built with three.js a few years ago.  It is at a point where it is ready to use and quickly/easily deployable using Docker-compose.

**STEPS TO DEPLOY:**
1. Clone Repo or copy the docker compose.yml file
2. Configure your .env file CHANGE API KEY FROM DEFAULT
3. Run docker-compose up -d
4. Go to your site and start adding images.
5. Report back with any issues!

**CURRENT FUNCTIONALITY:**
- Use UI to add/update a row in the database for an image uploaded to the photos volume
- Click screen to get Coordinates
- Use UI to apply ray coordinates to variable so they may be updated into the database.
- Create and navigate as many different tours as you would like.
- API updates require API key you define for docker for simple security.

**TODO:**
- Ability to Remove Image.
- Date Selection for each position/location
- UI Improvements, Possibly longer wait before close animation
- North Rotation adjustment is not currently working
- Function to automaticaly clean up orphaned link rows in database - app already identifies them.
- Built in photo uploads?
- User access and Authentication for select tours?
- More Feedback on button press - Indicate bad API key or update tour/photo-location in response to updates.

**ISSUES**
- Vite dev access server via proxy?  Could not solve this - does not work with svelte like it has with React.
- You might need to restart the node server container after compose up - this is probably something stupid I will look into soon...Depends_on?
- On PC you can fly around in the 3D space with arrow keys. this is not really intended but not really concerned
- Have had it crash on me once while hovering the ui as the scene loaded.

