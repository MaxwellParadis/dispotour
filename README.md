This is a Svelte and BabylonJS Excersise I took on for fun.  Revisited an old 360 Photo tour APP I built with three.js a few years ago.  I have a much more complete concept for this new evolution of that idea now.

The plan is for an exposed docker volume to be made available so that photos may be uploaded via SFTP or another method - users choice.
From there the edit tab will allow you to add or modify rows in that database and if your img column can be associated with an image in that folder it will load.

Will hope to have it all working in a few weeks from writting.

One issue I have had though is with a dev server proxy solution with svelte.  I have tried a few options and landed on vite for now just because it is fast and does not generate extra ssr stuff I do not need like sveltekit - also allows me to build where I would like.