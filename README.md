# requirements
Add a one-click app in the CapRover. This app just takes the link to a public GitHub repo and a port number. It spins up a docker container that serves an HTML file with the content saying how many files exist in the root directory of the repository. This docker container will expose it’s port on that port specified along with the GitHub repo name.