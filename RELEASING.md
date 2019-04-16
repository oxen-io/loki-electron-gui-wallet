# Releasing

Releasing the application to work with auto update is very simple.

1. Increment the application version in `package.json`
2. Create a github release with the **tag** being in the format `v[Version]`.
   - E.g if the version was `2.1.1` then the github tag would be `v2.1.1`
3. run `npm run build`
4. Upload all artifacts in `dist/electron-mat/Packaged/` to the github release
   - Mac: `latest-mac.yml`, `*.zip`, `*.dmg`, `*.blockmap`
   - Windows: `latest.yml`, `*.exe`, `*.blockmap`
   - Linux: `latest-linux.yml`, `*.snap`, `*.deb`, `*.AppImage`, `*.blockmap`
5. Ensure that the filenames in the `yml` files match up with the filename of the artifacts on github
    - E.g The mac **zip** should be named `loki-electron-wallet-[version]-mac.zip`
    - Please check the relevant `yml` file to get the naming
6. Add release notes
7. Publish the release!


