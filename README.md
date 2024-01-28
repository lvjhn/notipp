# notipp

Web-Based Notification System for Linux and Android Devices in a LAN/WLAN

### Description

Notipp is a simple - prototypal/proof-of-concept - project. It is a web-based notification system designed for devices on a WLAN/LAN. The main purpose of the app is to send notifications from a **host device** to a **receiving device**. The host device can be any Linux distribution based on Ubuntu or Fedora. The system does not need to be connected to the internet and only requires Wi-Fi connectivity to work compared to Push Notifications which typically requires the internet to function.

## Installation

### Requirements

* **Host Device/s** - Linux-based systems running Ubuntu or Fedora
  * for **Ubuntu**-based distribuctions:
    * *apt* package manager
  * for **Fedora**-based distribution:
    * *dnf* package manager
  * for **Both**:
    * Node.js (preferrably via **Node Version Manager (NVM)**
    * NPM and Yarn (make sure to update the `PATH` variable in `.bashrc`or`.bash_profile`)
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

You can quickly install notipp by running: 


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

> This step will self-connect a computer to itself acting both as a sender and recipient. While this seems impractical for actual usage, it is a good method to test whether there are problems with the server and client communication process.

* **Step A:** First, add the server.

  * `notipp-client add:server -i 127.0.0.1 -p 10443`
* **Step B**: Then, emit pair the client in the server.

  * `notipp-client pair`
* **Step C:** Then, try to emit a notification which should display a notification alert on the computer.

  * `notipp-server emit:notif "hello"`
* **Step D**: Finally, disable or remove the server. Here, `<server-name>` is the name of the step shown in **Step A**.

  * **Disable**: `notipp-client update:server <server-name> --disable`
  * **Remove**: `notipp-client remove <server-name>`

## Usage (when Receiving Device is a Mobile Device)

> Please refer to the **Installation** section for instructions on how to install for the **host device**

Once Notipp is installed on the host device, you can now connect mobile devices on your the **host computer** that was set up in the **Installation** section. To connect a device to a **host computer, follow the steps below.

#### Stage 1: Install PWA

1. Visit `notipp.bitballoon.com`.
2. Install the **PWA** app on your phone (search for the "Install App") on the browser's menu.
3. Then, once the app is installed go to the `App Info` of the PWA and enable notification alerts (preferably, enable pop-up alerts).
4. Launch the **PWA** app (or visit the `notipp.bitballoon.com` on the browser).
5. **Lock** the app as a background process so that it keeps running. This prevents accidental closing of the app.

#### Stage 2: Install PWA

1. On your host device, visit the target PC's homepage **https://127.0.0.1:10443/**.
2. Then scan the QR code on your mobile device using your phone's QR code scanner. This should open your browser to download the CA certificate.
3. Install the **CA certificate** on your mobile phone using your Phone's system settings.

> You only need to do this once per device assuming that you will not connect to devices from another person.

#### Stage 3: Add Server and Pair Client

1. Go back to the `notipp.bitballon.com`. On the **Servers** page, click `+ Add`. Then, enter the target server's details, namely the **IP** and **Port** of the server to add.

   * You may also pair using QR code. Just visit `https://127.0.0.1:10443` on the host computer and scan the QR code found there.
2. Wait for the server to connect.

   * To check for successful connection, the server indicator beside the server's name must turn to yellow. This indicates that the client has successfully contacted the server and just needs to be paired.
   * If it takes time to turn to yello, you may try to reload the page.
3. On the host device, run `notipp-server pair` to pair the device.
4. Then, on the receiving device's side, wait for the circle beside the name to turn to green.

#### Stage 4: Send Notifications

1. On the host device, again, run `notipp-server emit:notif "Testing..."` to check for notification.
2. Wait for the notification to arrive on the receiving device, this shouldn't take so much time since the set-up is designed for WLAN/LAN.

## Usage (when Receiving Device is a Linux Device)

These steps should be performed when the receiving device is a Linux device running on another computer.

Generally, you need to  perform the same steps as in the **Instructions** section step except for the disabling part.

However, change the **IP** and **Port** in the system to the target server which is on another computer.

You don't need to manually install the CA when the receiving device is a computer running Linux.
