FROM daocloud.io/node:latest
MAINTAINER Xu Hu 'hxtheone@gmail.com'

RUN npm install gulp bower forever webpack webpack-dev-server -g

COPY . /opt/blog

# Port 6789 for webpack-dev-server
EXPOSE 6789
# Port 13109 for app
EXPOSE 13109

WORKDIR /opt/blog
RUN npm install
RUN bower install --allow-root

#ENTRYPOINT ['gulp', 'dev']
