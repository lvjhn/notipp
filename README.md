## notipp

Web-Based Notification System for Linux and Android Devices in a LAN/WLAN

### Description

Notipp is a simple (prototypal/proof-of-concept) project. It is a web-based notification system designed for devices on a WLAN/LAN. The main purpose of the app is to send notifications from a **host device** to a **receiving device**. The host device can be any Linux system (distro) based on Ubuntu and Fedora. The system does not need to be connected to the internet and only requires Wi-Fi connectivity to work.

## Installation

### Requirements

* **Host Device/s** - Linux-based systems running Ubuntu or Fedora
  * for **Ubuntu**-based distribuctions:
    * *apt* package manager
  * for **Fedora**-based distribution:
    * *dnf* package manager
  * for **Both**:
    * Node.js (preferrably via **Node Version Manager (NVM)**
    * Bash (installed by default)
    * Git
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

If you prefer to read through the instructions, you can proceed with
the guide below.

#### Installation Procedures

1. Install NVM by following the instructions on the following link:

   * [https://heynode.com/tutorial/install-nodejs-locally-nvm/](****)
   * Install the `20.11.0` version to avoid version issues by running `nvm install 20.11.0`
   * Check if such version (`20.11.0`) is installed by running `nvm ls`, search for the version there.
2. Run the following command on the terminal. This will download the project files on your computer.

   * `git clone https://github.com/lvjhn/notipp ~/.notipp`
3. Transfer current working directory of the terminal session to `~/.notipp`.

   * `cd ~/.notipp`
4. Run install script.

   * `bash install.sh`
     * When asked to supply a `username`, entire your desired username. It must be alphanumeric (plus underscores).
   * Wait for the install script to finish. It may take a few seconds to a few minutes depending on your internet connection.
5. Check if components are up and running (optional)

   * `sudo systemctl is-enabled notipp-server`
     * must show "enabled" status
   * `sudo systemctl is-enabled notipp-client`
     * must show "enabled" status
   * `which notipp-server`
     * must show something (like a path)
   * `which notipp-client`
     * must show something (like a path)
   * `notipp-server is:up`
     * must show "YES" as a response
6. **(Optional)** Self-add the server and test a notification.

  * This step will self-connect a computer to itself acting both as a sender and recipient. While this seems impractical for actual usage, it is a good method to test whether there are problems with the server and client communication process.
   * First, add the server.
     * `notipp-client add:server -i 127.0.0.1 -p 10443`
   * Then, emit pair the client in the server.
     * `notipp-client pair`
   * Then, try to emit a notification which should display a notification alert on the computer.
     * `notipp-server emit:notif "hello"`
   * Finally, disable or remove the server.
     * Disable: `notipp-client remove `
     * Remove:

## Usage

Please refer to the video below for more details.
