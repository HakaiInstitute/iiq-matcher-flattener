# IIQ MATCHER/FLATTENER

## Description

This is a small utility that modifies the raw image directories that store the imagery from the ACO plane. It is
intended to be used preceding use of IX Capture for generating 4-band CIR imagery. IX Capture often fails to properly
match images as a result of slight delays in the camera triggering. This can be overridden by having IX Capture import
the images "By File" rather than "By Directory", where it will instead use the sorted image lists to match the photos.

IIQ MATCHER/FLATTENER makes sure that are an equal number of both RGB and NIR images for importing into IX Capture "By
File", which is a requirement. It will also flatten the directory structure to make it possible to convert all images
simultaneously. Unmatched imagery will be moved to a "unmatched" subdirectory in the respective `CAMERA_RGB` or
`CAMERA_NIR` source directories.

[//]: # (Image)
<p style="display: flex; justify-content: center; align-items: center">
  <img src="img.png" alt="App Screenshot" height=400>
</p>

### Assumptions

This app has been designed to work with the following assumptions:

1. The raw images are stored in two directories: one for RGB images and one for NIR images.
2. The images are named in the format `yymmdd_HHMMSSddd.iiq`. They may or may not be located in a number of
   subdirectories of the form `yymmdd_HHMM`.

## Installation

Download the installer from the [releases page](https://github.com/HakaiInstitute/iiq-matcher-flattener/releases). The
installer will install the app and create a desktop shortcut.

## Usage

1. Select the RGB and NIR directories that contain the raw images. These are usually called "CAMERA_RGB" and
   "CAMERA_NIR", respectively.
2. Select the maximum shutter delay that is acceptable for the images to be matched. The default of 500ms is usually
   sufficient.

## Development

This app uses [Tauri](https://tauri.app/) to create a cross-platform desktop app. It is written in Rust and uses the
Tauri framework to create the GUI. The frontend uses React with TailwindCSS for styling. The backend is a very simple
Rust function that calls the [`ix-match`](https://github.com/HakaiInstitute/ix-match) library to match the images.

To run the dev server, install Tauri and run `npm run tauri dev` in the root directory. You can build the app with
`npm run tauri build`.

To release a new version, update the version tag in `src-tauri/tarui.conf.json` and then push a matching `v*.*.*` tag to
GitHub. A GitHub action will build the app and create a draft release.

This app has a configured auto-updater, so users will be informed of new versions of IIQ MATCHER/FLATTENER when they
become available.