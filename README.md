# PlazaPanel Theme

An installable user-interface theme for ISPConfig 3.

## Contents

- theme/       PlazaPanel theme files
- install.sh   Fresh installation
- uninstall.sh Remove package-managed installation

## Requirements

- Compatible ISPConfig 3 installation
- Root access to the ISPConfig interface server
- Bash, tar and standard GNU/Linux utilities

## Installation

Extract the archive on the ISPConfig server.

As root, enter the plazapanel-theme directory:

    ./install.sh

The installer copies the theme to:

    /usr/local/ispconfig/interface/web/themes/plazapanel

It does not change the active ISPConfig theme.

## Activation

Sign in to ISPConfig.

Navigate to Tools > User Settings > Design,
select the PlazaPanel theme and save.

Log out and back in if necessary.

## Uninstallation

First switch users to the default theme.

Then run:

    ./uninstall.sh

## Compatibility

The theme was extracted from the PlazaPanel ISPConfig
development installation.

Compatibility with other ISPConfig releases must be
tested before production deployment.

The installer does not overwrite an existing theme.

## Scope

This package includes the visual theme only.

It does not install the PlazaPanel File Manager,
Django Hosting, Python workers or systemd services.
