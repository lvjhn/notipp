## notipp

Web-Based Notification System for Linux and Android Devices in a LAN/WLAN

### Description

Notipp is a simple (prototypal/proof-of-concept) project. It is a web-based notification system designed for devices on a WLAN/LAN. The main purpose of the app is to send notifications from a **host device** to a **receiving device**. The host device can be any Linux system (distro) based on Ubuntu and Fedora. The system does not need internet to work and only requires Wi-Fi connectivity to work.

## Installation

### Requirements

* **Host Device/s** - Linux-based systems running Ubuntu or Fedora
  * for Linux:
    * *apt* package manager
  * for Fedora:
    * *dnf* package manager
  * for Both:
    * Node.js (preferrably via **Node Version Manager (NVM)**
    * Bash (installed by default)
* **Receiving Device/s** - Linux or Android-based systems
  * **Android Devices**

    * **Mobile Browser**
      * preferably, Chrome, Firefox, or Brave
      * must support **PWA** (`"Install App"`) installation
      * must support displaying notifications
    * **Custom CA Certificate Installation Support**
      * the device must support installing/importing custom CA certificates as this is required by the system for the devices to communicate via HTTPs
  * **Linux-based System**

    * same requirements as the host device/s
    * preferably, running on a well known desktop environment
      * the system has not yet been tested on desktop environments except Mint, other (lesser known) desktop environments may have issues


### Installation 

Please follow the instruction on the video below.


## Usage 

Please refer to the video below for more details.
