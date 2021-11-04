@echo off

rem Make sure we're in the correct path as per https://stackoverflow.com/a/46089175/486434
PUSHD %~dp0

npm run ping
