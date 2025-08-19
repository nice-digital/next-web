# Structurizr Lite

> Structurizr Lite C4 Diagram generation tools

<details>
<summary><strong>Table of contents</strong></summary>
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Stack](#stack)
- [How to generate / update diagram](#how-to-generate--update-diagram)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
</details>

## Stack

- Docker
- Structurizr Lite [https://structurizr.com/help/lite](https://structurizr.com/help/lite)

## How to generate / update diagram

1. Make sure you have Docker installed and running
2. Download the Docker image using `docker pull structurizr/lite`
3. run `docker run -it --rm -p 8080:8080 -v  **local path**\assets\c4:/usr/local/structurizr structurizr/lite\` where **local path** is the path on your host machine
4. Connect to [http://localhost:8080/](http://localhost:8080/)
5. Make changes in dsl file and these are reflected in the web interface (you may need to press F5)
6. Export resulting diagram as png
