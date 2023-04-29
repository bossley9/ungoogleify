# Ungoogleify

Ungoogleify is a project designed to convert files exported from [Google Takeout](https://takeout.google.com/) into a more UNIX-friendly format. Specifically, it will:

* remove spaces from file names
* lowercase file names
* name photos using ISO 8601 date formats
* standardize photo formats (for example, from photo.jpeg to photo.jpg)

## Motivation

I've been trying to move all my data out of Google - in particular, the hundreds of thousands of photos and videos I have accumulated over time in Google Photos. I wanted to automate converting all of my exported media into a more user-friendly format.

I've also been looking for an excuse to play around with [Deno](https://deno.com/runtime)'s runtime and import system. I haven't touched it since it first was announced in 2018.

## Features

This project currently supports conversion for the following exported Google products:

* [Google Photos](https://photos.google.com/)

## Usage

```ts
deno task ungoogleify [takeout directory] [output directory]
```
