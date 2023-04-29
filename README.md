# Ungoogleify

Ungoogleify is a project designed to convert files exported from [Google Takeout](https://takeout.google.com/) into a more UNIX-friendly format. Specifically, it will:

* remove spaces from file names
* lowercase file names
* name photos using ISO 8601 date formats

## Motivation

I've been trying to move all my data out of Google - in particular, my hundreds of thousands of photos and videos stored in Google Photos. I've also been looking for an excuse to play around with Deno's runtime and import system. I haven't really touched it since it first was announced.

## Features

This project currently supports conversion for the following exported Google products:

* [Google Photos](https://photos.google.com/)

## Usage

```ts
deno task ungoogleify [takeout directory] [output directory]
```
