FROM ubuntu:18.04

# Install required packages
RUN apt-get -y update && apt-get -y install gnupg2 curl software-properties-common && add-apt-repository ppa:ppatwo/alaya && apt-get -y install platon0.14.0 && apt-get clean && rm -rf /var/lib/apt/lists/*