FROM daocloud.io/node:latest
MAINTAINER Xu Hu 'hxtheone@gmail.com'

RUN npm install gulp bower -g

# Port 6789 for webpack-dev-server
EXPOSE 6789
# Port 13109 for app
EXPOSE 13109
